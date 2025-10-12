# FlashMind

Web application for creating and learning with flashcards.

## Key Features
- ✨ Create and edit card sets
- 📤 Import/export JSON sets
- 🎯 Drag & Drop file import
- 🤖 Card generation using AI (Gemini API)
- 🎮 Learning mode with score tracking
- 🎨 Custom UI components (dropdown, modals)

## Quick Start

### Local Setup
```powershell
# Python
python -m http.server 8000

# or Node.js
npx http-server . -p 8000
```

Open http://localhost:8000 in your browser

## Project Structure

```
FlashMind/
├── index.html          # Entry point
├── css/
│   └── style.css      # Styles
├── js/
│   ├── main.js        # Main module
│   ├── logic.js       # Business logic
│   ├── ui.js          # UI rendering
│   ├── storage.js     # LocalStorage + Import/Export
│   ├── dragdrop.js    # Drag & Drop handler
│   ├── ai.js          # AI generation (Gemini)
│   ├── modal.js       # Modal windows
│   ├── dropdown.js    # Custom dropdown
│   └── helpers.js     # Helper functions
└── Cities_Ukraine.json # Example set
```

## Development

### Core Modules
- **FlashMindLogic** (`logic.js`) - business logic
- **UIRenderer** (`ui.js`) - interface rendering
- **StorageManager** (`storage.js`) - localStorage operations
- **DragDropManager** (`dragdrop.js`) - Drag & Drop import
- **AIGenerator** (`ai.js`) - generation via Gemini API
- **ModalManager** (`modal.js`) - modal windows
- **CustomDropdown** (`dropdown.js`) - custom dropdown

### JSON Import/Export Format

```json
{
  "name": "Set Name",
  "cards": [
    {
      "question": "Question 1",
      "answer": "Answer 1"
    },
    {
      "question": "Question 2",
      "answer": "Answer 2" 
    }
  ]
}
```

### AI Generation

1. Set up API key:
```javascript
const ai = new AIGenerator();
ai.setApiKey('your-api-key');
```

2. Generate cards:
```javascript
const options = {
  topic: "Topic",
  count: 10,
  level: "medium",
  questionLang: "english",
  answerLang: "english"
};

const cards = await ai.generateCards(options);
```

### Drag & Drop Import

```javascript
const dragDrop = new DragDropManager('#dropzone', (result) => {
  if (result.success) {
    console.log('Imported:', result.data);
  } else {
    console.error('Error:', result.error);
  }
});
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

