import MessageEvent from './message';

const GlobalBroadcastChannel = global.BroadcastChannel;

let uuid = 0;
const getUuid = () => (uuid = uuid + 1);

const channels = {};

class MockedBroadcastChannel {
  constructor(name) {
    Object.defineProperty(this, 'name', {
      configurable: false,
      enumerable: true,
      writable: false,
      value: String(name)
    });

    this.uuid = getUuid();
    this._closed = false;
    this.onmessage = null;
    if (!channels[this.name]) {
      channels[this.name] = [];
    }
    channels[this.name].push(this);
  }

  postMessage(message) {
    if (this._closed) {
      throw new Error(`BroadcastChannel "${this.name}" is closed.`);
    }

    const subscribers = channels[this.name];
    if (subscribers && subscribers.length) {
      for (let i = 0; i < subscribers.length; ++i) {
        const member = subscribers[i];

        if (member._closed || member === this) continue;

        if (typeof member.onmessage === 'function') {
          member.onmessage(new MessageEvent('message', {data: message}));
        }
      }
    }
  }

  close() {
    if (this._closed) {
      return;
    }
    this._closed = true;
    if (channels[this.name]) {
      const subscribers = channels[this.name].filter(x => x !== this);
      if (subscribers.length) {
        channels[this.name] = subscribers;
      } else {
        delete channels[this.name];
      }
    }
  }
}

export default () => {
  global.BroadcastChannel = MockedBroadcastChannel;
  return () => (global.BroadcastChannel = GlobalBroadcastChannel);
};
