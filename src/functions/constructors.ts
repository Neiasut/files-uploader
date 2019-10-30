import { FilesUploaderTypeFile } from '../enums/enums';

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
  const list = document.createElement('ol');
  list.classList.add('FilesUploaderList', `FilesUploaderList_type_${type}`);
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
  wrapper.classList.add('FilesUploader-WrapperList', `FilesUploader-WrapperList_type_${type}`);
  if (title) {
    wrapper.appendChild(createListTitle(title));
  }
  return wrapper;
};

export const createButtonAsString = (text: string, classes: string[]): string =>
  `<button class="${classes.join(' ')}" type="button">${text}</button>`;
