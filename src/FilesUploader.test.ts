import FilesUploader from './FilesUploader';

test('init', () => {
  const instance = new FilesUploader();
  expect(instance).toBeDefined();
  expect(instance).toBeInstanceOf(Object);
});
