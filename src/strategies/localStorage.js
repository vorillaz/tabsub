const noop = () => {};

const notSupported = () => !(global && global.localStorage);
const notSupportedWarning = () => {
  console.warn('LocalStorage is not supported');
};

const localStorageStrategy = channelName => {
  if (notSupported()) {
    return {
      post: notSupportedWarning,
      start: notSupportedWarning,
      stop: notSupportedWarning,
      on: notSupportedWarning,
      close: notSupportedWarning
    };
  }

  let isStopped = false;
  let callback = noop;

  const onLocalStorage = (evt = {}) => {
    if (isStopped) {
      return;
    }
    // JSDOM packs details into the evt.detail
    const data = evt.detail ? evt.detail : evt;
    const {key = '__GIBBERISH__', newValue = '{}'} = data;
    if (key === channelName) {
      const value = JSON.parse(newValue);
      const {msg} = value;
      callback(msg);
    }
  };

  return {
    post: (msg = {}) => {
      global.localStorage.setItem(
        channelName,
        JSON.stringify({date: new Date(), channelName, msg})
      );
    },
    start() {
      isStopped = false;
    },
    stop: () => {
      isStopped = true;
    },
    on: (cb = noop) => {
      callback = cb;
      global.addEventListener('storage', onLocalStorage);
    },
    close: () => {
      global.localStorage.removeItem(channelName);
      global.removeEventListener('storage', onLocalStorage);
    }
  };
};

export default localStorageStrategy;
