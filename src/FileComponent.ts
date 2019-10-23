import { FilesUploaderFileConstructorFn, FilesUploaderFileDataElement } from './interfaces/interfaces';
import { FilesUploaderErrorType, FilesUploaderTypeFile } from './enums/enums';
import { addHeaders, transformObjectToSendData } from './functions/functions';

export default class FileComponent {
  wrapper: Element;
  pathFile: string;
  data: FilesUploaderFileDataElement;
  constructor(
    insertionPoint: Element,
    data: FilesUploaderFileDataElement,
    constructorFn: FilesUploaderFileConstructorFn,
    onDelete: () => void,
    imageView: boolean
  ) {
    const result = constructorFn(data, onDelete, imageView);
    const wrapper = this.getWrapper();
    wrapper.appendChild(result.elementDOM);
    insertionPoint.appendChild(wrapper);
    this.wrapper = wrapper;
    this.pathFile = data.path;
  }

  protected getWrapper(): Element {
    const root = document.createElement('li');
    root.setAttribute('data-file-type', FilesUploaderTypeFile.Downloaded);
    return root;
  }

  delete(pathRemove: string, headers: { [key: string]: string }, externalData: { [key: string]: string }) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('DELETE', pathRemove, true);
      xhr.responseType = 'json';
      addHeaders(xhr, headers);
      const info = transformObjectToSendData('json', { path: this.pathFile }, externalData);
      xhr.onload = () => {
        if (xhr.status !== 200) {
          reject([FilesUploaderErrorType.Server]);
        } else {
          resolve(xhr.response);
        }
      };
      xhr.onerror = () => {
        reject([FilesUploaderErrorType.Server]);
      };
      xhr.send(info);
    });
  }

  destroy() {
    this.wrapper.remove();
  }
}
