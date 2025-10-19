import { jest } from '@jest/globals';
import { StorageManager } from '../js/storage.js';

describe('StorageManager', () => {
  let storage;
  let localStorageMock;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    console.error.mockRestore();
  });
  
  beforeEach(() => {
    localStorageMock = (() => {
      let store = {};

      return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = value; }),
        removeItem: jest.fn((key) => { delete store[key]; }),
        clear: jest.fn(() => { store = {}; }),
        _getStore: () => store
      };
    })();

    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    storage = new StorageManager('test_key');
  });

  test('повинен зберегти дані', () => {
    const data = [{ id: 1, name: 'Test' }];
    const result = storage.save(data);
    expect(result).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test_key', JSON.stringify(data));
  });

  test('повинен завантажити дані', () => {
    const data = [{ id: 1, name: 'Test' }];
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(data));
    const loaded = storage.load();
    expect(loaded).toEqual(data);
  });

  test('повинен повернути null при відсутності даних', () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    const loaded = storage.load();
    expect(loaded).toBeNull();
  });

  test('повинен очистити дані', () => {
    const result = storage.clear();
    expect(result).toBe(true);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('test_key');
  });

  test('повинен обробити помилку при збереженні', () => {
    localStorageMock.setItem.mockImplementation(() => { throw new Error('Storage error'); });
    const result = storage.save([{ id: 1 }]);
    expect(result).toBe(false);
  });

  test('повинен обробити помилку при завантаженні', () => {
    localStorageMock.getItem.mockImplementation(() => { throw new Error('Storage error'); });
    const result = storage.load();
    expect(result).toBeNull();
  });
});
