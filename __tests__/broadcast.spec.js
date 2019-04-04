import mockBroadcastChannel from '../__setup__/broadcast';
import tabsub from '../src/index';

let restoreBroadcast;

beforeAll(() => (restoreBroadcast = mockBroadcastChannel()));
afterAll(() => restoreBroadcast());

it('is used as default strategy', () => {
  const p = tabsub('channel');
  expect(p).toMatchSnapshot();
});

it('posts messages to subscribers', () => {
  const subscriberMockCb = jest.fn(msg => msg);
  const p = tabsub('channel1');
  const s = tabsub('channel1');
  s.on(subscriberMockCb);

  p.post('A msg');
  p.post('Another one');
  p.post('A third one');

  expect(subscriberMockCb.mock.calls).toMatchSnapshot();
});

it('posts messages with different types', () => {
  const subscriberMockCb = jest.fn(msg => msg);
  const p = tabsub('channel2');
  const s = tabsub('channel2');
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
  const p = tabsub('channel3');
  const s = tabsub('channel3');
  s.on(subscriberMockCb);

  p.post('A msg');
  s.stop();

  p.post('this will get ignored from the subscriber');
  p.post('And this one');
  s.start();
  p.post('Keep them coming');
  expect(subscriberMockCb.mock.calls).toMatchSnapshot();
});
