import { FilesUploaderErrorType, FilesUploaderStatus } from '../enums/enums';
import {
  CompleteComponentProps,
  CompleteWrapperProps,
  FilesUploaderErrorTexts,
  FilesUploaderFileData,
  FilesUploaderSettings,
  FilesUploaderStatusTexts,
  QueueElement,
  UploadingComponentProps,
  UploadingWrapperProps
} from '../interfaces/interfaces';
import FilesUploader from '../FilesUploader';
import { createImage } from '../functions/functions';

export const mockDefaultInput = (): HTMLInputElement => {
  const input = document.createElement('input');
  input.type = 'file';
  input.id = 'test';
  document.body.appendChild(input);
  return input;
};

export const mockDefaultDiv = (): HTMLDivElement => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return div;
};

export const mockFilesUploaderStatusTexts = (): FilesUploaderStatusTexts => ({
  [FilesUploaderStatus.Complete]: 'some text',
  [FilesUploaderStatus.Error]: 'some text 2',
  [FilesUploaderStatus.Removing]: 'some text 3',
  [FilesUploaderStatus.WaitingUpload]: 'some text 4',
  [FilesUploaderStatus.Uploading]: 'some text 5'
});

export const mockFilesUploaderErrorTexts = (): FilesUploaderErrorTexts => ({
  [FilesUploaderErrorType.Data]: 'some text 1',
  [FilesUploaderErrorType.Size]: 'some text 2',
  [FilesUploaderErrorType.MoreMaxFiles]: 'some text 3',
  [FilesUploaderErrorType.Type]: 'some text 4',
  [FilesUploaderErrorType.Network]: 'some text 5',
  [FilesUploaderErrorType.Remove]: 'some text 6',
  [FilesUploaderErrorType.Upload]: 'some text 7'
});

export const mockDefaultFile = (): File => {
  const parts = [new Blob(['you construct a file...'], { type: 'text/plain' }), new Uint16Array([33])];
  return new File(parts, 'foo.txt', {
    type: 'text/plain'
  });
};

export const mockFilesUploaderFileData = (): FilesUploaderFileData => ({
  name: 'foo.txt',
  path: '/somePath/foo.txt',
  size: 4
});

export const mockInstanceFilesUploader = (
  settings: FilesUploaderSettings = {},
  themes: string[] = []
): FilesUploader => {
  mockDefaultInput();
  return new FilesUploader('#test', settings, themes);
};

export const mockQueueElement = (id: string, status = FilesUploaderStatus.Complete): QueueElement => ({
  status,
  id
});

export const mockPropsUploadingComponent = (): UploadingComponentProps => ({
  file: mockDefaultFile(),
  cancel: jest.fn(),
  upload: jest.fn()
});

export const mockPropsCompleteComponent = (): CompleteComponentProps => ({
  imageElement: createImage('/test.jpg'),
  data: mockFilesUploaderFileData(),
  remove: jest.fn()
});

export const mockPropsUploadingElement = (factoryChildAlias: string): UploadingWrapperProps => ({
  file: mockDefaultFile(),
  componentChildFactoryAlias: factoryChildAlias,
  statusTexts: mockFilesUploaderStatusTexts(),
  errorTexts: mockFilesUploaderErrorTexts(),
  imageElement: createImage('/test.png'),
  upload: jest.fn(),
  cancel: jest.fn()
});

export const mockPropsCompleteElement = (factoryChildAlias: string): CompleteWrapperProps => ({
  file: mockDefaultFile(),
  imageElement: createImage('/test.png'),
  data: mockFilesUploaderFileData(),
  componentChildFactoryAlias: factoryChildAlias,
  remove: jest.fn(),
  statusTexts: mockFilesUploaderStatusTexts(),
  errorTexts: mockFilesUploaderErrorTexts()
});
