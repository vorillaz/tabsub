import broadcast from './strategies/broadcast';

const tabsub = (name = '__DEFAULT_CHANNEL_', strategy = broadcast) => {
  const channel = strategy(name);

  return {
    name,
    start: channel.start,
    stop: channel.stop,
    close: channel.close,
    post: channel.post,
    on: channel.on
  };
};

export default tabsub;
