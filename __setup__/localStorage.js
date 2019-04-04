import MessageEvent from './message';
import {trimExt} from 'upath';

const GlobalLocalStorage = global.localStorage;

const db = {};

const MockedLocalStorage = {
  __mocked: true,
  removeAll: () => {
    Object.keys(db).forEach(key => {
      delete db[key];
    });
  },
  removeItem: key => {
    delete db[key];
  },
  getItem: key => db[key],
  setItem: (key, value) => {
    db[key] = value;
    const event = new CustomEvent('storage', {
      composed: true,
      bubbles: true,
      detail: {key, newValue: String(value)}
    });
    global.dispatchEvent(event);
  }
};

export default () => {
  Object.defineProperty(global, 'localStorage', {
    value: MockedLocalStorage,
    enumerable: true,
    configurable: true,
    writable: true
  });

  return () => (global.localStorage = GlobalLocalStorage);
};
