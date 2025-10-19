import { FlashMindLogic } from '../js/logic.js';
import { StorageManager } from '../js/storage.js';

describe('Інтеграційні тести', () => {
  let logic;
  let storage;

  beforeEach(() => {
    const mockLocalStorage = {
      data: {},
      getItem(key) { return this.data[key] || null; },
      setItem(key, value) { this.data[key] = value; },
      removeItem(key) { delete this.data[key]; },
      clear() { this.data = {}; }
    };
    global.localStorage = mockLocalStorage;

    storage = new StorageManager('test_flashmind');
    logic = new FlashMindLogic();
  });

  test('повинен зберегти та завантажити набори', () => {
    logic.initialize(null);
    const sets = logic.getAllSets();
    storage.save(sets);

    const loaded = storage.load();
    logic.initialize(loaded);
    
    expect(logic.getAllSets()).toEqual(sets);
  });

  test('повинен зберегти результат гри', () => {
    logic.initialize(null);
    const sets = logic.getAllSets();
    
    logic.startGame(sets[0].id);
    logic.handleKnow();
    logic.handleKnow();
    const result = logic.handleKnow();

    storage.save(result.sets);
    const loaded = storage.load();

    expect(loaded[0].lastScore).toBe(100);
  });

  test('повинен створити, зберегти та завантажити новий набір', () => {
    logic.initialize(null);
    logic.createNewSet();
    logic.updateSetName('Новий набір');
    logic.updateCard(logic.editingSet.cards[0].id, 'question', 'Q');
    logic.updateCard(logic.editingSet.cards[0].id, 'answer', 'A');
    
    const saveResult = logic.saveSet();
    storage.save(saveResult.sets);

    const loaded = storage.load();
    logic.initialize(loaded);

    const foundSet = logic.getAllSets().find(s => s.name === 'Новий набір');
    expect(foundSet).toBeDefined();
    expect(foundSet.cards).toHaveLength(1);
  });
});