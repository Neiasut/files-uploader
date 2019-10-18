import FilesUploader from './FilesUploader';

test('init', () => {
  const instanceRoot = document.createElement('input');
  instanceRoot.type = 'file';
  instanceRoot.id = 'test';
  document.body.appendChild(instanceRoot);
  const instance = new FilesUploader('#test');
  expect(instance).toBeDefined();
  expect(instance).toBeInstanceOf(Object);
});
