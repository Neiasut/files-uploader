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

export const createWrapperElement = (type: FilesUploaderTypeFile): HTMLLIElement => {
  const li = document.createElement('li');
  li.setAttribute('data-wrapper-element-type', type);
  return li;
};

const spriteIcons = () => {
  return `
<symbol viewBox="0 0 24 24" id="fileUploaderIcon_upload" xmlns="http://www.w3.org/2000/svg">
  <g><path fill-rule="evenodd" clip-rule="evenodd" d="M15 16.5V10.5H19L12 3.5L5 10.5H9V16.5H15ZM12 6.33L14.17 8.5H13V14.5H11V8.5H9.82999L12 6.33ZM19 20.5V18.5H5V20.5H19Z" /></g>  
</symbol>
<symbol viewBox="0 0 24 24" id="fileUploaderIcon_cancel" xmlns="http://www.w3.org/2000/svg">
<g><path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/></g>
</symbol>
<symbol viewBox="0 0 100 100" id="fileUploaderIcon_remove" xmlns="http://www.w3.org/2000/svg">
<g>
  <path d="m20.801 88.398c0 3.6992 3 6.6016 6.6992 6.6016h45.102c3.6992 0 6.6992-2.8984 6.6992-6.6016l2.5977-54.398h-63.598zm41.199-43.5c0-1.8984 1.1016-3.3984 3-3.3984s3 1.5 3 3.3984v37.602c0 1.8984-1.1016 3.3984-3 3.3984s-3-1.5-3-3.3984zm-15 0c0-1.8984 1.1016-3.3984 3-3.3984s3 1.5 3 3.3984v37.602c0 1.8984-1.1016 3.3984-3 3.3984s-3-1.5-3-3.3984zm-15 0c0-1.8984 1.1016-3.3984 3-3.3984s3 1.5 3 3.3984v37.602c0 1.8984-1.1016 3.3984-3 3.3984s-3-1.5-3-3.3984z"/>
  <path d="m83.102 17h-18.102v-8.8984c0-1.8008-0.89844-3.1016-2.8008-3.1016h-24.199c-1.8984 0-3 1.3008-3 3.1016v8.8984h-17.898c-1.8984 0-3.1016 1.3984-3.1016 3.3008v3.8008c0 1.8984 1.1992 3.8984 3.1016 3.8984h66.102c1.8984 0 2.8984-2.1016 2.8984-3.8984v-3.8008c-0.10156-1.9023-1.1016-3.3008-3-3.3008zm-24.102 0h-18v-6h18z"/>
 </g>
</symbol>
  `;
};

export const createSprite = (): Element => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.style.position = 'absolute';
  svg.style.width = '0px';
  svg.style.height = '0px';
  svg.id = 'files-uploader-sprite';
  svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  svg.innerHTML = spriteIcons();

  return svg;
};

export const createDefaultIcon = (name: string): string =>
  `<svg class="FilesUploaderIcon"><use xlink:href="#fileUploaderIcon_${name}"></use></svg>`;
