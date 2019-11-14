import EventDispatcher from './EventDispatcher';

test('add', () => {
  const instance = new EventDispatcher<boolean>();
  instance.register(bool => !bool);
  expect(instance.fire(true)).toBeFalsy();
});

test('add multiple', () => {
  const instance = new EventDispatcher<number>();
  let a = 0;
  const fn = jest.fn();
  instance.register(fn);
  instance.register(numb => {
    a += numb;
  });
  instance.fire(1);
  expect(a).toBe(1);
  instance.register(numb => {
    a += numb + 2;
  });
  instance.fire(2);
  expect(a).toBe(7);
  expect(fn).toHaveBeenCalledTimes(2);
});
