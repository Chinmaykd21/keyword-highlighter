import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [keywords, setKeywords] = useState<string>("");

  // Load saved keywords
  useEffect(() => {
    try {
      chrome.storage.local.get("keywords", ({ keywords }) => {
        setKeywords(keywords?.join(", ") || "");
      });
    } catch (error) {
      console.error("Error in content script:", error);
    }
  }, []);

  // Save keywords to storage
  const saveKeywords = () => {
    const keywordArray = keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    try {
      chrome.storage.local.set({ keywords: keywordArray }, () => {
        console.info("Keywords saved", keywordArray);
      });

      // Notify service worker to re-inject the content script
      chrome.runtime.sendMessage({ action: "highlight keywords" });
    } catch (error) {
      console.error("Error while saving keywords:", error);
    }
  };

  // Clear all saved keywords
  const clearKeywords = () => {
    try {
      chrome.storage.local.remove("keywords", () => {
        setKeywords("");
        console.info("Keywords cleared");
      });

      chrome.runtime.sendMessage({ action: "clear keywords" });
    } catch (error) {
      console.error("Error while clearing keywords: ", error);
    }
  };

  return (
    <div className="popup-container">
      <h3>Keyword Highlighter</h3>
      <textarea
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        placeholder="Enter keywords separated by commas"
        rows={4}
        cols={40}
      />
      <br />
      <div className="button-row">
        <button onClick={saveKeywords}>Save Keywords</button>
        <button className="clear-button" onClick={clearKeywords}>
          Clear Keywords
        </button>
      </div>
    </div>
  );
}

export default App;
