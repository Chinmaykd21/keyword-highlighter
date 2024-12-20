# Keyword Highlighter Chrome Extension

## Overview

The **Keyword Highlighter** is a Chrome extension that allows users to highlight specified keywords on LinkedIn webpages. It provides a user-friendly popup for managing keywords, with real-time storage and retrieval using Chrome's local storage API. It ensures seamless integration with LinkedIn by leveraging Chrome's scripting and content script mechanisms.

---

## Features

- **Keyword Highlighting**: Automatically highlights user-defined keywords on LinkedIn webpages.
- **Real-Time Keyword Management**: Add, save, and clear keywords through an intuitive popup interface.
- **Domain-Specific Functionality**: Runs only on LinkedIn (`www.linkedin.com`).
- **Debounced Highlighting**: Efficient performance with debounced keyword updates.
- **Lightweight and Secure**: Adheres to Chrome's Manifest V3 standards for security.

---

## File Structure

### **Frontend**

- **`index.html`**  
  Entry point for the popup UI, containing the root DOM element for React rendering.

- **`App.tsx`**  
  Main React component that handles:

  - Rendering the popup UI.
  - Managing state for keywords and permissions.
  - Interfacing with Chrome's storage and messaging APIs.

- **`App.css`**  
  Styles for the popup interface, including responsive layouts and button interactions.

### **Backend**

- **`service-worker.js`**  
  Background script responsible for:

  - Listening to user actions (e.g., saving/clearing keywords).
  - Injecting the content script into LinkedIn tabs.

- **`content-script.js`**  
  Content script that:
  - Fetches stored keywords and highlights them on the webpage.
  - Removes highlights when keywords are cleared.

---

## Installation

1. Clone the repository.
   ```bash
   git clone https://github.com/your-repo/keyword-highlighter.git
   ```
2. Install dependencies.
   ```bash
   npm install
   ```
3. Build the project.
   ```bash
   npm run build
   ```
4. Load the extension in Chrome:
   - Go to `chrome://extensions`.
   - Enable **Developer mode**.
   - Click **Load unpacked** and select the build folder.

---

## Usage

1. Open LinkedIn in Chrome.
2. Click on the **Keyword Highlighter** extension icon.
3. Enter keywords in the text area (comma-separated) and click **Save Keywords**.
4. Keywords will be highlighted on the webpage.
5. To clear highlights, click **Clear Keywords**.

---

## Configuration

### **manifest.json**

Key configurations:

- **Permissions**:  
  `scripting`, `tabs`, `activeTab`, `storage`
- **Host Permissions**:  
  Allows the extension to run only on LinkedIn URLs.

- **Content Scripts**:  
  Injects `content-script.js` into LinkedIn pages during idle time.

### **package.json**

- **Dependencies**:
  - `react`, `react-dom` for UI.
  - `typescript` for type safety.
- **DevDependencies**:
  - `eslint`, `@vitejs/plugin-react` for linting and bundling.

---

## Development

1. Run the development server:
   ```bash
   npm run dev
   ```
2. Open the extension in Chrome and test changes in real-time.

---

## Technologies Used

- **React**: Frontend framework for the popup UI.
- **TypeScript**: Strongly-typed JavaScript for maintainable code.
- **Vite**: Fast build tool for bundling.
- **Chrome Extension API**: For interacting with browser tabs, storage, and scripting.

---

## Limitations

- Currently restricted to LinkedIn domains.
- Highlighting might not persist if the page reloads or content dynamically changes without an update from the extension.

---

## Contributing

1. Fork the repository.
2. Create a new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit changes and open a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

- This project was inspired by the need to enhance browser search functionality, which traditionally supports only one keyword (exact match) at a time.
- The Keyword Highlighter extension addresses this limitation by enabling users to highlight multiple keywords simultaneously, separated by commas, offering a more flexible and efficient browsing experience.
