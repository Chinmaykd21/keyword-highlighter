// TODO: Add LinkedInURL so that extension works only on LinkedIn

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "ON",
  });
});
