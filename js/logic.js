// logic.js - Business logic module

export class FlashMindLogic {
    constructor() {
        this.sets = [];
        this.selectedSet = null;
        this.editingSet = null;
        this.gameState = null;
    }

    // Initialize with data
    initialize(savedSets) {
        if (savedSets && savedSets.length > 0) {
            this.sets = savedSets;
        } else {
            this.sets = this.createDefaultSet();
        }
        return this.sets;
    }

    // Create example set
    createDefaultSet() {
        return [{
            id: Date.now(),
            name: 'Англійські слова',
            cards: [
                { id: 1, question: 'Hello', answer: 'Привіт' },
                { id: 2, question: 'World', answer: 'Світ' },
                { id: 3, question: 'Learn', answer: 'Вчити' }
            ],
            lastScore: null
        }];
    }

    // Get all sets
    getAllSets() {
        return this.sets;
    }

    // Get set by ID
    getSetById(id) {
        return this.sets.find(s => s.id === id);
    }

    // Create new set
    createNewSet() {
        this.editingSet = {
            id: null,
            name: '',
            cards: [{ id: Date.now(), question: '', answer: '' }]
        };
        return this.editingSet;
    }
    // Create new set with pre-filled cards
    createNewSetWithCards(name, cards) {
        const newSet = {
            id: Date.now(),
            name: name,
            cards: cards.map((card, index) => ({
                id: Date.now() + index,
                question: card.question.trim(),
                answer: card.answer.trim()
            })),
            lastScore: null
        };

        this.sets.push(newSet);
        return newSet;
    }

    // Edit set
    editSet(id) {
        const set = this.getSetById(id);
        this.editingSet = JSON.parse(JSON.stringify(set));
        return this.editingSet;
    }

    // Delete set
    deleteSet(id) {
        this.sets = this.sets.filter(s => s.id !== id);
        return this.sets;
    }

    // Add card
    addCard() {
        if (!this.editingSet) return null;
        const newCard = { id: Date.now(), question: '', answer: '' };
        this.editingSet.cards.push(newCard);
        return this.editingSet;
    }

    // Update card
    updateCard(cardId, field, value) {
        if (!this.editingSet) return null;
        const card = this.editingSet.cards.find(c => c.id === cardId);
        if (card) {
            card[field] = value;
        }
        return this.editingSet;
    }

    // Delete card
    deleteCard(cardId) {
        if (!this.editingSet || this.editingSet.cards.length <= 1) return null;
        this.editingSet.cards = this.editingSet.cards.filter(c => c.id !== cardId);
        return this.editingSet;
    }

    // Update set name
    updateSetName(name) {
        if (!this.editingSet) return null;
        this.editingSet.name = name;
        return this.editingSet;
    }

    // Save set
    saveSet() {
        if (!this.editingSet) return { success: false, error: 'Немає набору для збереження' };

        if (!this.editingSet.name.trim()) {
            return { success: false, error: 'Відсутня назва набору' };
        }

        const validCards = this.editingSet.cards.filter(c => c.question.trim() && c.answer.trim());
        if (validCards.length === 0) {
            return { success: false, error: 'У набор не додано картки' };
        }

        const newSet = { ...this.editingSet, cards: validCards };

        if (this.editingSet.id) {
            this.sets = this.sets.map(s => s.id === this.editingSet.id ? newSet : s);
        } else {
            newSet.id = Date.now();
            newSet.lastScore = null;
            this.sets.push(newSet);
        }

        this.editingSet = null;
        return { success: true, sets: this.sets };
    }

    // Add imported set
    addImportedSet(importedData) {
        const newSet = {
            id: Date.now(),
            name: importedData.name,
            cards: importedData.cards.map((card, index) => ({
                id: Date.now() + index,
                question: card.question.trim(),
                answer: card.answer.trim()
            })),
            lastScore: null
        };

        this.sets.push(newSet);
        return { success: true, set: newSet, sets: this.sets };
    }

    // Start game
    startGame(id) {
        const set = this.getSetById(id);
        if (!set) return null;

        this.selectedSet = set;
        this.gameState = {
            currentIndex: 0,
            showAnswer: false,
            correctCount: 0,
            cards: [...set.cards],
            finished: false,
            finalScore: 0
        };
        return this.gameState;
    }

    // Handle "I know"
    handleKnow() {
        if (!this.gameState) return null;

        this.gameState.currentIndex++;
        this.gameState.correctCount++;
        this.gameState.showAnswer = false;

        if (this.gameState.currentIndex >= this.gameState.cards.length) {
            return this.finishGame();
        }

        return this.gameState;
    }

    // Handle "I don't know"
    handleDontKnow() {
        if (!this.gameState) return null;
        this.gameState.showAnswer = true;
        return this.gameState;
    }

    // Next card
    handleNext() {
        if (!this.gameState) return null;

        this.gameState.currentIndex++;
        this.gameState.showAnswer = false;

        if (this.gameState.currentIndex >= this.gameState.cards.length) {
            return this.finishGame();
        }

        return this.gameState;
    }

    // Finish game
    finishGame() {
        if (!this.gameState || !this.selectedSet) return null;

        const score = Math.round((this.gameState.correctCount / this.gameState.cards.length) * 100);

        this.sets = this.sets.map(s =>
            s.id === this.selectedSet.id ? { ...s, lastScore: score } : s
        );

        this.gameState.finished = true;
        this.gameState.finalScore = score;
        this.gameState.completedNaturally = true; 

        return { gameState: this.gameState, sets: this.sets };
    }

    // Restart game
    restartGame() {
        if (!this.selectedSet) return null;
        return this.startGame(this.selectedSet.id);
    }

    // Exit game
    exitGame() {
        const wasCompleted = this.gameState && this.gameState.completedNaturally;
        this.gameState = null;
        this.selectedSet = null;
        return { shouldSave: wasCompleted };
    }

    // Get current editing set
    getEditingSet() {
        return this.editingSet;
    }

    // Get current game state
    getGameState() {
        return this.gameState;
    }

    // Get selected set
    getSelectedSet() {
        return this.selectedSet;
    }
}