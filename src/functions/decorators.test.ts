import { filesUploaderComponent } from './decorators';

test('filesUploaderComponent', () => {
  @filesUploaderComponent
  class TestClassExample {
    test(a, b) {
      return a + b;
    }
  }
  const instance = new TestClassExample();
  const spySetStatus = jest.spyOn(TestClassExample.prototype as any, 'setStatus');
  const spySetError = jest.spyOn(TestClassExample.prototype as any, 'setError');
  (instance as any).setStatus();
  (instance as any).setError();
  expect(spySetStatus).toHaveBeenCalled();
  expect(spySetError).toHaveBeenCalled();
});
