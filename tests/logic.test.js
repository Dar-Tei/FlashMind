import { FlashMindLogic } from '../js/logic.js';

describe('FlashMindLogic', () => {
  let logic;

  beforeEach(() => {
    logic = new FlashMindLogic();
  });

  describe('Ініціалізація', () => {
    test('повинен створити дефолтний набір при пустих даних', () => {
      const sets = logic.initialize(null);
      expect(sets).toHaveLength(1);
      expect(sets[0].name).toBe('Англійські слова');
      expect(sets[0].cards).toHaveLength(3);
    });

    test('повинен завантажити збережені дані', () => {
      const savedSets = [
        { id: 1, name: 'Тест', cards: [{ id: 1, question: 'Q', answer: 'A' }] }
      ];
      const sets = logic.initialize(savedSets);
      expect(sets).toEqual(savedSets);
    });
  });

  describe('Управління наборами', () => {
    test('повинен створити новий набір', () => {
      const set = logic.createNewSet();
      expect(set).toHaveProperty('id');
      expect(set).toHaveProperty('name', '');
      expect(set.cards).toHaveLength(1);
    });

    test('повинен знайти набір за ID', () => {
      logic.initialize(null);
      const sets = logic.getAllSets();
      const foundSet = logic.getSetById(sets[0].id);
      expect(foundSet).toEqual(sets[0]);
    });

    test('повинен видалити набір', () => {
      logic.initialize(null);
      const sets = logic.getAllSets();
      const initialLength = sets.length;
      logic.deleteSet(sets[0].id);
      expect(logic.getAllSets()).toHaveLength(initialLength - 1);
    });
  });

  describe('Фільтрація та сортування', () => {
    beforeEach(() => {
      logic.sets = [
        { 
          id: 1, 
          name: 'Набір А', 
          cards: [{ id: 1, question: 'test', answer: 'тест' }],
          lastPlayedAt: 1000
        },
        { 
          id: 2, 
          name: 'Набір Б', 
          cards: [{ id: 1, question: 'hello', answer: 'привіт' }],
          lastPlayedAt: 2000
        }
      ];
    });

    test('повинен фільтрувати за пошуковим запитом', () => {
      const filtered = logic.filterAndSortSets('test', 'newest');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Набір А');
    });

    test('повинен сортувати за найновішими', () => {
      const sorted = logic.filterAndSortSets('', 'newest');
      expect(sorted[0].id).toBe(2);
    });

    test('повинен сортувати за найстарішими', () => {
      const sorted = logic.filterAndSortSets('', 'oldest');
      expect(sorted[0].id).toBe(1);
    });

    test('повинен сортувати за останньою грою', () => {
      const sorted = logic.filterAndSortSets('', 'recent');
      expect(sorted[0].lastPlayedAt).toBe(2000);
    });

    test('повинен сортувати за назвою (А-Я)', () => {
      const sorted = logic.filterAndSortSets('', 'name-asc');
      expect(sorted[0].name).toBe('Набір А');
    });
  });

  describe('Редагування карток', () => {
    beforeEach(() => {
      logic.createNewSet();
    });

    test('повинен додати картку', () => {
      const initialLength = logic.editingSet.cards.length;
      logic.addCard();
      expect(logic.editingSet.cards).toHaveLength(initialLength + 1);
    });

    test('повинен оновити картку', () => {
      const cardId = logic.editingSet.cards[0].id;
      logic.updateCard(cardId, 'question', 'Нове питання');
      expect(logic.editingSet.cards[0].question).toBe('Нове питання');
    });

    test('не повинен видалити останню картку', () => {
      logic.deleteCard(logic.editingSet.cards[0].id);
      expect(logic.editingSet.cards).toHaveLength(1);
    });


    test('повинен оновити назву набору', () => {
      logic.updateSetName('Нова назва');
      expect(logic.editingSet.name).toBe('Нова назва');
    });
  });

  describe('Збереження набору', () => {
    beforeEach(() => {
      logic.createNewSet();
    });

    test('не повинен зберегти набір без назви', () => {
      logic.updateSetName('');
      const result = logic.saveSet();
      expect(result.success).toBe(false);
      expect(result.error).toContain('назву');
    });

    test('не повинен зберегти набір без карток', () => {
      logic.updateSetName('Тест');
      logic.editingSet.cards[0].question = '';
      logic.editingSet.cards[0].answer = '';
      const result = logic.saveSet();
      expect(result.success).toBe(false);
      expect(result.error).toContain('картк');
    });

    test('повинен зберегти валідний набір', () => {
      logic.updateSetName('Тест набір');
      logic.updateCard(logic.editingSet.cards[0].id, 'question', 'Питання');
      logic.updateCard(logic.editingSet.cards[0].id, 'answer', 'Відповідь');
      const result = logic.saveSet();
      expect(result.success).toBe(true);
      expect(result.sets).toContainEqual(expect.objectContaining({
        name: 'Тест набір'
      }));
    });

    test('повинен відфільтрувати порожні картки', () => {
      logic.updateSetName('Тест');
      logic.addCard();
      logic.updateCard(logic.editingSet.cards[0].id, 'question', 'Q1');
      logic.updateCard(logic.editingSet.cards[0].id, 'answer', 'A1');
      const result = logic.saveSet();
      expect(result.success).toBe(true);
      expect(result.set.cards).toHaveLength(1);
    });
  });

  describe('Ігровий режим', () => {
    beforeEach(() => {
      logic.sets = [{
        id: 1,
        name: 'Тест',
        cards: [
          { id: 1, question: 'Q1', answer: 'A1' },
          { id: 2, question: 'Q2', answer: 'A2' },
          { id: 3, question: 'Q3', answer: 'A3' }
        ]
      }];
    });

    test('повинен запустити гру', () => {
      const gameState = logic.startGame(1);
      expect(gameState).not.toBeNull();
      expect(gameState.currentIndex).toBe(0);
      expect(gameState.correctCount).toBe(0);
      expect(gameState.showAnswer).toBe(false);
      expect(gameState.cards).toHaveLength(3);
    });

    test('повинен показати відповідь при "Не знаю"', () => {
      logic.startGame(1);
      const state = logic.handleDontKnow();
      expect(state.showAnswer).toBe(true);
      expect(state.currentIndex).toBe(0);
    });

    test('повинен перейти до наступної картки при "Знаю"', () => {
      logic.startGame(1);
      const state = logic.handleKnow();
      expect(state.currentIndex).toBe(1);
      expect(state.correctCount).toBe(1);
      expect(state.showAnswer).toBe(false);
    });

    test('повинен перейти до наступної картки після відповіді', () => {
      logic.startGame(1);
      logic.handleDontKnow();
      const state = logic.handleNext();
      expect(state.currentIndex).toBe(1);
      expect(state.showAnswer).toBe(false);
    });

    test('повинен завершити гру на останній картці', () => {
      logic.startGame(1);
      logic.handleKnow();
      logic.handleKnow();
      const result = logic.handleKnow();
      expect(result.gameState.finished).toBe(true);
      expect(result.gameState.finalScore).toBe(100);
    });

    test('повинен правильно обчислити результат', () => {
      logic.startGame(1);
      logic.handleKnow(); // +1
      logic.handleDontKnow();
      logic.handleNext();
      logic.handleDontKnow();
      const result = logic.handleNext();
      expect(result.gameState.finalScore).toBe(33); // 1/3 * 100 = 33
    });

    test('повинен перезапустити гру', () => {
      logic.startGame(1);
      logic.handleKnow();
      const newState = logic.restartGame();
      expect(newState.currentIndex).toBe(0);
      expect(newState.correctCount).toBe(0);
    });

    test('повинен вийти з гри', () => {
      logic.startGame(1);
      logic.handleKnow();
      logic.handleKnow();
      logic.handleKnow();
      const result = logic.exitGame();
      expect(result.shouldSave).toBe(true);
      expect(logic.gameState).toBeNull();
    });
  });

  describe('Імпорт набору', () => {
    test('повинен додати імпортований набір', () => {
      const importData = {
        name: 'Імпортований',
        cards: [
          { question: 'Q1', answer: 'A1' },
          { question: 'Q2', answer: 'A2' }
        ]
      };
      const result = logic.addImportedSet(importData);
      expect(result.success).toBe(true);
      expect(result.set.name).toBe('Імпортований');
      expect(result.set.cards).toHaveLength(2);
    });
  });

  describe('Отримання стану гри', () => {
    test('повинен повернути null якщо гра не запущена', () => {
      const state = logic.getGameState();
      expect(state).toBeNull();
    });
  });
});

