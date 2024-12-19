import { useState, useEffect } from "react";

function App() {
  const [keywords, setKeywords] = useState<string>("");

  // Load saved keywords
  useEffect(() => {
    chrome.storage.local.get("keywords", ({ keywords }) => {
      setKeywords(keywords?.join(", ") || "");
    });
  }, []);

  // Save keywords to storage
  const saveKeywords = () => {
    const keywordArray = keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    chrome.storage.local.set({ keywords: keywordArray }, () => {
      alert("Keywords saved!");
    });

    // Notify service worker to re-inject the content script
    chrome.runtime.sendMessage({ action: "highlight keywords" });
  };

  // Clear all saved keywords
  const clearKeywords = () => {
    chrome.storage.local.remove("keywords", () => {
      setKeywords("");
      alert("Keywords cleared!");
    });

    chrome.runtime.sendMessage({ action: "clear keywords" });
  };

  return (
    <div>
      <h3>Keyword Highlighter</h3>
      <textarea
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        placeholder="Enter keywords separated by commas"
        rows={4}
        cols={40}
      />
      <br />
      <button onClick={saveKeywords}>Save Keywords</button>
      <button onClick={clearKeywords}>Clear Keywords</button>
    </div>
  );
}

export default App;
