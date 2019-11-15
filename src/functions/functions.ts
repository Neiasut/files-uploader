import {
  FilesUploaderErrorInfo,
  FilesUploaderErrorTexts,
  FilesUploaderFileInfo,
  FilesUploaderSendData
} from '../interfaces/interfaces';
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

export const getFilesUploaderErrorInfo = (
  errors: FilesUploaderErrorType[],
  texts: FilesUploaderErrorTexts
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

export const addHeaders = (xhr: XMLHttpRequest, headers?: { [key: string]: string }) => {
  if (typeof headers === 'object' && headers !== null) {
    for (const [headerName, headerValue] of Object.entries(headers)) {
      xhr.setRequestHeader(headerName, headerValue);
    }
  }
};

export const transformObjectToSendData = (
  initData: FilesUploaderSendData,
  onData?: (data: FilesUploaderSendData) => FilesUploaderSendData
): FilesUploaderSendData => {
  if (typeof onData === 'function') {
    return onData(initData);
  }
  return initData;
};

export const getFilesUploaderFileInfoFromInstanceFile = (file: File): FilesUploaderFileInfo => ({
  name: file.name,
  size: file.size
});

export const getQueryElement = (element: HTMLInputElement | string): HTMLInputElement | false => {
  if (typeof element === 'string') {
    const elem = document.querySelector(element);
    if (elem !== null && elem instanceof HTMLInputElement) {
      return elem;
    }
  }
  if (element instanceof HTMLElement) {
    return element;
  }
  return false;
};

export const imageFromFile = (file: File): HTMLImageElement => {
  const image = document.createElement('img');
  image.src = URL.createObjectURL(file);
  return image;
};

export const checkFileIsImage = (file: File): boolean => file && file.type.split('/')[0] === 'image';

// tslint:disable-next-line: ban-types
export const checkOnFunction = (f: any): f is Function => typeof f === 'function';

export const createImage = (src: string) => {
  const img = document.createElement('img');
  img.src = src;
  return img;
};

export const checkExtensionInArrAllowed = (extension: string, arrAllowed: string[]): boolean =>
  arrAllowed.includes(extension.toLowerCase());

export const getElementImage = (
  imageView: boolean,
  availableExtensions: string[] | null,
  extension: string | null,
  file: File | null,
  pathImage: string | null
): HTMLImageElement => {
  if (imageView) {
    if (checkFileIsImage(file)) {
      return imageFromFile(file);
    }
    if (
      Array.isArray(availableExtensions) &&
      typeof extension === 'string' &&
      checkExtensionInArrAllowed(extension, availableExtensions)
    ) {
      return createImage(pathImage);
    }
  }
};

export const transformSendDataToFormData = (data: FilesUploaderSendData): FormData => {
  const form = new FormData();
  for (const [name, value] of Object.entries(data)) {
    form.append(name, value);
  }
  return form;
};
