import {
  createListElements,
  createListWrapper,
  createLoader,
  defaultFileComponentConstructorFn,
  defaultLoadingComponentConstructorFn
} from './constructors';
import { FilesUploaderErrorType, FilesUploaderStatus, FilesUploaderTypeFile } from '../enums/enums';
import { getFilesUploaderErrorInfo } from './functions';
import { mockFilesUploaderErrorKeys, mockFilesUploaderFileDataElement } from '../__mock__/structures';

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

test('defaultLoadingComponentConstructorFn', () => {
  let a = 0;
  let b = 0;
  const file = new File(['test'], 'file.txt', {
    type: 'text/plain'
  });
  const result = defaultLoadingComponentConstructorFn(
    file,
    () => {
      a += 1;
    },
    () => {
      b += 1;
    }
  );

  expect(result.elementDOM).toBeInstanceOf(Element);
  result.elementDOM.querySelector('.upload').dispatchEvent(new Event('click'));
  expect(a).toBe(1);
  result.elementDOM.querySelector('.cancel').dispatchEvent(new Event('click'));
  expect(b).toBe(1);
  result.onChangePercent(20);
  const percent = parseFloat(result.elementDOM.querySelector('.percentage').textContent);
  expect(percent).toBe(20);
  result.onError(
    getFilesUploaderErrorInfo([FilesUploaderErrorType.Size, FilesUploaderErrorType.Server], mockFilesUploaderErrorKeys)
  );
  let errorsText = result.elementDOM.querySelector('.errors').textContent;
  expect(errorsText.length).toBeGreaterThan(0);
  result.onChangeStatus(FilesUploaderStatus.Uploading);
  errorsText = result.elementDOM.querySelector('.errors').textContent;
  expect(errorsText).toBe('');
  result.onChangeStatus(FilesUploaderStatus.Error);
  errorsText = result.elementDOM.querySelector('.errors').textContent;
  expect(errorsText).toBe('');
});

test('defaultFileComponentConstructorFn', () => {
  let a = 0;
  const result = defaultFileComponentConstructorFn(mockFilesUploaderFileDataElement, () => {
    a += 1;
  });
  expect(result.elementDOM).toBeInstanceOf(Element);
  result.elementDOM.querySelector('button').dispatchEvent(new Event('click'));
  expect(a).toBe(1);
});
