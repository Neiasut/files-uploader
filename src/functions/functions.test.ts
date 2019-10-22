import {
  calcPercentage,
  formatGetParams,
  generateRandomString,
  getFileExtension,
  getFilesUploaderErrorInfo,
  mergeDeepConfig,
  setInput,
  validateFileExtension,
  validateFileSize
} from './functions';
import { FilesUploaderErrorType } from '../enums/enums';
import { mockDefaultFile, mockFilesUploaderErrorKeys } from '../__mock__/structures';

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

test('formatGetParams', () => {
  expect(formatGetParams({ a: '1', b: 'test' })).toBe('?a=1&b=test');
  expect(formatGetParams({ a: 'test', b: null })).toBe('?a=test&b=null');
  expect(formatGetParams({})).toBe('');
});

test('getFilesUploaderErrorInfo', () => {
  const texts = mockFilesUploaderErrorKeys();
  expect(getFilesUploaderErrorInfo([FilesUploaderErrorType.Server], texts)).toBeInstanceOf(Object);
  expect(
    getFilesUploaderErrorInfo([FilesUploaderErrorType.Server, FilesUploaderErrorType.MoreMaxFiles], texts).length
  ).toBe(2);
  expect(getFilesUploaderErrorInfo([FilesUploaderErrorType.Server], texts)[0].text).toBe('some text');
});

test('generateRandomString', () => {
  const type = typeof generateRandomString();
  expect(type).toBe('string');
  expect(generateRandomString().length).toBe(8);
  expect(generateRandomString(6).length).toBe(6);
  expect(generateRandomString() === generateRandomString()).toBeFalsy();
});
