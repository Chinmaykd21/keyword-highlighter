// Helper function to inject the content script into a given tab
async function injectScriptIfNeeded(tab) {
  if (!tab.url) {
    console.warn("Tab URL not found. Skipping injection.");
    return;
  }

  const domain = new URL(tab.url).hostname;

  // Only inject for LinkedIn or if the domain has granted permissions
  if (domain === "www.linkedin.com" || (await isPermissionGranted(domain))) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["contentScript.js"],
      });
      console.info(`Content script injected into ${tab.url}`);
    } catch (err) {
      console.error(`Failed to inject content script into ${tab.url}:`, err);
    }
  } else {
    console.log(`Extension not allowed to run on this domain: ${domain}`);
  }
}

// Check if permissions are granted for a specific domain
async function isPermissionGranted(domain) {
  return new Promise((resolve) => {
    chrome.permissions.contains({ origins: [`https://${domain}/*`] }, resolve);
  });
}

// Listen for messages from the popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, domain } = message;

  switch (action) {
    case "grant permission":
      chrome.permissions.request(
        { origins: [`https://${domain}/*`] },
        async (granted) => {
          if (granted) {
            console.info(`Permission granted for ${domain}`);
            // Inject the content script if the user grants permission
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              if (tabs[0]?.id) {
                injectScriptIfNeeded(tabs[0]);
              }
            });
          } else {
            console.warn(`Permission denied for ${domain}`);
          }
        }
      );
      break;

    case "highlight keywords":
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          injectScriptIfNeeded(tabs[0]);
        }
      });
      break;

    case "clear keywords":
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.id && /^https?:\/\//.test(tab.url)) {
            chrome.tabs.sendMessage(tab.id, { action: "clear keywords" });
          }
        });
      });
      break;

    default:
      console.warn(`Unknown action received: ${action}`);
  }
});

// Monitor active tab changes and inject scripts as needed
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  injectScriptIfNeeded(tab);
});

// Monitor tab updates and inject scripts when the page is fully loaded
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    injectScriptIfNeeded(tab);
  }
});
