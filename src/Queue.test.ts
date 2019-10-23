import Queue from './Queue';
import { mockLoadingComponent } from './__mock__/structures';
import { FilesUploaderStatus } from './enums/enums';

test('add', () => {
  const instance = new Queue();
  const example = mockLoadingComponent(0);
  instance.add(example);
  instance.add(mockLoadingComponent(1));
  expect(instance.length).toBe(2);
  expect(instance.get(0) === example).toBeTruthy();
});

test('remove', () => {
  const instance = new Queue();
  instance.add(mockLoadingComponent(0));
  instance.remove(0);
  expect(instance.length).toBe(0);
  expect(instance.get(0)).not.toBeDefined();
  const exampleRemove = instance.remove(0);
  expect(instance.length).toBe(0);
  expect(exampleRemove).not.toBeDefined();
});

test('countUploadingFiles', () => {
  const instance = new Queue();
  instance.add(mockLoadingComponent(0));
  instance.add(mockLoadingComponent(1));
  instance.get(0).setStatus(FilesUploaderStatus.Uploading);
  expect(instance.countUploadingFiles).toBe(1);
  instance.get(1).setStatus(FilesUploaderStatus.Uploading);
  expect(instance.countUploadingFiles).toBe(2);
  instance.get(0).setStatus(FilesUploaderStatus.Error);
  expect(instance.countUploadingFiles).toBe(1);
});
