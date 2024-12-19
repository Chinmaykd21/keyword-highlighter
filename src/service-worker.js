chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "highlight keywords") {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        if (tabs.length > 0 && tabs[0].id) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ["contentScript.js"],
          });
        }
      }
    );
  }
});

// Monitor active tab changes and tab updates
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  injectScriptIfNeeded(tab);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    injectScriptIfNeeded(tab);
  }
});

// Inject content script for matching URLs
async function injectScriptIfNeeded(tab) {
  if (tab.url && /^https?:\/\//.test(tab.url)) {
    console.log("Injection Successful");
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["contentScript.js"],
      });
    } catch (err) {
      console.error("Failed to inject content script:", err);
    }
  }
}
