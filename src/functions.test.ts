import { createListWrapper, createLoader, setInput } from './functions';

test('setInput', () => {
  const input = document.createElement('input');
  setInput(input, 2, ['json', 'png'], 40);
  expect(input).toBeInstanceOf(HTMLInputElement);
  expect(input.multiple).toBeTruthy();
  expect(input.accept).toBe('.json, .png');
  expect(input.size).toBe(40);
});

test('createLoader', () => {
  const loader = createLoader('test string');
  expect(loader).toBeInstanceOf(Element);
  expect(loader.classList.contains('FilesUploaderLoader')).toBeTruthy();
  expect(loader.querySelector('.FilesUploaderLoader-Text')).toBeDefined();
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
