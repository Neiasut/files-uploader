import FilesUploader from './FilesUploader';
import { mockDefaultFile, mockDefaultInput, mockFilesUploaderFileData } from './__mock__/structures';
// @ts-ignore
import mock from 'xhr-mock';
import { mockServerRemoveSuccess, mockServerUploadSuccess } from './__mock__/servers';
import { FilesUploaderErrorType, FilesUploaderEvents } from './enums/enums';

describe('FilesUploader test', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('init', () => {
    mockDefaultInput();
    const instance = new FilesUploader('#test');
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(Object);
  });

  test('init error', () => {
    expect(() => {
      const instance = new FilesUploader('#testeed');
    }).toThrowError();
  });

  test('checkEventChangeTriggered', () => {
    const input = mockDefaultInput();
    const spyOnAddFiles = jest.spyOn(FilesUploader.prototype as any, 'addFilesToQueue');
    const instance = new FilesUploader('#test');
    const event = document.createEvent('UIEvents');
    event.initEvent('change', true, true);
    const cb = jest.fn();
    instance.dispatchers[FilesUploaderEvents.DidAddFileToQueue].register(cb);
    input.dispatchEvent(event);
    expect(spyOnAddFiles).toHaveBeenCalled();
    expect(input.value).toBe('');
    spyOnAddFiles.mockRestore();
  });

  test('addFilesToQueue', () => {
    mockDefaultInput();
    const instance = new FilesUploader('#test', {
      autoUpload: true,
      acceptTypes: ['txt']
    });
    const file = mockDefaultFile();
    const spyUploadFile = jest.spyOn(FilesUploader.prototype as any, 'upload');
    // @ts-ignore
    instance.addFilesToQueue([file]);
    expect(spyUploadFile).toHaveBeenCalled();
    spyUploadFile.mockRestore();
  });

  test('onDidAddFile', () => {
    mockDefaultInput();
    const instance = new FilesUploader('#test');
    const fileExample = mockFilesUploaderFileData();
    const cb = jest.fn();
    instance.dispatchers[FilesUploaderEvents.DidAddFileToCompleteList].register(cb);
    instance.addFiles([fileExample]);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  test('addFileToQueue', () => {
    mockDefaultInput();
    const instance = new FilesUploader('#test', {
      autoUpload: false
    });
    const fileExample = mockDefaultFile();
    // @ts-ignore
    instance.addFileToQueue(fileExample);
  });

  describe('with network work', () => {
    beforeEach(() => {
      mock.setup();
    });

    afterEach(() => {
      mock.teardown();
    });

    test('addFileToQueue with autoUpload', async () => {
      mockDefaultInput();
      mockServerUploadSuccess();
      const spyUpload = jest.spyOn(FilesUploader.prototype as any, 'upload');
      const instance = new FilesUploader('#test', {
        autoUpload: true,
        server: {
          upload: {
            url: '/test'
          }
        },
        acceptTypes: ['txt']
      });
      const fileExample = mockDefaultFile();
      const onDidAddFile = jest.fn();
      const onDidUploadFile = jest.fn();
      instance.dispatchers[FilesUploaderEvents.DidAddFileToQueue].register(onDidAddFile);
      instance.dispatchers[FilesUploaderEvents.DidAddFileToCompleteList].register(onDidUploadFile);
      // @ts-ignore
      const element = instance.addFileToQueue(fileExample);
      // @ts-ignore
      await instance.upload(element);
      expect(onDidAddFile).toHaveBeenCalledTimes(1);
      expect(typeof element).toBe('object');
      expect(spyUpload).toHaveBeenCalled();
      expect(onDidUploadFile).toHaveBeenCalled();
      spyUpload.mockRestore();
    });

    test('addFile, removeFile', async () => {
      expect.assertions(5);
      const input = mockDefaultInput();
      mockServerRemoveSuccess();
      const instance = new FilesUploader(input, {
        server: {
          remove: {
            url: '/delete'
          }
        }
      });
      const fileExample = mockFilesUploaderFileData();
      instance.addFiles([fileExample]);
      expect(instance.files.length).toBe(1);
      try {
        await instance.removeFile('error');
      } catch (e) {
        expect(e.reasons[0]).toBe(FilesUploaderErrorType.Data);
      }
      const onDidRemoveFile = jest.fn();
      const onDidRemoveFromList = jest.fn();
      instance.dispatchers[FilesUploaderEvents.DidRemoveFileFromCompleteList].register(onDidRemoveFromList);
      instance.dispatchers[FilesUploaderEvents.DidRemoveFile].register(onDidRemoveFile);
      await instance.removeFile(fileExample.path);
      expect(instance.files.length).toBe(0);
      expect(onDidRemoveFile).toHaveBeenCalledTimes(1);
      expect(onDidRemoveFromList).toHaveBeenCalled();
    });
  });

  test('add files in constructor', () => {
    const input = mockDefaultInput();
    const spyAddFile = jest.spyOn(FilesUploader.prototype as any, 'addFile');
    const instance = new FilesUploader(
      input,
      {},
      [],
      [
        {
          name: 'test.txt',
          size: 400,
          path: '/test.txt'
        },
        {
          name: 'test.txt',
          size: 400,
          path: '/test.txt'
        }
      ]
    );
    expect(instance.files.length).toBe(2);
    expect(spyAddFile).toHaveBeenCalledTimes(2);
    spyAddFile.mockRestore();
  });
});

test('destroy', () => {
  const input = mockDefaultInput();
  const cbOnRemoveFromQueue = jest.fn();
  const cbOnRemoveFromQueueCompletes = jest.fn();
  const instance = new FilesUploader(
    input,
    {},
    [],
    [
      {
        name: 'test.txt',
        size: 400,
        path: '/test.txt'
      },
      {
        name: 'test.txt',
        size: 400,
        path: '/test.txt'
      }
    ]
  );
  instance.dispatchers[FilesUploaderEvents.DidRemoveFileFromQueue].register(cbOnRemoveFromQueue);
  instance.dispatchers[FilesUploaderEvents.DidRemoveFile].register(cbOnRemoveFromQueueCompletes);
  instance.destroy();
  expect(input.getAttribute('class')).toBe('');
  expect(cbOnRemoveFromQueue).not.toHaveBeenCalled();
  expect(cbOnRemoveFromQueueCompletes).not.toHaveBeenCalled();
});
