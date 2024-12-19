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
              document.createTextNode(textContent.slice(lastIndex, matchIndex))
            );

            const span = document.createElement("span");
            span.style.backgroundColor = "yellow";
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

// Fetch stored keywords and apply highlights
chrome.storage.local.get("keywords", ({ keywords }) => {
  if (keywords && keywords.length > 0) {
    console.log("Fetched Keywords:", keywords);
    highlightKeywords(keywords);
  }
});
