import FileComponent from './FileComponent';
import { defaultFileComponentConstructorFn } from './functions/constructors';
import { mockFilesUploaderFileDataElement } from './__mock__/structures';
// @ts-ignore
import mock from 'xhr-mock';

test('init & remove', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const someEl = document.createElement('div');
  someEl.textContent = 'test';
  const defaultData = defaultFileComponentConstructorFn(mockFilesUploaderFileDataElement(), () => null, false);
  const instance = new FileComponent('test.txt', div, defaultData);
  expect(instance).toBeInstanceOf(FileComponent);
  expect(instance.wrapper).toBeInstanceOf(Element);
  expect(instance.pathFile).toBe('test.txt');
  instance.destroy();
  expect(div.childNodes.length).toBe(0);
  const someDiv = document.createElement('div');
  const instance2 = new FileComponent('test.text', div, {
    elementDOM: someDiv
  });
  instance2.destroy();
  expect(div.childNodes.length).toBe(0);
});

describe('delete tests', () => {
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
    const defaultData = defaultFileComponentConstructorFn(mockFilesUploaderFileDataElement(), () => null, false);
    const instance = new FileComponent('test.txt', div, defaultData);
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
    const defaultData = defaultFileComponentConstructorFn(mockFilesUploaderFileDataElement(), () => null, false);
    const instance = new FileComponent('test.txt', div, defaultData);
    try {
      await instance.delete('/test', {}, {});
    } catch (e) {
      expect(Array.isArray(e)).toBeTruthy();
      expect(e.length).toBe(1);
    }
  });
});
