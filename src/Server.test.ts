// @ts-ignore
import mock from 'xhr-mock';
import { FilesUploaderFileData } from './interfaces/interfaces';
import { mockDefaultFile } from './__mock__/structures';
import { Server } from './Server';
import { FilesUploaderErrorType } from './enums/enums';
import FilesUploaderErrorNetwork from './errors/FilesUploaderErrorNetwork';

beforeEach(() => {
  mock.setup();
});

afterEach(() => {
  mock.teardown();
});

describe('upload', () => {
  test('success', async () => {
    expect.assertions(3);
    mock.post('/test', (request, response) => {
      const formData: FormData = request.body();
      const fileRequest = formData.get('file') as File;
      expect(request.header('X-TOTAL-COUNT')).toBe('1');
      expect(formData.get('some_field')).toBe('2');
      const data: FilesUploaderFileData = {
        name: fileRequest.name,
        size: fileRequest.size,
        path: '/somePath/' + fileRequest.name
      };
      return response.status(200).body(JSON.stringify(data));
    });
    const file = mockDefaultFile();
    const requestObject = Server.upload(
      '/test',
      file,
      {
        'X-TOTAL-COUNT': '1'
      },
      data => {
        data.some_field = '2';
        return data;
      }
    );
    const dataResponse = await requestObject.send();
    expect(dataResponse.name).toBe(file.name);
  });

  test('error upload', async () => {
    expect.assertions(3);
    mock.post('/test', (request, response) => {
      return response.status(412).body(JSON.stringify({}));
    });
    const file = mockDefaultFile();
    const requestObject = Server.upload('/test', file);
    try {
      await requestObject.send();
    } catch (e) {
      expect(Array.isArray(e.reasons)).toBeTruthy();
      expect(e.reasons.length).toBe(1);
      expect(e.reasons[0]).toBe(FilesUploaderErrorType.Upload);
    }
  });
});

describe('remove', () => {
  test('success', async () => {
    expect.assertions(1);
    mock.delete('/test', {
      status: 204,
      body: JSON.stringify({ status: 'success' })
    });
    const request = Server.remove('/test', 'test.png');
    const data = await request.send();
    expect(data.status).toBe('success');
  });

  test('error', async () => {
    expect.assertions(2);
    mock.delete('/test', {
      status: 412,
      body: JSON.stringify(null)
    });
    const request = Server.remove('/test', 'test.png');

    try {
      await request.send();
    } catch (e) {
      expect(e instanceof FilesUploaderErrorNetwork).toBeTruthy();
      expect(e.reasons[0]).toBe(FilesUploaderErrorType.Remove);
    }
  });
});
