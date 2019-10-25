import LoadingComponent from './LoadingComponent';
import {
  mockDefaultDiv,
  mockDefaultFile,
  mockFilesUploaderErrorKeys,
  mockLoadingComponent
} from './__mock__/structures';
import { FilesUploaderErrorType } from './enums/enums';
// @ts-ignore
import mock from 'xhr-mock';
import { FilesUploaderFileData } from './interfaces/interfaces';

test('check init', () => {
  const instance = mockLoadingComponent();
  expect(instance.error).toBeFalsy();
  expect(instance.errorTypes.length).toBe(0);
  expect(instance).toBeInstanceOf(LoadingComponent);
});

test('onChangePercent', () => {
  const file = mockDefaultFile();
  const element = mockDefaultDiv();
  const onChangePercent = jest.fn();
  const instance = new LoadingComponent(document.body, 0, file, {
    elementDOM: element,
    onChangePercent
  });
  instance.changePercent(25);
  expect(instance.percent).toBe(25);
  expect(onChangePercent).toHaveBeenCalledTimes(1);
});

test('onChangePercent without callback', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const file = mockDefaultFile();
  const element = document.createElement('div');
  const instance = new LoadingComponent(document.body, 0, file, {
    elementDOM: element
  });
  instance.changePercent(25);
});

test('setError', () => {
  const file = mockDefaultFile();
  const element = mockDefaultDiv();
  const onError = jest.fn();
  const instance = new LoadingComponent(document.body, 0, file, {
    elementDOM: element,
    onError
  });
  instance.setError([FilesUploaderErrorType.Server], mockFilesUploaderErrorKeys());
  expect(instance.error).toBe(true);
  expect(instance.errorTypes.length).toBe(1);
  expect(instance.errorTypes[0]).toBe(FilesUploaderErrorType.Server);
  expect(onError).toHaveBeenCalledTimes(1);
  expect(onError).toHaveBeenCalledWith([
    {
      type: FilesUploaderErrorType.Server,
      text: mockFilesUploaderErrorKeys()[FilesUploaderErrorType.Server]
    }
  ]);
});

test('setError without callback', () => {
  const file = mockDefaultFile();
  const element = mockDefaultDiv();
  const instance = new LoadingComponent(document.body, 0, file, {
    elementDOM: element
  });
  instance.setError([FilesUploaderErrorType.Server], mockFilesUploaderErrorKeys());
  expect(instance.error).toBe(true);
  expect(instance.errorTypes.length).toBe(1);
  expect(instance.errorTypes[0]).toBe(FilesUploaderErrorType.Server);
});

describe('async tests', () => {
  beforeEach(() => {
    mock.setup();
  });

  afterEach(() => {
    mock.teardown();
  });

  test('success upload', async () => {
    expect.assertions(3);
    mock.post('/test', (request, response) => {
      const formData: FormData = request.body();
      const fileRequest = formData.get('file') as File;
      expect(request.header('X-TOTAL-COUNT')).toBe('1');
      expect(formData.get('some_field')).toBe('2');
      const data: FilesUploaderFileData = {
        name: fileRequest.name,
        size: fileRequest.size,
        extension: 'txt',
        path: '/somePath/' + fileRequest.name
      };
      return response.status(200).body(JSON.stringify(data));
    });
    const file = mockDefaultFile();
    const element = mockDefaultDiv();
    const instance = new LoadingComponent(document.body, 0, file, {
      elementDOM: element
    });
    const dataResponse = await instance.upload(
      '/test',
      {
        'X-TOTAL-COUNT': '1'
      },
      {
        some_field: '2'
      }
    );
    expect(dataResponse.name).toBe(file.name);
  });

  test('error upload', async () => {
    expect.assertions(3);
    mock.post('/test', (request, response) => {
      return response.status(412).body(JSON.stringify({}));
    });
    const file = mockDefaultFile();
    const element = mockDefaultDiv();
    const instance = new LoadingComponent(document.body, 0, file, {
      elementDOM: element
    });
    try {
      await instance.upload('/test', {}, {});
    } catch (e) {
      expect(Array.isArray(e)).toBeTruthy();
      expect(e.length).toBe(1);
      expect(e[0]).toBe(FilesUploaderErrorType.Server);
    }
  });

  test('test abort()', () => {
    mock.post(
      '/test',
      (request, response) => {
        return response.status(412).body(JSON.stringify({}));
      },
      3000
    );
    const file = mockDefaultFile();
    const element = mockDefaultDiv();
    const instance = new LoadingComponent(document.body, 0, file, {
      elementDOM: element
    });
    try {
      instance.upload('/test', {}, {});
      instance.abort();
    } catch (e) {
      expect(instance.xhr.status).toBe(0);
    }
  });
});

test('destroy', () => {
  const file = mockDefaultFile();
  const element = mockDefaultDiv();
  const div = mockDefaultDiv();
  const instance = new LoadingComponent(div, 0, file, {
    elementDOM: element
  });
  instance.destroy();
  expect(div.childNodes.length).toBe(0);
});

test('destroy with callback', () => {
  const file = mockDefaultFile();
  const element = mockDefaultDiv();
  const div = mockDefaultDiv();
  const onDestroy = jest.fn();
  const instance = new LoadingComponent(div, 0, file, {
    elementDOM: element,
    onDestroy
  });
  instance.destroy();
  expect(div.childNodes.length).toBe(0);
  expect(onDestroy).toHaveBeenCalledTimes(1);
});
