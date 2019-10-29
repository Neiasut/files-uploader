import UploadingElement from './UploadingElement';
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
import { factoryDefaultUploadingComponent } from './DefaultUploadingComponent';
import { getFilesUploaderFileInfoFromInstanceFile } from './functions/functions';

const getDefaultViewComponent = (file: File) =>
  factoryDefaultUploadingComponent(getFilesUploaderFileInfoFromInstanceFile(file));

test('check init', () => {
  const instance = mockLoadingComponent();
  expect(instance.error).toBeFalsy();
  expect(instance.errorTypes.length).toBe(0);
  expect(instance).toBeInstanceOf(UploadingElement);
});

test('onChangePercent', () => {
  const file = mockDefaultFile();
  const component = getDefaultViewComponent(file);
  const instance = new UploadingElement(document.body, 0, file, component);
  instance.changePercent(25);
  expect(instance.percent).toBe(25);
});

test('setError', () => {
  const file = mockDefaultFile();
  const component = getDefaultViewComponent(file);
  const instance = new UploadingElement(document.body, 0, file, component);
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
    const component = getDefaultViewComponent(file);
    const instance = new UploadingElement(document.body, 0, file, component);
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
    const component = getDefaultViewComponent(file);
    const instance = new UploadingElement(document.body, 0, file, component);
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
    const component = getDefaultViewComponent(file);
    const instance = new UploadingElement(document.body, 0, file, component);
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
  const component = getDefaultViewComponent(file);
  const div = mockDefaultDiv();
  const instance = new UploadingElement(div, 0, file, component);
  instance.destroy();
  expect(div.childNodes.length).toBe(0);
});
