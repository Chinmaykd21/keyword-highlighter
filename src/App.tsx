import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [keywords, setKeywords] = useState<string>("");
  const [userPermission, setUserPermission] = useState<boolean>(false);
  const [currentDomain, setCurrentDomain] = useState<string>("");

  // Load saved keywords
  useEffect(() => {
    try {
      chrome.storage.local.get("keywords", ({ keywords }) => {
        setKeywords(keywords?.join(", ") || "");
      });
    } catch (error) {
      console.error("Error loading keywords:", error);
    }
  }, []);

  // Check the current domain and permissions
  useEffect(() => {
    // Get the current active tab's domain
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        const url = new URL(tabs[0].url);
        const domain = url.hostname;
        setCurrentDomain(domain);

        if (domain.includes("www.linkedin.com")) {
          setUserPermission(true);
        } else {
          setUserPermission(false);
        }
      }
    });
  }, []);

  // Save keywords to storage
  const saveKeywords = () => {
    const keywordArray = keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => /^[a-zA-Z0-9]+$/.test(k));

    try {
      chrome.storage.local.set({ keywords: keywordArray }, () => {
        console.info("Keywords saved:", keywordArray);
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
      console.error("Error while clearing keywords:", error);
    }
  };

  return (
    <div className="popup-container">
      <h3>Keyword Highlighter</h3>

      {userPermission ? (
        <>
          {/* Full extension UI when permission is granted */}
          <textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Enter keywords separated by commas"
            rows={4}
            cols={40}
          />
          <div className="button-row">
            <button onClick={saveKeywords}>Save Keywords</button>
            <button className="clear-button" onClick={clearKeywords}>
              Clear Keywords
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Permission request UI */}
          <p>
            The extension does not have permission to run on domain:{" "}
            <strong>{currentDomain}</strong>.
          </p>
        </>
      )}
    </div>
  );
}

export default App;
