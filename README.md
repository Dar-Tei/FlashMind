# FlashMind — Flashcard Web Application

## Overview
**FlashMind** is a lightweight client-side flashcard web application built with plain ES modules (JavaScript), HTML, and CSS.  
It stores card sets in `localStorage`, supports creating and editing sets, importing/exporting sets in JSON format, and a simple play mode for self-testing.  
The app targets modern browsers that support ES modules.

## Key Features
- Create, edit, and delete flashcard sets  
- Add, remove, and reorder cards within a set  
- Play mode with progress tracking and scoring  
- Import and export sets as JSON files  
- Persistent data via `localStorage`  
- Responsive layout for desktop and mobile

## Quick Start
### 1. Clone the repository
```
git clone <repository-url>
cd <repository-folder>
```

###2. Serve files locally
Using Python (default on most systems):
```
python -m http.server 8000
# Open http://localhost:8000 in your browser
```

Or using Node.js:
```
npx http-server . -p 8080
# Open http://localhost:8080
```

> **Note:** Opening files directly with `file://` may cause ES module import errors.  
> Use a local HTTP server instead.

##File Structure:

```
/ (project root)
├─ index.html              # Application entry point
├─ js/
│  ├─ main.js              # App bootstrap & controller
│  ├─ logic.js             # Core logic (FlashMindLogic)
│  ├─ ui.js                # UI rendering (UIRenderer)
│  └─ storage.js           # Local storage and JSON import/export
├─ css/
│  └─ style.css            # Main styles and responsiveness
├─ icon.webp               # Site icon
└─ README.md
```

##Data Format (Import / Export)
Example JSON structure:
```
{
  "name": "Ukrainian Cities",
  "cards": [
    { "question": "Named after a river", "answer": "Dnipro" },
    { "question": "Where were the Cossacks?", "answer": "Zaporizhzhia" },
    { "question": "Capital of Ukraine", "answer": "Kyiv" }
  ]
}
```
- Each file must contain a `name` field and a `cards` array  
- Only cards with non-empty `question` and `answer` are accepted

##Behavior and Persistence
- Flashcard sets are stored under the key flashmind_sets in localStorage
- Score data is stored in lastScore (integer, percentage)
- IDs are generated using Date.now() with offsets

>Note: Timestamp-based IDs are simple but not collision-proof under very rapid operations.

##Deployment to GitHub PagesDeployment to GitHub Pages
- Push the repository to GitHub
- In repository settings, enable **GitHub Pages**
  - Source: `main` branch (or `gh-pages`)
  - Folder: `/ (root)`
- Verify that `index.html` is in the repository root
- If routing is added later, configure a 404 fallback

##Development Notes and Future Roadmap
- Replace timestamp-based IDs with UUIDs
- Add automated unit tests for logic.js and storage.js
- Implement spaced repetition (e.g., SM-2 algorithm)
- Optional backend sync for multi-device usage
- Improve import validation and preview before applying
- Add internationalization (i18n) support
- Integrate linting and CI/CD via GitHub Actions
- Enhance accessibility (keyboard navigation, ARIA, contrast mode)

##Security and Privacy
- All data is stored locally in the browser
- No external servers or APIs are used
- Avoid storing sensitive personal information
- For future sync features, ensure HTTPS and secure authent

Troubleshooting
---------------

| Issue | Possible Cause | Solution |
| --- | --- | --- |
| Import fails | Missing fields or invalid structure | Check for `"name"` and `"cards"` |
| Changes not saved | Browser storage full or blocked | Clear local data or adjust privacy settings |
| ES module import error | Files opened directly | Use local HTTP server instead |

##Contribution
- Fork the repository
- Create a feature branch
- Implement and test your changes
- Submit a pull request with a detailed description

##Contact and Acknowledgements
- Report issues via the GitHub issue tracker
- Mention contributors and third-party assets (if any)




