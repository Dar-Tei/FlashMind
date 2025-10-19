import { jest } from '@jest/globals';

// Mock for localStorage
const localStorageMock = {
    data: {},
    getItem(key) {
      return this.data[key] || null;
    },
    setItem(key, value) {
      this.data[key] = value;
    },
    removeItem(key) {
      delete this.data[key];
    },
    clear() {
      this.data = {};
    },
  };
  
  global.localStorage = localStorageMock;
  
  // Mock for DOM elements
  global.document = {
    getElementById: jest.fn(),
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(() => []),
    createElement: jest.fn(() => ({
      addEventListener: jest.fn(),
      setAttribute: jest.fn(),
      appendChild: jest.fn(),
      click: jest.fn(),
    })),
    body: {
      appendChild: jest.fn(),
      insertAdjacentHTML: jest.fn(),
    },
  };