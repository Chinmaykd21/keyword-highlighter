import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useRef } from "react";

function App() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const highlightKeywords = async () => {
    if (!inputRef.current) return;

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: (keywords) => {
        const highlightText = (node: Node, keywords: string[]) => {
          if (!node || !node.childNodes) return;

          const keywordRegex = new RegExp(
            `\\b(${keywords.join("|")})\\b`,
            "gi"
          );
          node.childNodes.forEach((child) => {
            if (child.nodeType === node.TEXT_NODE) {
              const match = child.nodeValue?.match(keywordRegex);
              if (match && child.nodeValue) {
                const span = document.createElement("span");
                span.style.backgroundColor = "yellow";
                span.textContent = child.nodeValue.replace(
                  keywordRegex,
                  (matched) => {
                    return matched;
                  }
                );

                child.replaceWith(span);
              }
            } else if (child.nodeType === node.ELEMENT_NODE) {
              const element = child as HTMLElement;
              if (
                ["SCRIPT", "STYLE", "INPUT", "TEXTAREA"].includes(
                  element.tagName
                )
              ) {
                return; // Skip non-text elements
              }
              highlightText(child, keywords);
            }
          });
        };
        const keywordsArray = keywords.split(",").map((k) => k.trim());
        highlightText(document.body, keywordsArray);
      },
      args: ["citizenship, react, React"], // Add the keywords dynamically from user input
    });
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Keyword Highlighter</h1>
      <div className="card">
        <p>Enter keywords that you want to highlight separated by comma</p>
        <input
          ref={inputRef}
          type="text"
          placeholder="e.g., React, JavaScript, TypeScript"
        />
        <button onClick={() => highlightKeywords()}>Highlight Keywords</button>
      </div>
    </>
  );
}

export default App;
