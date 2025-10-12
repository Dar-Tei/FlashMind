# FlashMind

Веб-додаток для створення та навчання з флеш-картками (українською).

## Основні функції
- Створення та редагування наборів карток
- Імпорт/експорт JSON наборів
- Drag & Drop імпорт файлів
- Генерація карток через AI (Gemini API)
- Режим гри з підрахунком результатів
- Кастомні UI компоненти (dropdown, modals)

## Швидкий старт

### Локальний запуск
```powershell
# Python
python -m http.server 8000

# або Node.js
npx http-server . -p 8000
```

Відкрийте http://localhost:8000 у браузері

## Структура проекту

```
FlashMind/
├── index.html          # Точка входу
├── css/
│   └── style.css      # Стилі
├── js/
│   ├── main.js        # Головний модуль
│   ├── logic.js       # Бізнес-логіка
│   ├── ui.js          # Рендеринг UI
│   ├── storage.js     # LocalStorage + Import/Export
│   ├── dragdrop.js    # Drag & Drop обробник
│   ├── ai.js          # AI генерація (Gemini)
│   ├── modal.js       # Модальні вікна 
│   ├── dropdown.js    # Кастомний dropdown
│   └── helpers.js     # Допоміжні функції
└── Міста_України.json # Приклад набору
```

## Розробка

### Основні модулі
- **FlashMindLogic** (`logic.js`) - бізнес-логіка
- **UIRenderer** (`ui.js`) - рендеринг інтерфейсу  
- **StorageManager** (`storage.js`) - робота з localStorage
- **DragDropManager** (`dragdrop.js`) - Drag & Drop імпорт
- **AIGenerator** (`ai.js`) - генерація через Gemini API
- **ModalManager** (`modal.js`) - модальні вікна
- **CustomDropdown** (`dropdown.js`) - кастомний dropdown

### JSON формат для імпорту/експорту

```json
{
  "name": "Назва набору",
  "cards": [
    {
      "question": "Питання 1",
      "answer": "Відповідь 1"
    },
    {
      "question": "Питання 2", 
      "answer": "Відповідь 2"
    }
  ]
}
```

### AI генерація

1. Встановіть API ключ:
```javascript
const ai = new AIGenerator();
ai.setApiKey('your-api-key');
```

2. Згенеруйте картки:
```javascript
const options = {
  topic: "Тема",
  count: 10,
  level: "середній",
  questionLang: "українська",
  answerLang: "українська"
};

const cards = await ai.generateCards(options);
```

### Drag & Drop імпорт

```javascript
const dragDrop = new DragDropManager('#dropzone', (result) => {
  if (result.success) {
    console.log('Імпортовано:', result.data);
  } else {
    console.error('Помилка:', result.error);
  }
});
```

## Внесок

1. Fork репозиторій
2. Створіть feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit зміни (`git commit -m 'Add some AmazingFeature'`)
4. Push у branch (`git push origin feature/AmazingFeature`)
5. Відкрийте Pull Request

## Ліцензія

[MIT](LICENSE)