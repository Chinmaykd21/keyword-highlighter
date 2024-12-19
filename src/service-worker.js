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
