// main.js - Main application file

import { StorageManager } from './storage.js';
import { FlashMindLogic } from './logic.js';
import { UIRenderer } from './ui.js';

class FlashMind {
    constructor() {
        this.storage = new StorageManager('flashmind_sets');
        this.logic = new FlashMindLogic();
        this.ui = new UIRenderer();
        
        this.currentView = 'home'; // home, edit, game
        
        this.init();
    }

    // Initialize
    init() {
        const savedSets = this.storage.load();
        const sets = this.logic.initialize(savedSets);
        this.storage.save(sets);
        this.render();
    }

    // Render current view
    render() {
        if (this.currentView === 'home') {
            const sets = this.logic.getAllSets();
            this.ui.renderHome(sets);
        } else if (this.currentView === 'edit') {
            const editingSet = this.logic.getEditingSet();
            this.ui.renderEdit(editingSet);
        } else if (this.currentView === 'game') {
            const gameState = this.logic.getGameState();
            const selectedSet = this.logic.getSelectedSet();
            this.ui.renderGame(gameState, selectedSet);
        }

        this.attachEventListeners();
    }

    // Attach event listeners
    attachEventListeners() {
        // Action button handlers
        document.querySelectorAll('[data-action]').forEach(el => {
            el.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                const id = e.currentTarget.getAttribute('data-id');
                this.handleAction(action, id);
            });
        });

        // Set name change handler
        document.querySelectorAll('[data-field="set-name"]').forEach(el => {
            el.addEventListener('input', (e) => {
                this.logic.updateSetName(e.target.value);
            });
        });

        // Card change handlers
        document.querySelectorAll('[data-card-id]').forEach(el => {
            el.addEventListener('input', (e) => {
                const cardId = parseInt(e.target.getAttribute('data-card-id'));
                const field = e.target.getAttribute('data-field');
                this.logic.updateCard(cardId, field, e.target.value);
            });
        });
    }

    // Handle actions
    handleAction(action, id) {
        switch (action) {
            case 'create':
                this.createNewSet();
                break;
            case 'edit':
                this.editSet(parseInt(id));
                break;
            case 'delete':
                this.deleteSet(parseInt(id));
                break;
            case 'play':
                this.startGame(parseInt(id));
                break;
            case 'export':
                this.exportSet(parseInt(id));
                break;
            case 'import':
                this.importSet();
                break;
            case 'back':
                this.goBack();
                break;
            case 'add-card':
                this.addCard();
                break;
            case 'delete-card':
                this.deleteCard(parseInt(id));
                break;
            case 'save':
                this.saveSet();
                break;
            case 'know':
                this.handleKnow();
                break;
            case 'dont-know':
                this.handleDontKnow();
                break;
            case 'next':
                this.handleNext();
                break;
            case 'restart':
                this.restartGame();
                break;
            case 'exit':
                this.exitGame();
                break;
        }
    }

    // Actions for sets
    createNewSet() {
        this.logic.createNewSet();
        this.currentView = 'edit';
        this.render();
    }

    editSet(id) {
        this.logic.editSet(id);
        this.currentView = 'edit';
        this.render();
    }

    deleteSet(id) {
        if (confirm('Ви впевнені, що хочете видалити цей набір?')) {
            this.logic.deleteSet(id);
            this.storage.save(this.logic.getAllSets());
            this.render();
        }
    }

    exportSet(id) {
        const set = this.logic.getSetById(id);
        if (!set) return;

        const fileName = set.name.replace(/[^a-zA-Zа-яА-ЯіІїЇєЄ0-9]/g, '_');
        this.storage.exportToFile(set, fileName);
    }

    importSet() {
        this.storage.importFromFile((result) => {
            if (result.success) {
                const addResult = this.logic.addImportedSet(result.data);
                this.storage.save(addResult.sets);
                this.render();
                alert(`Набір "${addResult.set.name}" успішно імпортовано!`);
            } else {
                alert(result.error);
            }
        });
    }

    goBack() {
        this.currentView = 'home';
        this.render();
    }

    // --- Actions for cards ---

    addCard() {
        this.logic.addCard();
        this.render();
    }

    deleteCard(cardId) {
        this.logic.deleteCard(cardId);
        this.render();
    }

    saveSet() {
        const result = this.logic.saveSet();
        
        if (result.success) {
            this.storage.save(result.sets);
            this.currentView = 'home';
            this.render();
        } else {
            alert(result.error);
        }
    }

    // Actions for game
    startGame(id) {
        this.logic.startGame(id);
        this.currentView = 'game';
        this.render();
    }

    handleKnow() {
        const result = this.logic.handleKnow();
        
        if (result && result.sets) {
            // Game finished
            this.storage.save(result.sets);
        }
        
        this.render();
    }

    handleDontKnow() {
        this.logic.handleDontKnow();
        this.render();
    }

    handleNext() {
        const result = this.logic.handleNext();
        
        if (result && result.sets) {
            // Game finished
            this.storage.save(result.sets);
        }
        
        this.render();
    }

    restartGame() {
        this.logic.restartGame();
        this.render();
    }

    exitGame() {
        const result = this.logic.exitGame();
        
        // Save results only if game was completed naturally
        if (result && result.shouldSave) {
            this.storage.save(this.logic.getAllSets());
        }
        
        this.currentView = 'home';
        this.render();
    }
}

// Start application
const app = new FlashMind();