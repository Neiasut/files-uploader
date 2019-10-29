import CompleteElement from './CompleteElement';
// @ts-ignore
import mock from 'xhr-mock';
import {factoryDefaultCompleteComponent} from './DefaultCompleteComponent';
import {mockDefaultDiv, mockFilesUploaderErrorKeys, mockFilesUploaderFileDataElement} from './__mock__/structures';
import {FilesUploaderErrorType} from './enums/enums';

test('init & remove', () => {
  const div = mockDefaultDiv();
  const someEl = document.createElement('div');
  someEl.textContent = 'test';
  const component = factoryDefaultCompleteComponent(mockFilesUploaderFileDataElement(), false);
  const instance = new CompleteElement('test.txt', div, component);
  expect(instance).toBeInstanceOf(CompleteElement);
  expect(instance.wrapper).toBeInstanceOf(Element);
  expect(instance.pathFile).toBe('test.txt');
  instance.destroy();
  expect((div as Node).childNodes.length).toBe(0);
  const component2 = factoryDefaultCompleteComponent(mockFilesUploaderFileDataElement(), false);
  const instance2 = new CompleteElement('test.text', div, component2);
  instance2.destroy();
  expect(div.childNodes.length).toBe(0);
});

describe('network tests', () => {
  beforeEach(() => {
    mock.setup();
  });

  afterEach(() => {
    mock.teardown();
  });

  test('success', async () => {
    expect.assertions(1);
    mock.delete('/test', {
      status: 200,
      body: JSON.stringify({ status: 'success' })
    });
    const div = document.createElement('div');
    document.body.appendChild(div);
    const someEl = document.createElement('div');
    someEl.textContent = 'test';
    const component = factoryDefaultCompleteComponent(mockFilesUploaderFileDataElement(), false);
    const instance = new CompleteElement('test.txt', div, component);
    const data = await instance.delete('/test', {}, {});
    expect(data.status).toBe('success');
  });

  test('error', async () => {
    expect.assertions(2);
    mock.delete('/test', {
      status: 412,
      body: JSON.stringify(null)
    });
    const div = document.createElement('div');
    document.body.appendChild(div);
    const component = factoryDefaultCompleteComponent(mockFilesUploaderFileDataElement(), false);
    const instance = new CompleteElement('test.txt', div, component);
    try {
      await instance.delete('/test', {}, {});
    } catch (e) {
      expect(Array.isArray(e)).toBeTruthy();
      expect(e.length).toBe(1);
    }
  });
});

test('setError', () => {
  const div = mockDefaultDiv();
  const component = factoryDefaultCompleteComponent(mockFilesUploaderFileDataElement(), false);
  const instance = new CompleteElement('test.txt', div, component);
  instance.setError([FilesUploaderErrorType.Size], mockFilesUploaderErrorKeys());
  expect(instance.errorTypes.length).toBe(1);
  expect(instance.errorTypes[0]).toBe(FilesUploaderErrorType.Size);
});
