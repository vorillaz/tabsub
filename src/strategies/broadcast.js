import localstorage from './localStorage';

const noop = m => m;
const notSupported = () => !(global && global.BroadcastChannel);

const broadcastStrategy = channelName => {
  if (notSupported()) {
    return localstorage(channelName);
  }

  let isStopped = false;
  const channel = new global.BroadcastChannel(channelName);

  return {
    post: msg => {
      channel.postMessage(msg);
    },
    start() {
      isStopped = false;
    },
    stop: () => {
      isStopped = true;
    },
    on: (cb = noop) => {
      channel.onmessage = ({data = {}} = {}) => {
        if (isStopped) {
          return;
        }
        cb(data);
      };
    },
    close: channel.close
  };
};

export default broadcastStrategy;
