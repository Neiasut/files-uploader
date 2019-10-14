export const createLoader = (input: HTMLInputElement, text: string): Element => {
  const loader = document.createElement('div');
  loader.classList.add('FilesUploaderLoader');
  const textEl = document.createElement('div');
  textEl.classList.add('FilesUploaderLoader-Text');
  textEl.innerHTML = text;
  loader.appendChild(textEl);
  input.classList.add('FilesUploaderLoader-Input');
  loader.appendChild(input);
  return loader;
};

export const createInput = (name: string, maxFiles: number, acceptTypes: string[], size: number): HTMLInputElement => {
  const input = document.createElement('input');
  input.setAttribute('data-files-uploader-element', 'input');
  input.type = 'file';
  input.name = name;
  input.size = size;
  setAttrMultiple(input, maxFiles);
  setAcceptTypes(input, acceptTypes);
  return input;
};

type typeLists = 'inProcess' | 'complete';

export const createListElements = (type: typeLists): Element => {
  const list = document.createElement('ul');
  list.classList.add('FilesUploaderList', `FilesUploaderList_type_${type}`);
  return list;
};

const createListTitle = (text: string): Element => {
  const title = document.createElement('label');
  title.classList.add('FilesUploader-ListTitle');
  title.textContent = text;
  return title;
};

export const createListWrapper = (type: typeLists, title?: string): Element => {
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

/*export const createWrapperElement = (type: typeLists): Element => {
  const elementWrapper = document.createElement('li');
  elementWrapper.classList.add('FilesUploaderList-Element', `FilesUploaderList-Element_type_${type}`);
  return elementWrapper;
};*/
