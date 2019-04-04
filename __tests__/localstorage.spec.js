import mockLocalStorage from '../__setup__/localStorage';
import tabsub from '../src/index';

let restoreLocalStorage;
let restoreBroadcast;

beforeAll(() => {
  restoreLocalStorage = mockLocalStorage();
  restoreBroadcast = global.BroadcastChannel;
  global.BroadcastChannel = undefined;
});

beforeEach(() => {
  global.localStorage.removeAll();
});

afterAll(() => {
  restoreLocalStorage();
  global.BroadcastChannel = restoreBroadcast;
});

it('used as fallback strategy', () => {
  const p = tabsub('channel');
  expect(p).toMatchSnapshot();
});

it('posts messages to subscribers', () => {
  const subscriberMockCb = jest.fn(msg => msg);
  const p = tabsub('localChannel');
  const s = tabsub('localChannel');
  s.on(subscriberMockCb);

  p.post('A msg from localstorage');
  p.post('Another one');
  p.post('And a third one');
  expect(subscriberMockCb.mock.calls).toMatchSnapshot();
});

it('posts messages with different types', () => {
  const subscriberMockCb = jest.fn(msg => msg);
  const p = tabsub('localChannel2');
  const s = tabsub('localChannel2');
  s.on(subscriberMockCb);

  p.post('A msg');
  p.post({foo: 'bar'});
  p.post({baz: 1});
  p.post(1);
  p.post();
  p.post(['lovely', 'quz', 1, 0.4]);

  expect(subscriberMockCb.mock.calls).toMatchSnapshot();
});

it('stops and starts the messages on demand', () => {
  const subscriberMockCb = jest.fn(msg => msg);
  const p = tabsub('localChannel3');
  const s = tabsub('localChannel3');
  s.on(subscriberMockCb);

  p.post('A msg');
  s.stop();

  p.post('this will get ignored from the subscriber');
  p.post('And this one');
  s.start();
  p.post('Keep them coming');
  expect(subscriberMockCb.mock.calls).toMatchSnapshot();
});

it('closes the channel', () => {
  const channelName = 'localChannel4';
  const p = tabsub(channelName);
  const message = 'A msg that will be saved';
  p.post(message);

  const retrieved = global.localStorage.getItem(channelName);
  const parsed = JSON.parse(retrieved);
  expect(parsed.channelName).toEqual(channelName);
  expect(parsed.msg).toEqual(message);
  p.close();

  const checkOnceMore = global.localStorage.getItem(channelName);
  expect(checkOnceMore).toBeUndefined();
});

it('shows a warning if localstorage is not supported', () => {
  global.localStorage = undefined;
  global.console = {warn: jest.fn()};
  const p = tabsub('oops');
  expect(p).toMatchSnapshot();
  p.post();
  expect(console.warn).toBeCalled();
});
