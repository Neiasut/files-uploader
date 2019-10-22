import CompleteList from './CompleteList';
import { mockFilesUploaderFileData } from './__mock__/structures';

const createInstance = () => new CompleteList();

test('init', () => {
  expect(createInstance()).toBeDefined();
});

test('add', () => {
  const instance = createInstance();
  const data = instance.add(mockFilesUploaderFileData());
  expect(instance.length).toBe(1);
  expect(instance.get(data.id).name).toBe(data.name);
});

test('add 10 elements', () => {
  const instance = createInstance();
  for (let i = 0; i < 10; i++) {
    instance.add(mockFilesUploaderFileData());
  }
  expect(instance.length).toBe(10);
});

test('remove', () => {
  const instance = createInstance();
  instance.add(mockFilesUploaderFileData());
  const info = instance.add(mockFilesUploaderFileData());
  instance.remove(info.id);
  expect(instance.length).toBe(1);
});

test('remove not exist element', () => {
  const instance = createInstance();
  instance.remove('some string');
  expect(instance.length).toBe(0);
});

test('get', () => {
  const instance = createInstance();
  instance.add(mockFilesUploaderFileData());
  const info = instance.add(mockFilesUploaderFileData());
  const getInfo = instance.get(info.id);
  expect(getInfo).toBeDefined();
  expect(getInfo.name).toBe(mockFilesUploaderFileData().name);
  expect(getInfo).toBe(info);
});

test('updatePosition', () => {
  const instance = createInstance();
  const el1 = instance.add(mockFilesUploaderFileData());
  instance.add(mockFilesUploaderFileData());
  const el3 = instance.add(mockFilesUploaderFileData());
  instance.updatePosition(2, 0);
  expect(instance.getByFn((el, numb) => numb === 1).id).toBe(el1.id);
  expect(instance.getByFn((el, numb) => numb === 0).id).toBe(el3.id);
});
