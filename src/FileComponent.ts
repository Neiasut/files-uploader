import { FilesUploaderFileConstructorFn, FilesUploaderFileDataElement } from './interfaces/interfaces';
import { FilesUploaderErrorType } from './enums/enums';
import { formatGetParams } from './functions';

export default class FileComponent {
  wrapper: Element;
  pathFile: string;
  data: FilesUploaderFileDataElement;
  constructor(
    insertionPoint: Element,
    data: FilesUploaderFileDataElement,
    constructorFn: FilesUploaderFileConstructorFn,
    onDelete: any
  ) {
    const result = constructorFn(data, onDelete);
    const wrapper = this.getWrapper();
    wrapper.appendChild(result.elementDOM);
    insertionPoint.appendChild(wrapper);
    this.wrapper = wrapper;
    this.pathFile = data.path;
  }

  protected getWrapper(): Element {
    return document.createElement('li');
  }

  delete(pathRemove: string) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const path = pathRemove + formatGetParams({ path: this.pathFile });
      xhr.open('DELETE', path, true);
      xhr.responseType = 'json';
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.onerror = () => {
        reject([FilesUploaderErrorType.Server]);
      };
      xhr.send();
    });
  }

  destroy() {
    this.wrapper.remove();
  }
}
