import { FilesUploaderStatus, FilesUploaderTypeFile } from '../enums/enums';
import { FilesUploaderFileConstructorFn, FilesUploaderLoadingConstructorFn } from '../interfaces/interfaces';

export const createLoader = (text: string): Element => {
  const loader = document.createElement('div');
  loader.classList.add('FilesUploaderLoader');
  const textEl = document.createElement('div');
  textEl.classList.add('FilesUploaderLoader-Text');
  textEl.innerHTML = text;
  loader.appendChild(textEl);
  return loader;
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
  const buttonUpload = root.querySelector('.upload');
  buttonUpload.addEventListener('click', onUpload);
  const buttonCancel = root.querySelector('.cancel');
  buttonCancel.addEventListener('click', onCancel);
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
    },
    onDestroy: () => {
      buttonUpload.removeEventListener('click', onUpload);
      buttonCancel.removeEventListener('click', onCancel);
    }
  };
};

export const defaultFileComponentConstructorFn: FilesUploaderFileConstructorFn = (data, onDelete, imageView) => {
  const root = document.createElement('div');
  root.innerHTML = `
    ${
      imageView ? `<span class="imageWrapper"><img class="image" src="${data.path}" alt="download image" /></span>` : ''
    }
    <span>${data.name}</span>
    <span><button type="button">Remove</button></span>
  `;
  const button = root.querySelector('button');
  button.addEventListener('click', onDelete);

  return {
    elementDOM: root,
    onDestroy: () => {
      button.removeEventListener('click', onDelete);
    }
  };
};
