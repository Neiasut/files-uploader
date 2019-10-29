import { FilesUploaderErrorType } from '../enums/enums';
import {
  FilesUploaderErrorKeys,
  FilesUploaderFileData,
  FilesUploaderFileDataElement,
  FilesUploaderSettings
} from '../interfaces/interfaces';
import FilesUploader from '../FilesUploader';
import UploadingElement from '../UploadingElement';
import { factoryDefaultUploadingComponent } from '../DefaultUploadingComponent';
import { getFilesUploaderFileInfoFromInstanceFile } from '../functions/functions';

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

export const mockFilesUploaderErrorKeys = (): FilesUploaderErrorKeys => ({
  [FilesUploaderErrorType.Server]: 'some text',
  [FilesUploaderErrorType.Size]: 'some text 2',
  [FilesUploaderErrorType.MoreMaxFiles]: 'some text 3',
  [FilesUploaderErrorType.Type]: 'some text 4'
});

export const mockDefaultFile = (): File => {
  const parts = [
    new Blob(['you construct a file...'], { type: 'text/plain' }),
    ' Same way as you do with blob',
    new Uint16Array([33])
  ];
  return new File(parts, 'foo.txt', {
    type: 'text/plain'
  });
};

export const mockFilesUploaderFileDataElement = (): FilesUploaderFileDataElement => ({
  id: 'someid90',
  name: 'foo.txt',
  path: '/somePath/foo.txt',
  size: 4,
  extension: 'txt'
});

export const mockFilesUploaderFileData = (): FilesUploaderFileData => ({
  name: 'foo.txt',
  path: '/somePath/foo.txt',
  size: 4,
  extension: 'txt'
});

export const mockInstanceFilesUploader = (
  settings: FilesUploaderSettings = {},
  themes: string[] = []
): FilesUploader => {
  mockDefaultInput();
  return new FilesUploader('#test', settings, themes);
};

export const mockLoadingComponent = (numb = 0): UploadingElement => {
  const file = mockDefaultFile();
  const instance = factoryDefaultUploadingComponent(getFilesUploaderFileInfoFromInstanceFile(file));
  return new UploadingElement(document.body, numb, file, instance);
};
