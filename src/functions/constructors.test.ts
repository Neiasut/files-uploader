import { createListElements, createListWrapper, createLoader } from './constructors';
import { FilesUploaderTypeFile } from '../enums/enums';

test('createLoader', () => {
  const loader = createLoader('test string');
  expect(loader).toBeInstanceOf(Element);
  expect(loader.classList.contains('FilesUploaderLoader')).toBeTruthy();
  expect(loader.querySelector('.FilesUploaderLoader-Text')).toBeDefined();
});

describe('createListWrapper', () => {
  test('isset label', () => {
    const listWrapper = createListWrapper(FilesUploaderTypeFile.Introduced, 'test');
    const label = listWrapper.querySelector('label');
    expect(label).not.toBeNull();
    expect(label.textContent).toBe('test');
  });
  test('no label', () => {
    const listWrapper = createListWrapper(FilesUploaderTypeFile.Downloaded);
    const label2 = listWrapper.querySelector('label');
    expect(label2).toBeNull();
  });
});

test('createListElements', () => {
  expect(createListElements(FilesUploaderTypeFile.Downloaded)).toBeDefined();
  const list = createListElements(FilesUploaderTypeFile.Downloaded);
  expect(
    list.classList.contains('FilesUploaderList_type_' + FilesUploaderTypeFile[FilesUploaderTypeFile.Downloaded])
  ).toBeTruthy();
});
