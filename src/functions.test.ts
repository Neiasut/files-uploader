import { createInput, createListWrapper, createLoader } from './functions';

test('createInput', () => {
  const input = createInput('files', 2, ['json', 'png'], 40);
  expect(input).toBeInstanceOf(HTMLInputElement);
  expect(input.multiple).toBeTruthy();
  expect(input.accept).toBe('.json, .png');
  expect(input.size).toBe(40);
});

test('createLoader', () => {
  const input = createInput('files', 2, ['json', 'png'], 40);
  const loader = createLoader(input, 'test string');
  expect(loader).toBeInstanceOf(Element);
  expect(loader.classList.contains('FilesUploaderLoader')).toBeTruthy();
  expect(loader.querySelector('.FilesUploaderLoader-Text')).toBeDefined();
  expect(loader.querySelector('.FilesUploaderLoader-Input')).toBeDefined();
});

describe('createListWrapper', () => {
  test('isset label', () => {
    const listWrapper = createListWrapper('complete', 'test');
    const label = listWrapper.querySelector('label');
    expect(label).not.toBeNull();
    expect(label.textContent).toBe('test');
  });
  test('no label', () => {
    const listWrapper = createListWrapper('complete');
    const label2 = listWrapper.querySelector('label');
    expect(label2).toBeNull();
  });
});
