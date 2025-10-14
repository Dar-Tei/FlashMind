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
    return [
      {
        id: Date.now(),
        name: "Англійські слова",
        cards: [
          { id: 1, question: "Hello", answer: "Привіт" },
          { id: 2, question: "World", answer: "Світ" },
          { id: 3, question: "Learn", answer: "Вчити" },
        ],
        lastScore: null,
      },
    ];
  }

  // Get all sets
  getAllSets() {
    return this.sets;
  }

  // Get set by ID
  getSetById(id) {
    return this.sets.find((s) => s.id === id);
  }

  // Filter and sort sets
  filterAndSortSets(searchQuery = "", sortBy = "newest") {
    // Start with a copy of all sets
    let filteredSets = [...this.sets];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredSets = filteredSets.filter((set) => {
        const nameMatch = set.name.toLowerCase().includes(query);
        const cardsMatch = set.cards.some(
          (card) =>
            card.question.toLowerCase().includes(query) ||
            card.answer.toLowerCase().includes(query)
        );
        return nameMatch || cardsMatch;
      });
    }

    // Sort sets based on criteria
    switch (sortBy) {
      case "recent":
        filteredSets.sort((a, b) => {
          // Sort by last played timestamp
          if (a.lastPlayedAt && b.lastPlayedAt) {
            return b.lastPlayedAt - a.lastPlayedAt;
          }
          if (a.lastPlayedAt) return -1;
          if (b.lastPlayedAt) return 1;
          return b.id - a.id;
        });
        break;

      case "newest":
        filteredSets.sort((a, b) => b.id - a.id);
        break;

      case "oldest":
        filteredSets.sort((a, b) => a.id - b.id);
        break;

      case "name-asc":
        filteredSets.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "name-desc":
        filteredSets.sort((a, b) => b.name.localeCompare(a.name));
        break;

      case "cards-asc":
        filteredSets.sort((a, b) => a.cards.length - b.cards.length);
        break;

      case "cards-desc":
        filteredSets.sort((a, b) => b.cards.length - a.cards.length);
        break;
    }
    return filteredSets;
  }

  // Get sort label for display
  getSortLabel(sortBy) {
    const labels = {
      newest: "Найновіші",
      oldest: "Найстаріші",
      recent: "Нещодавно грані",
      "name-asc": "Назва (А-Я)",
      "name-desc": "Назва (Я-А)",
      "cards-asc": "Карток (менше)",
      "cards-desc": "Карток (більше)",
    };
    return labels[sortBy] || "Найновіші";
  }

  // Create new set
  createNewSet() {
    const set = {
      id: Date.now(),
      name: "",
      cards: [
        {
          // Add default empty card
          id: Date.now(),
          question: "",
          answer: "",
        },
      ],
      lastScore: null,
      lastPlayedAt: null,
    };
    this.editingSet = set;
    return set;
  }

  // Create new set with pre-filled cards
  createNewSetWithCards(name, cards) {
    const newSet = {
      id: Date.now(),
      name: name,
      cards: cards.map((card, index) => ({
        id: Date.now() + index,
        question: card.question.trim(),
        answer: card.answer.trim(),
      })),
      lastScore: null,
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
    this.sets = this.sets.filter((s) => s.id !== id);
    return this.sets;
  }

  // Add card
  addCard() {
    if (this.editingSet) {
      this.editingSet.cards.push({
        id: Date.now(),
        question: "",
        answer: "",
      });
    }
  }

  // Update card
  updateCard(cardId, field, value) {
    if (!this.editingSet) return null;
    const card = this.editingSet.cards.find((c) => c.id === cardId);
    if (card) {
      card[field] = value;
    }
    return this.editingSet;
  }

  // Delete card
  deleteCard(cardId) {
    if (this.editingSet) {
      // Don't delete if it's the last card
      if (this.editingSet.cards.length <= 1) {
        return;
      }
      this.editingSet.cards = this.editingSet.cards.filter(
        (card) => card.id !== cardId
      );
    }
  }

  // Update set name
  updateSetName(name) {
    if (this.editingSet) {
      this.editingSet.name = name;
    }
  }

  // Save set
  saveSet() {
    if (!this.editingSet) {
      return { success: false, error: "Набір не знайдено" };
    }

    // Validate set name
    if (!this.editingSet.name.trim()) {
      return { success: false, error: "Введіть назву набору" };
    }

    // Filter out completely empty cards
    const validCards = this.editingSet.cards.filter(
      (card) => card.question.trim() || card.answer.trim()
    );

    // Ensure at least one valid card
    if (validCards.length === 0) {
      return { success: false, error: "Додайте хоча б одну картку" };
    }

    // Update cards and save
    this.editingSet.cards = validCards;

    // Add or update set in collection
    const existingIndex = this.sets.findIndex(
      (s) => s.id === this.editingSet.id
    );
    if (existingIndex !== -1) {
      this.sets[existingIndex] = { ...this.editingSet };
    } else {
      this.sets.push({ ...this.editingSet });
    }

    return {
      success: true,
      sets: this.sets,
      set: this.editingSet,
    };
  }

  // Add imported set
  addImportedSet(importedData) {
    const newSet = {
      id: Date.now(),
      name: importedData.name,
      cards: importedData.cards.map((card, index) => ({
        id: Date.now() + index,
        question: card.question.trim(),
        answer: card.answer.trim(),
      })),
      lastScore: null,
    };

    this.sets.push(newSet);
    return { success: true, set: newSet, sets: this.sets };
  }

  // Start game
  startGame(id) {
    const set = this.getSetById(id);
    if (set) {
      set.lastPlayedAt = Date.now();
      this.selectedSet = set; // Add this line
      this.selectedSetId = id;
      this.gameState = {
        currentIndex: 0, // Changed from currentCardIndex
        showAnswer: false,
        correctCount: 0,
        totalAnswered: 0,
        cards: [...set.cards],
        finished: false,
      };
      return this.gameState; // Return game state
    }
    return null;
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

    const score = Math.round(
      (this.gameState.correctCount / this.gameState.cards.length) * 100
    );

    this.sets = this.sets.map((s) =>
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

  getCurrentCard() {
    if (!this.gameState || !this.gameState.cards) return null;
    return this.gameState.cards[this.gameState.currentIndex];
  }

  // Get current game state
  getGameState() {
    if (!this.gameState) return null;
    return {
      ...this.gameState,
      currentCard: this.getCurrentCard(),
      totalCards: this.gameState.cards.length,
      progress: Math.round(
        (this.gameState.currentIndex / this.gameState.cards.length) * 100
      ),
    };
  }

  // Get selected set
  getSelectedSet() {
    return this.selectedSet;
  }
}
