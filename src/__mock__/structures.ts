import { FilesUploaderErrorType } from '../enums/enums';
import {
  FilesUploaderErrorKeys,
  FilesUploaderFileData,
  FilesUploaderFileDataElement,
  FilesUploaderSettings
} from '../interfaces/interfaces';
import FilesUploader from '../FilesUploader';
import LoadingComponent from '../LoadingComponent';
import {defaultLoadingComponentConstructorFn} from '../functions/constructors';

export const mockFilesUploaderErrorKeys = (): FilesUploaderErrorKeys => ({
  [FilesUploaderErrorType.Server]: 'some text',
  [FilesUploaderErrorType.Size]: 'some text 2',
  [FilesUploaderErrorType.MoreMaxFiles]: 'some text 3',
  [FilesUploaderErrorType.Type]: 'some text 4'
});

export const mockDefaultFile = (): File => {
  return new File(['test'], 'foo.txt', {
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
  const input = document.createElement('input');
  input.type = 'file';
  input.id = 'test';
  document.body.appendChild(input);
  return new FilesUploader('#test', settings, themes);
};

export const mockLoadingComponent = (numb = 0): LoadingComponent => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return new LoadingComponent(div, numb, mockDefaultFile(), defaultLoadingComponentConstructorFn, () => 0, () => 0);
};
