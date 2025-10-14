// main.js - Main application file

import { StorageManager } from "./storage.js";
import { FlashMindLogic } from "./logic.js";
import { UIRenderer } from "./ui.js";
import { ModalManager } from "./modal.js";
import { AIGenerator } from "./ai.js";
import { initCustomDropdowns } from "./dropdown.js";
import { DragDropManager } from "./dragdrop.js";
import { MessageHelper } from "./helpers.js";

class FlashMind {
  constructor() {
    this.storage = new StorageManager("flashmind_sets");
    this.logic = new FlashMindLogic();
    this.ui = new UIRenderer();
    this.modal = new ModalManager();
    this.ai = new AIGenerator();
    this.dragDrop = null;

    this.currentView = "home";
    this.searchQuery = "";
    this.sortBy = "newest";
    this.searchTimeout = null;

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
    if (this.currentView === "home") {
      const allSets = this.logic.getAllSets();
      const filteredSets = this.logic.filterAndSortSets(
        this.searchQuery,
        this.sortBy
      );
      this.ui.renderHome(filteredSets, this.searchQuery, this.sortBy);
      this.initDragDrop();
    } else if (this.currentView === "edit") {
      const editingSet = this.logic.getEditingSet();
      this.ui.renderEdit(editingSet);
      this.destroyDragDrop();
    } else if (this.currentView === "game") {
      const gameState = this.logic.getGameState();
      const selectedSet = this.logic.getSelectedSet();
      this.ui.renderGame(gameState, selectedSet);
      this.destroyDragDrop();
    }

    this.attachEventListeners();
    setTimeout(() => {
      const mainContent = document.querySelector(".container");
      if (mainContent) {
        initCustomDropdowns(mainContent);
      }
    }, 0);
  }

  // Attach event listeners
  attachEventListeners() {
    document.querySelectorAll("[data-action]").forEach((el) => {
      if (el.getAttribute("data-action") === "search") {
        el.addEventListener("input", (e) => {
          clearTimeout(this.searchTimeout);
          this.searchTimeout = setTimeout(() => {
            this.searchQuery = e.target.value;
            this.render();
          }, 300);
        });
      } else if (el.getAttribute("data-action") === "sort") {
        el.addEventListener("change", (e) => {
          this.sortBy = e.target.value;
          this.render();
        });
      } else if (el.getAttribute("data-action") === "clear-search") {
        el.addEventListener("click", (e) => {
          this.searchQuery = "";
          this.render();
        });
      } else {
        el.addEventListener("click", (e) => {
          const action = e.currentTarget.getAttribute("data-action");
          const id = e.currentTarget.getAttribute("data-id");
          this.handleAction(action, id);
        });
      }
    });

    // Existing field listeners
    document.querySelectorAll('[data-field="set-name"]').forEach((el) => {
      el.addEventListener("input", (e) => {
        this.logic.updateSetName(e.target.value);
      });
    });

    document.querySelectorAll("[data-card-id]").forEach((el) => {
      el.addEventListener("input", (e) => {
        const cardId = parseInt(e.target.getAttribute("data-card-id"));
        const field = e.target.getAttribute("data-field");
        this.logic.updateCard(cardId, field, e.target.value);
      });
    });
  }

  // Reset search and sort when going back
  goBack() {
    this.searchQuery = "";
    this.sortBy = "newest";
    this.currentView = "home";
    this.render();
  }

  // Handle actions
  handleAction(action, id) {
    switch (action) {
      case "create":
        this.createNewSet();
        break;
      case "generate":
        this.showGenerateModal();
        break;
      case "edit":
        this.editSet(parseInt(id));
        break;
      case "delete":
        this.deleteSet(parseInt(id));
        break;
      case "play":
        this.startGame(parseInt(id));
        break;
      case "export":
        this.exportSet(parseInt(id));
        break;
      case "import":
        this.importSet();
        break;
      case "back":
        this.goBack();
        break;
      case "add-card":
        this.addCard();
        break;
      case "delete-card":
        this.deleteCard(parseInt(id));
        break;
      case "save":
        this.saveSet();
        break;
      case "know":
        this.handleKnow();
        break;
      case "dont-know":
        this.handleDontKnow();
        break;
      case "next":
        this.handleNext();
        break;
      case "restart":
        this.restartGame();
        break;
      case "exit":
        this.exitGame();
        break;
    }
  }

  // Actions for sets
  createNewSet() {
    this.logic.createNewSet();
    this.currentView = "edit";
    this.render();
  }

  async showGenerateModal() {
    // First render the modal
    const modal = this.ui.renderGenerateModal();

    // Get form elements
    const topicInput = document.getElementById("generate-topic");
    const countSelect = document.querySelector("#generate-count");
    const levelSelect = document.querySelector("#generate-level");
    const questionLangSelect = document.querySelector(
      "#generate-question-lang"
    );
    const answerLangSelect = document.querySelector("#generate-answer-lang");
    const cancelBtn = document.getElementById("generate-cancel");
    const submitBtn = document.getElementById("generate-submit");

    // Initialize custom dropdowns after modal is rendered
    const dropdowns = initCustomDropdowns(modal);

    // Setup event listeners
    cancelBtn.addEventListener("click", () => {
      modal.remove();
    });

    submitBtn.addEventListener("click", async () => {
      const options = {
        topic: topicInput.value.trim(),
        count: parseInt(countSelect.value),
        level: levelSelect.value,
        questionLang: questionLangSelect.value,
        answerLang: answerLangSelect.value,
      };

      if (!options.topic) {
        // Show error for empty topic
        await this.modal.alert({
          title: "Щось не так",
          message: "Введіть тему для генерації карток",
          type: "warning",
        });
        return;
      }

      // Remove generation modal
      modal.remove();

      // Show loading state
      const loadingModal = this.ui.renderLoadingModal();

      try {
        const cards = await this.generateCardsWithAI(options);
        // Don't remove loading modal here - it's handled in generateCardsWithAI

        if (cards) {
          // Create new set with generated cards
          const newSet = this.logic.createNewSetWithCards(options.topic, cards);
          this.render();
        }
      } catch (error) {
        this.ui.removeLoadingModal();
        // Show error modal through generateCardsWithAI
      }
    });
  }

  // Drag & Drop
  initDragDrop() {
    this.destroyDragDrop();

    this.dragDrop = new DragDropManager("body", async (result) => {
      if (result.success) {
        const addResult = this.logic.addImportedSet(result.data);
        this.storage.save(addResult.sets);
        this.render();

        const message = MessageHelper.getDragDropSuccessMessage(
          addResult.set.name,
          addResult.set.cards.length
        );

        await this.modal.alert({
          title: "Успішний імпорт",
          message: message,
          type: "success",
        });
      } else {
        const { title, help } = MessageHelper.getDragDropErrorHelp(
          result.error
        );

        await this.modal.alert({
          title: title,
          message: help,
          type: "warning",
          buttonText: "Зрозуміло",
        });
      }
    });
  }

  destroyDragDrop() {
    if (this.dragDrop) {
      this.dragDrop.destroy();
      this.dragDrop = null;
    }
  }

  async generateCardsWithAI(options) {
    const { topic, count, level, questionLang, answerLang } = options;

    // Don't show loading modal here since it's already shown
    try {
      const result = await this.ai.generateCards({
        topic,
        count,
        level,
        questionLang,
        answerLang,
      });

      // Remove loading modal before showing result
      this.ui.removeLoadingModal();

      if (result.success) {
        const newSet = this.logic.createNewSetWithCards(topic, result.cards);
        this.storage.save(this.logic.getAllSets());

        await this.modal.alert({
          title: "Успіх!",
          message: `Згенеровано ${result.cards.length} карток на тему "${topic}"`,
          type: "success",
        });

        this.render();
      } else {
        await this.modal.alert({
          title: "Помилка генерації",
          message: result.error || "Не вдалося згенерувати картки",
          type: "error",
        });
      }
    } catch (error) {
      // Remove loading modal before showing error
      this.ui.removeLoadingModal();

      const { title, help } = MessageHelper.getAIErrorHelp(error);

      await this.modal.alert({
        title: title,
        message: help,
        type: "warning",
      });
    }
  }

  editSet(id) {
    this.logic.editSet(id);
    this.currentView = "edit";
    this.render();
  }

  async deleteSet(id) {
    const confirmed = await this.modal.confirm({
      title: "Видалення набору",
      message:
        "Ви впевнені, що хочете видалити цей набір? Цю дію не можна скасувати.",
      confirmText: "Видалити",
      cancelText: "Скасувати",
      type: "warning",
    });

    if (confirmed) {
      this.logic.deleteSet(id);
      this.storage.save(this.logic.getAllSets());
      this.render();
    }
  }

  async exportSet(id) {
    const set = this.logic.getSetById(id);
    if (!set) return;

    const fileName = set.name.replace(/[^a-zA-Zа-яА-ЯіІїЇєЄ0-9]/g, "_");
    this.storage.exportToFile(set, fileName);

    await this.modal.alert({
      title: "Експорт завершено",
      message: `Набір "${set.name}" успішно експортовано!`,
      type: "success",
    });
  }

  async importSet() {
    this.storage.importFromFile(async (result) => {
      if (result.success) {
        const addResult = this.logic.addImportedSet(result.data);
        this.storage.save(addResult.sets);
        this.render();

        await this.modal.alert({
          title: "Успішний імпорт",
          message: `Набір "${addResult.set.name}" успішно імпортовано!`,
          type: "success",
        });
      } else {
        const { title, help } = MessageHelper.getImportErrorHelp(result.error);

        await this.modal.alert({
          title: title,
          message: help,
          type: "error",
          buttonText: "Зрозуміло",
        });
      }
    });
  }

  goBack() {
    this.currentView = "home";
    this.render();
  }

  // Actions for cards
  addCard() {
    this.logic.addCard();
    this.render();
  }

  deleteCard(cardId) {
    this.logic.deleteCard(cardId);
    this.render();
  }

  async saveSet() {
    const result = this.logic.saveSet();

    if (result.success) {
      this.storage.save(result.sets);
      this.currentView = "home";
      this.render();
    } else {
      const { title, help } = MessageHelper.getSaveErrorHelp(result.error);

      await this.modal.alert({
        title: title,
        message: result.error + help,
        type: "warning",
        buttonText: "Зрозуміло",
      });
    }
  }

  // Actions for game
  startGame(id) {
    this.logic.startGame(id);
    this.currentView = "game";
    this.render();
  }

  handleKnow() {
    const result = this.logic.handleKnow();

    if (result && result.sets) {
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

    if (result && result.shouldSave) {
      this.storage.save(this.logic.getAllSets());
    }

    this.currentView = "home";
    this.render();
  }
}

// Start application
const app = new FlashMind();
