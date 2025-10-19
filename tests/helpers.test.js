import { MessageHelper } from '../js/helpers.js';

describe('MessageHelper', () => {
  describe('getSaveErrorHelp', () => {
    test('повинен повернути підказку для помилки назви', () => {
      const result = MessageHelper.getSaveErrorHelp('Введіть назву набору');
      expect(result.title).toBe('Щось не так');
      expect(result.help).toContain('Введіть назву набору');
    });

    test('повинен повернути підказку для помилки карток', () => {
      const result = MessageHelper.getSaveErrorHelp('Додайте хоча б одну картку');
      expect(result.title).toBe('Щось не так');
      expect(result.help).toContain('Додайте хоча б одну картку');
    });
  });

  describe('getImportErrorHelp', () => {
    test('повинен повернути підказку для невірного формату', () => {
      const result = MessageHelper.getImportErrorHelp('Невірний формат файлу!');
      expect(result.title).toBe('Невірний формат файлу');
      expect(result.help).toContain('JSON');
    });

    test('повинен повернути підказку для відсутності карток', () => {
      const result = MessageHelper.getImportErrorHelp('У файлі немає валідних карток!');
      expect(result.title).toBe('Файл не містить валідних карток');
      expect(result.help).toContain('картк');
    });
  });

  describe('getDragDropSuccessMessage', () => {
    test('повинен сформувати повідомлення про успіх', () => {
      const message = MessageHelper.getDragDropSuccessMessage('Тест', 5);
      expect(message).toContain('Тест');
      expect(message).toContain('5');
    });
  });
});