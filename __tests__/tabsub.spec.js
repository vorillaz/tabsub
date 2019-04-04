import tabsub from '../src/index';

const dummy = () => {};

it('exports tabsub', () => {
  expect(typeof tabsub).toBe('function');
});

it('returns the proper API', () => {
  const radio = tabsub('new-channel');
  expect(radio).toMatchSnapshot();
});

it('works with smart defaults', () => {
  const radio = tabsub();
  expect(radio).toMatchSnapshot();
});

it('can work with different strategies', () => {
  const strategy = name => ({start: dummy, stop: dummy, close: dummy, post: dummy, on: dummy});
  const radio = tabsub('anotherOne', strategy);
  expect(radio.start).toBe(dummy);
  expect(radio.stop).toBe(dummy);
  expect(radio.close).toBe(dummy);
  expect(radio.post).toBe(dummy);
  expect(radio.on).toBe(dummy);
});
