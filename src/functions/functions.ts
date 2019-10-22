import { FilesUploaderErrorInfo, FilesUploaderErrorKeys } from '../interfaces/interfaces';
import { FilesUploaderErrorType } from '../enums/enums';

export const mergeDeepConfig = (...objects) => {
  const isObject = obj => obj && typeof obj === 'object';

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = oVal;
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeepConfig(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });

    return prev;
  }, {});
};

export const setInput = (input: HTMLInputElement, maxFiles: number, acceptTypes: string[], size: number) => {
  input.setAttribute('data-files-uploader-element', 'input');
  input.type = 'file';
  input.size = size;
  input.classList.add('FilesUploaderLoader-Input');
  setAttrMultiple(input, maxFiles);
  setAcceptTypes(input, acceptTypes);
};

const setAcceptTypes = (input: HTMLInputElement, acceptTypes: string[]) => {
  input.accept = acceptTypes.map(type => `.${type}`).join(', ');
};

const setAttrMultiple = (input: HTMLInputElement, maxFiles: number) => {
  input.multiple = maxFiles > 1;
};

export const getFileExtension = (fileName: string): string => {
  const ext = fileName.split('.').pop();
  const posGet = ext.indexOf('?');
  if (posGet !== -1) {
    return ext.slice(0, posGet);
  }
  return ext;
};

export const validateFileExtension = (file: File, acceptTypes: string[]): boolean => {
  const extension = getFileExtension(file.name).toLowerCase();
  return acceptTypes.some(availableExtension => availableExtension.toLowerCase() === extension);
};

export const validateFileSize = (file: File, maxSize: number): boolean => file.size <= maxSize;

export const calcPercentage = (upload: number, all: number, round: number = 2) => {
  return +((upload / all) * 100).toFixed(round);
};

export const formatGetParams = (params: { [key: string]: string }): string => {
  const entries = Object.entries(params);
  if (entries.length) {
    return '?' + entries.map(entry => `${entry[0]}=${encodeURIComponent(entry[1])}`).join('&');
  }
  return '';
};

export const getFilesUploaderErrorInfo = (
  errors: FilesUploaderErrorType[],
  texts: FilesUploaderErrorKeys
): FilesUploaderErrorInfo[] => {
  return errors.map(error => ({
    type: error,
    text: texts[error]
  }));
};

export const generateRandomString = (length: number = 8): string => {
  let t = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    t += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return t;
};
