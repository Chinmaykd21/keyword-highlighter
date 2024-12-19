// Helper function to inject the content script into a given tab
async function injectScriptIfNeeded(tab) {
  if (!tab.url) {
    console.warn("Tab URL not found. Skipping injection.");
    return;
  }

  const domain = new URL(tab.url).hostname;

  // Only inject for LinkedIn
  if (domain === "www.linkedin.com") {
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

// Listen for messages from the popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action } = message;

  switch (action) {
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
