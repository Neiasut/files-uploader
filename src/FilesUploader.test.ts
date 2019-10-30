import FilesUploader from './FilesUploader';
import { mockDefaultFile, mockDefaultInput, mockFilesUploaderFileData } from './__mock__/structures';
// @ts-ignore
import mock from 'xhr-mock';
import { mockServerUploadSuccess } from './__mock__/servers';

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

  test('addFile', () => {
    const input = mockDefaultInput();
    const instance = new FilesUploader(input);
    const fileExample = mockFilesUploaderFileData();
    instance.addFile(fileExample);
    expect(instance.files.length).toBe(1);
  });

  test('checkEventChangeTriggered', () => {
    const input = mockDefaultInput();
    const spy = jest.spyOn(FilesUploader.prototype as any, 'onAddFiles');
    const instance = new FilesUploader('#test');
    const event = document.createEvent('UIEvents');
    event.initEvent('change', true, true);
    const cb = jest.fn();
    instance.onDidAddFileToQueue(cb);
    input.dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('onDidAddFile', () => {
    mockDefaultInput();
    const instance = new FilesUploader('#test');
    const fileExample = mockFilesUploaderFileData();
    const cb = jest.fn();
    instance.onDidAddFile(cb);
    instance.addFile(fileExample);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith({
      instance
    });
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

    test('addFileToQueue with autoUpload', () => {
      mockDefaultInput();
      mockServerUploadSuccess();
      const spyUploadFile = jest.spyOn(FilesUploader.prototype as any, 'uploadFile');
      const instance = new FilesUploader('#test', {
        autoUpload: true,
        actionLoad: '/test',
        acceptTypes: ['txt']
      });
      const fileExample = mockDefaultFile();
      const onDidAddFile = jest.fn();
      instance.onDidAddFileToQueue(onDidAddFile);
      // @ts-ignore
      instance.addFileToQueue(fileExample);
      expect(onDidAddFile).toHaveBeenCalledTimes(1);
      expect(spyUploadFile).toHaveBeenCalled();
      spyUploadFile.mockRestore();
    });
  });
});
