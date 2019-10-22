import {
  FilesUploaderErrorInfo,
  FilesUploaderErrorKeys,
  FilesUploaderFileConstructorFn,
  FilesUploaderLoadingConstructorFn
} from './interfaces/interfaces';
import { FilesUploaderErrorType, FilesUploaderStatus, FilesUploaderTypeFile } from './enums/enums';

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

export const createLoader = (text: string): Element => {
  const loader = document.createElement('div');
  loader.classList.add('FilesUploaderLoader');
  const textEl = document.createElement('div');
  textEl.classList.add('FilesUploaderLoader-Text');
  textEl.innerHTML = text;
  loader.appendChild(textEl);
  return loader;
};

export const setInput = (input: HTMLInputElement, maxFiles: number, acceptTypes: string[], size: number) => {
  input.setAttribute('data-files-uploader-element', 'input');
  input.type = 'file';
  input.size = size;
  input.classList.add('FilesUploaderLoader-Input');
  setAttrMultiple(input, maxFiles);
  setAcceptTypes(input, acceptTypes);
};

export const createListElements = (type: FilesUploaderTypeFile): Element => {
  const list = document.createElement('ul');
  list.classList.add('FilesUploaderList', `FilesUploaderList_type_${FilesUploaderTypeFile[type]}`);
  return list;
};

const createListTitle = (text: string): Element => {
  const title = document.createElement('label');
  title.classList.add('FilesUploader-ListTitle');
  title.textContent = text;
  return title;
};

export const createListWrapper = (type: FilesUploaderTypeFile, title?: string): Element => {
  const wrapper = document.createElement('div');
  wrapper.classList.add('FilesUploader-WrapperList');
  if (title) {
    wrapper.appendChild(createListTitle(title));
  }
  return wrapper;
};

const setAcceptTypes = (input: HTMLInputElement, acceptTypes: string[]) => {
  input.accept = acceptTypes.map(type => `.${type}`).join(', ');
};

const setAttrMultiple = (input: HTMLInputElement, maxFiles: number) => {
  input.multiple = maxFiles > 1;
};

export const getFileExtension = (fileName: string): string => fileName.split('.').pop();

export const validateFileExtension = (file: File, acceptTypes: string[]): boolean => {
  const extension = getFileExtension(file.name).toLowerCase();
  return acceptTypes.some(availableExtension => availableExtension.toLowerCase() === extension);
};

export const validateFileSize = (file: File, maxSize: number): boolean => file.size <= maxSize;

export const defaultLoadingComponentConstructorFn: FilesUploaderLoadingConstructorFn = (file, onUpload, onCancel) => {
  const root = document.createElement('div');
  root.innerHTML = `
  <span class="name">${file.name}</span>
  <span class="percentage"></span>
  <span class="errors"></span>
  <span class="actions">
    <button class="upload" type="button">upload</button>
    <button class="cancel" type="button">cancel</button>
  </span>
  `;
  const percentage = root.querySelector('.percentage');
  root.querySelector('.upload').addEventListener('click', onUpload);
  root.querySelector('.cancel').addEventListener('click', onCancel);
  const errors = root.querySelector('.errors');
  return {
    elementDOM: root,
    onChangePercent: percent => {
      percentage.textContent = `${percent}%`;
    },
    onChangeStatus: status => {
      if (status !== FilesUploaderStatus.Error) {
        errors.textContent = '';
      }
    },
    onError: errorTexts => {
      errors.textContent = errorTexts.map(info => info.text).join(', ');
    }
  };
};

export const calcPercentage = (upload: number, all: number, round: number = 2) => {
  return +((upload / all) * 100).toFixed(round);
};

export const defaultFileComponentConstructorFn: FilesUploaderFileConstructorFn = (data, onDelete) => {
  const root = document.createElement('div');
  root.innerHTML = `
  <span>${data.name}</span>
  <span><button type="button">Remove</button></span>
  `;
  root.querySelector('button').addEventListener('click', onDelete);

  return {
    elementDOM: root
  };
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
/*
export const generateEvent = (name: string, data: FilesUploaderEventData): FilesUploaderEvent => {
  return new CustomEvent<FilesUploaderEvent>(`FilesUploader.${name}`, {
    detail: data
  });
};*/
