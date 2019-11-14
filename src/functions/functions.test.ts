import {
  calcPercentage,
  checkExtensionInArrAllowed,
  checkFileIsImage,
  checkOnFunction,
  createImage,
  generateRandomString,
  getElementImage,
  getFileExtension,
  getFilesUploaderErrorInfo,
  getFilesUploaderFileInfoFromInstanceFile,
  getQueryElement,
  imageFromFile,
  mergeDeepConfig,
  setInput,
  transformObjectToSendData,
  validateFileExtension,
  validateFileSize
} from './functions';
import { FilesUploaderErrorType } from '../enums/enums';
import { mockDefaultFile, mockFilesUploaderErrorTexts } from '../__mock__/structures';

test('mergeDeepConfig', () => {
  const a = {
    test: 'value',
    testing: {
      s: () => 2
    }
  };
  const b = {
    s: 'value 2',
    m: [1, 2],
    testing: {
      g: () => 2
    }
  };
  const c = {
    k: [1, 2],
    m: [3, 4]
  };
  const result = mergeDeepConfig({}, a, b, c);
  expect(result.m.length).toBe(2);
  expect(result.m[1]).toBe(4);
  expect(result.testing).toBeInstanceOf(Object);
  expect(result.testing.s()).toBe(2);
  expect(result.s).toBe('value 2');
});

test('setInput', () => {
  const input = document.createElement('input');
  setInput(input, 2, ['json', 'png'], 40);
  expect(input).toBeInstanceOf(HTMLInputElement);
  expect(input.multiple).toBeTruthy();
  expect(input.accept).toBe('.json, .png');
  expect(input.size).toBe(40);
});

test('getFileExtension', () => {
  expect(getFileExtension('test.js')).toBe('js');
  expect(getFileExtension('Function.test.ts')).toBe('ts');
  expect(getFileExtension('/files/Function.test.raw')).toBe('raw');
  expect(getFileExtension('/files/Function.test.raw?info=abra')).toBe('raw');
});

test('validateFileExtension', () => {
  const file = mockDefaultFile();
  expect(validateFileExtension(file, ['txt', 'js'])).toBeTruthy();
  expect(validateFileExtension(file, ['js', 'ts', 'tsx'])).toBeFalsy();
});

test('validateFileSize', () => {
  const file = mockDefaultFile();
  const fileSize = file.size;
  expect(validateFileSize(file, 20 * 1024 * 1024)).toBeTruthy();
  expect(validateFileSize(file, fileSize)).toBeTruthy();
  expect(validateFileSize(file, fileSize - 1)).toBeFalsy();
});

test('calcPercentage', () => {
  expect(calcPercentage(1, 5)).toBe(20);
  expect(calcPercentage(1, 3)).toBe(33.33);
  expect(calcPercentage(1, 3, 3)).toBe(33.333);
});

test('getFilesUploaderErrorInfo', () => {
  const texts = mockFilesUploaderErrorTexts();
  expect(getFilesUploaderErrorInfo([FilesUploaderErrorType.Data], texts)).toBeInstanceOf(Object);
  expect(
    getFilesUploaderErrorInfo([FilesUploaderErrorType.Data, FilesUploaderErrorType.MoreMaxFiles], texts).length
  ).toBe(2);
  expect(getFilesUploaderErrorInfo([FilesUploaderErrorType.Data], texts)[0].text).toBe('some text 1');
});

test('generateRandomString', () => {
  const type = typeof generateRandomString();
  expect(type).toBe('string');
  expect(generateRandomString().length).toBe(8);
  expect(generateRandomString(6).length).toBe(6);
  expect(generateRandomString() === generateRandomString()).toBeFalsy();
});

test('addHeaders', () => {
  expect(true).toBeTruthy();
});

test('transformObjectToSendData', () => {
  const result1 = transformObjectToSendData('json', {}, {});
  expect(typeof result1).toBe('string');
  const result2 = transformObjectToSendData(
    'multipartForm',
    {
      file: mockDefaultFile()
    },
    {}
  );
  expect(result2).toBeInstanceOf(FormData);
  expect(result2.get('file')).toBeInstanceOf(File);
});

test('getQueryElement', () => {
  const input = document.createElement('input');
  input.id = 'tested';
  document.body.appendChild(input);
  expect(getQueryElement('#tested')).toBeInstanceOf(HTMLInputElement);
  expect(getQueryElement(input)).toBeInstanceOf(HTMLInputElement);
  expect(getQueryElement('#someId')).toBeFalsy();
  expect(getQueryElement('.arr')).toBeFalsy();
});

test('imageFromFile', () => {
  const file = mockDefaultFile();
  const image = imageFromFile(file);
  expect(image).toBeInstanceOf(HTMLImageElement);
});

test('checkFileIsImage', () => {
  const file = new File([], 'test.txt', {
    type: 'text/plain'
  });
  const fileImage = new File([], 'test.jpg', {
    type: 'image/jpg'
  });
  expect(checkFileIsImage(file)).toBeFalsy();
  expect(checkFileIsImage(fileImage)).toBeTruthy();
});

test('checkOnFunction', () => {
  expect(checkOnFunction(1)).toBeFalsy();
  expect(checkOnFunction('str')).toBeFalsy();
  expect(checkOnFunction(() => null)).toBeTruthy();
});

test('createImage', () => {
  const SRC = '/test.png';
  const image = createImage(SRC);
  expect(image).toBeInstanceOf(HTMLImageElement);
  expect(image.src.indexOf(SRC)).not.toBe(-1);
});

test('checkExtensionInArrAllowed', () => {
  expect(checkExtensionInArrAllowed('txt', ['txt'])).toBeTruthy();
  expect(checkExtensionInArrAllowed('txt', ['svg', 'jpg'])).toBeFalsy();
  expect(checkExtensionInArrAllowed('', ['svg', 'jpg'])).toBeFalsy();
  expect(checkExtensionInArrAllowed('', [])).toBeFalsy();
});

test('getElementImage', () => {
  const fileImage = new File([], 'test.jpg', {
    type: 'image/jpg'
  });
  expect(getElementImage(false, null, null, null, null)).toBeUndefined();
  expect(getElementImage(true, [], 'jpg', fileImage, null)).toBeInstanceOf(HTMLImageElement);
  expect(getElementImage(true, ['jpg'], 'jpg', null, '/test.png')).toBeInstanceOf(HTMLImageElement);
  expect(getElementImage(true, ['svg'], 'jpg', null, '/test.png')).toBeUndefined();
});

test('getFilesUploaderFileInfoFromInstanceFile', () => {
  const file = new File([], 'test.jpg', {
    type: 'image/jpg'
  });
  const data = getFilesUploaderFileInfoFromInstanceFile(file);
  expect(data.name).toBe('test.jpg');
  expect(data.size).toBe(file.size);
  expect(data.extension).toBe('jpg');
});
