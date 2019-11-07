import Queue from './Queue';
import { FilesUploaderStatus } from './enums/enums';
import { mockQueueElement } from './__mock__/structures';

test('add', () => {
  const instance = new Queue();
  const example = mockQueueElement('first');
  instance.add(example);
  instance.add(mockQueueElement('second'));
  expect(instance.length).toBe(2);
  expect(instance.get('first') === example).toBeTruthy();
});

test('remove', () => {
  const instance = new Queue();
  instance.add(mockQueueElement('first'));
  instance.remove('first');
  expect(instance.length).toBe(0);
  expect(instance.get('first')).not.toBeDefined();
  const exampleRemove = instance.remove('first');
  expect(instance.length).toBe(0);
  expect(exampleRemove).not.toBeDefined();
});

test('countUploadingFiles', () => {
  const instance = new Queue();
  instance.add(mockQueueElement('first', FilesUploaderStatus.Uploading));
  instance.add(mockQueueElement('second', FilesUploaderStatus.Error));
  expect(instance.countUploadingFiles).toBe(1);
  instance.add(mockQueueElement('first', FilesUploaderStatus.Uploading));
  expect(instance.countUploadingFiles).toBe(2);
  instance.get('first').status = FilesUploaderStatus.Error;
  expect(instance.countUploadingFiles).toBe(1);
});

test('updatePositionElement', () => {
  const instance = new Queue();
  instance.add(mockQueueElement('first', FilesUploaderStatus.Uploading));
  instance.add(mockQueueElement('second', FilesUploaderStatus.Error));
  instance.add(mockQueueElement('third', FilesUploaderStatus.Error));
  instance.updatePositionElement(0, 2);
  const elemInPos2 = instance.getByFn((component, position) => {
    return position === 2;
  });
  const elemInPos0 = instance.getByFn((component, position) => {
    return position === 0;
  });
  expect(elemInPos0.id).toBe('second');
  expect(elemInPos2.id).toBe('first');
});
