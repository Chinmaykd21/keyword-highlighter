// This immediately invoked function expression is done in order to
// variable name collisions. IIFE ensures that variables are scoped
// to the script and do not leak into global namespace
(() => {
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Highlight keywords on the page
  function highlightKeywords(keywords) {
    const highlightText = (node, keywords) => {
      if (!node || !node.childNodes) return;

      const keywordRegex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");

      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const element = child;

          // Skip certain elements
          if (
            ["SCRIPT", "STYLE", "TEXTAREA", "INPUT"].includes(element.tagName)
          ) {
            return;
          }

          highlightText(child, keywords);
        } else if (child.nodeType === Node.TEXT_NODE) {
          const textContent = child.nodeValue;
          if (textContent && keywordRegex.test(textContent)) {
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;

            textContent.replace(keywordRegex, (match, ...args) => {
              const matchIndex = args[args.length - 2];

              fragment.appendChild(
                document.createTextNode(
                  textContent.slice(lastIndex, matchIndex)
                )
              );

              const span = document.createElement("span");
              span.style.backgroundColor = "yellow";
              span.style.color = isDarkMode ? "black" : "inherit";
              span.textContent = match;
              fragment.appendChild(span);

              lastIndex = matchIndex + match.length;
              return match;
            });

            fragment.appendChild(
              document.createTextNode(textContent.slice(lastIndex))
            );

            child.parentNode.replaceChild(fragment, child);
          }
        }
      });
    };

    highlightText(document.body, keywords);
  }

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedHighlightKeywords = debounce(highlightKeywords, 500);

  // Fetch stored keywords and apply highlights
  chrome.storage.local.get("keywords", ({ keywords }) => {
    if (keywords && keywords.length > 0) {
      debouncedHighlightKeywords(keywords);
    }
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "clear keywords") {
      const removeHighlights = (node) => {
        if (!node || !node.childNodes) return;

        Array.from(node.childNodes).forEach((child) => {
          if (child.nodeType === Node.ELEMENT_NODE) {
            const element = child;

            if (
              element.tagName === "SPAN" &&
              element.style.backgroundColor === "yellow"
            ) {
              const parent = element.parentNode;
              parent?.replaceChild(
                document.createTextNode(element.textContent || ""),
                element
              );
            } else {
              removeHighlights(child); // Process child nodes
            }
          }
        });
      };

      removeHighlights(document.body);
    }
  });
})();
