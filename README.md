# Keyword Highlighter Chrome Extension

The **Keyword Highlighter** Chrome Extension allows users to highlight specific keywords on any webpage. Users can enter keywords through the extension popup, save them, and see the highlights applied dynamically on the webpage. The extension supports clearing highlights and synchronizes updates across tabs.

---

## Features

- Dynamically highlight user-defined keywords on webpages.
- Clear highlighted keywords across all tabs.
- Save and persist keywords until manually cleared.
- Works on HTTP and HTTPS pages.
- Simple, responsive popup interface for entering and managing keywords.
- Domain-specific keyword functionality (planned).

---

## Technologies Used

- **React** for the popup UI.
- **TypeScript** for robust, type-safe development.
- **Vite** for a fast development build system.
- **Chrome Extensions Manifest V3** for background scripts, content scripts, and storage.

---

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the extension:

   ```bash
   npm run build
   ```

4. Load the unpacked extension in Chrome:

   - Open `chrome://extensions/` in your browser.
   - Enable **Developer Mode** (toggle in the top-right corner).
   - Click **Load unpacked** and select the `dist` folder inside the project directory.

5. The extension should now appear in your Chrome toolbar!

---

## Usage Instructions

### Adding and Highlighting Keywords

1. Click the **Keyword Highlighter** extension icon in the toolbar to open the popup.
2. Enter keywords separated by commas in the textarea (e.g., `example, test, chrome`).
3. Click the **Save Keywords** button.
4. Navigate to a webpage and see the keywords highlighted.

### Clearing Highlights

1. Open the extension popup.
2. Click the **Clear Keywords** button.
3. The highlights will be removed from all tabs.

---

## Example Walkthrough

### Step 1: Open the Popup

![Popup Interface](https://via.placeholder.com/300x200.png)

### Step 2: Enter Keywords

Type the keywords you want to highlight in the provided textarea.

Example:

```
highlight, keyword, chrome
```

### Step 3: Save Keywords

Click **Save Keywords** and navigate to a webpage. The specified keywords will be highlighted automatically.

Example Output on a Webpage:

```html
<p>
  Here is an example of the word
  <span style="background-color: yellow;">highlight</span>.
</p>
```

### Step 4: Clear Keywords

Click **Clear Keywords** in the popup to remove all highlights.

---

## Folder Structure

```
.
├── dist/               # Build output for Chrome Extension
├── public/             # Public assets (icons, etc.)
├── src/                # Source code
│   ├── App.tsx        # Popup UI component
│   ├── contentScript.js  # Content script for DOM manipulation
│   ├── serviceWorker.js  # Background service worker
│   └── popup.css       # Styling for popup UI
├── manifest.json      # Chrome Extension manifest
├── package.json       # Dependencies and scripts
├── vite.config.ts     # Vite configuration
└── README.md          # Project documentation
```

---

## Development Workflow

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Modify the source files (`App.tsx`, `contentScript.js`, etc.).
3. Rebuild the project using:

   ```bash
   npm run build
   ```

4. Reload the extension on `chrome://extensions/`.

---

## Planned Features

- Domain-specific keyword highlighting.
- Customizable highlight colors.
- Keyboard shortcuts for navigating highlights.
- Import/export keyword lists.

---

## Security Considerations

- **Content Security Policy (CSP)**: Uses a strict CSP to prevent injection attacks.
- **User Input Validation**: Sanitizes keywords to prevent XSS vulnerabilities.
- **Permission Minimization**: Restricts host permissions to only required domains.

---

## License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it as per the license terms.

---

## Contribution

Feel free to submit issues or pull requests for bug fixes or feature enhancements. For major changes, please open an issue to discuss the planned changes first.

---

Happy Coding! 🎉
