// storage.js - Module for working with LocalStorage

export class StorageManager {
    constructor(storageKey = 'flashmind_sets') {
        this.storageKey = storageKey;
    }

    // Save data to LocalStorage
    save(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Save error:', error);
            return false;
        }
    }

    // Load data from LocalStorage
    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Load error:', error);
            return null;
        }
    }

    // Clear LocalStorage
    clear() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Clear error:', error);
            return false;
        }
    }

    // Export set to JSON file
    exportToFile(setData, fileName) {
        const exportData = {
            name: setData.name,
            cards: setData.cards.map(card => ({
                question: card.question,
                answer: card.answer
            }))
        };

        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Import set from JSON file
    importFromFile(callback) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);

                    if (!data.name || !Array.isArray(data.cards)) {
                        callback({ success: false, error: 'Невірний формат файлу!' });
                        return;
                    }

                    const validCards = data.cards.filter(c =>
                        c.question && c.answer &&
                        typeof c.question === 'string' &&
                        typeof c.answer === 'string'
                    );

                    if (validCards.length === 0) {
                        callback({ success: false, error: 'У файлі немає валідних карток!' });
                        return;
                    }

                    callback({ success: true, data: { name: data.name, cards: validCards } });
                } catch (error) {
                    callback({ success: false, error: 'Помилка читання файлу. Переконайтесь, що це валідний JSON.' });
                }
            };

            reader.readAsText(file);
        };

        input.click();
    }
}
