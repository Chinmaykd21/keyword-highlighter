import "./App.css";
import { useRef, useState } from "react";

function App() {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);

  const highlightKeywords = async () => {
    if (!textAreaRef.current) return;

    const newKeywords = textAreaRef.current.value
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k);

    const combinedKeywords = Array.from(new Set([...keywords, ...newKeywords])); // Combine old and new keywords
    setKeywords(combinedKeywords);

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: (allKeywords: string[]) => {
        const highlightText = (node: Node, keywords: string[]) => {
          if (!node || !node.childNodes) return;

          const keywordRegex = new RegExp(
            `\\b(${keywords.join("|")})\\b`,
            "gi"
          );

          Array.from(node.childNodes).forEach((child) => {
            if (child.nodeType === Node.ELEMENT_NODE) {
              const element = child as HTMLElement;

              // Skip specific elements
              if (
                ["SCRIPT", "STYLE", "TEXTAREA", "INPUT"].includes(
                  element.tagName
                )
              ) {
                return;
              }

              // If the element is already highlighted, process its children
              if (
                element.tagName === "SPAN" &&
                element.style.backgroundColor === "yellow"
              ) {
                highlightText(element, keywords);
                return;
              }

              // Recursively process other element nodes
              highlightText(child, keywords);
            } else if (child.nodeType === Node.TEXT_NODE) {
              const textContent = child.nodeValue;
              if (textContent && keywordRegex.test(textContent)) {
                const fragment = document.createDocumentFragment();
                let lastIndex = 0;

                // Highlight matched keywords
                textContent.replace(keywordRegex, (matched, ...args) => {
                  const matchIndex = args[args.length - 2];

                  // Append text before the match
                  const beforeMatch = textContent.slice(lastIndex, matchIndex);
                  if (beforeMatch) {
                    fragment.appendChild(document.createTextNode(beforeMatch));
                  }

                  // Append the matched keyword as a highlighted span
                  const span = document.createElement("span");
                  span.style.backgroundColor = "yellow";
                  span.textContent = matched;
                  fragment.appendChild(span);

                  lastIndex = matchIndex + matched.length;
                  return matched;
                });

                // Append remaining text after the last match
                const afterMatch = textContent.slice(lastIndex);
                if (afterMatch) {
                  fragment.appendChild(document.createTextNode(afterMatch));
                }

                // Replace the text node with the new fragment
                child.parentNode?.replaceChild(fragment, child);
              }
            }
          });
        };
        highlightText(document.body, allKeywords);
      },
      args: [combinedKeywords], // Add the keywords dynamically from user input
    });
  };

  const resetHighlightedKeywords = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => {
        const revertText = (node: Node) => {
          if (!node || !node.childNodes) return;

          Array.from(node.childNodes).forEach((child) => {
            if (child.nodeType === Node.ELEMENT_NODE) {
              const element = child as HTMLElement;

              if (
                element.tagName === "SPAN" &&
                element.style.backgroundColor === "yellow"
              ) {
                // Replace the <span> with its text content
                const parent = element.parentNode;
                parent?.replaceChild(
                  document.createTextNode(element.textContent || ""),
                  element
                );
              } else {
                revertText(child); // Recursively process child nodes
              }
            }
          });
        };

        revertText(document.body);
      },
    });

    setKeywords([]); // Clear the keywords list
  };

  return (
    <>
      <h3>Keyword Highlighter</h3>
      <div className="card">
        {/* TODO: Apply styling to adjust fonts */}
        <p className="card-description">
          Enter keywords that you want to highlight separated by comma
        </p>
        <textarea
          className="card-textarea"
          ref={textAreaRef}
          placeholder="Please enter keywords separated by comma"
          rows={5}
          cols={45}
        ></textarea>
        {/* TODO: Apply styling to these buttons */}
        <button className="card-button" onClick={highlightKeywords}>
          Highlight Keywords
        </button>
        <button className="card-button" onClick={resetHighlightedKeywords}>
          Reset
        </button>
      </div>
    </>
  );
}

export default App;
