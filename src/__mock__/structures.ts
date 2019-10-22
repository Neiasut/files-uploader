import { FilesUploaderErrorType } from '../enums/enums';
import { FilesUploaderErrorKeys, FilesUploaderFileData, FilesUploaderFileDataElement } from '../interfaces/interfaces';

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
