import { FilesUploaderFileConstructorFnResult } from './interfaces/interfaces';
import { FilesUploaderErrorType, FilesUploaderTypeFile } from './enums/enums';
import { addHeaders, transformObjectToSendData } from './functions/functions';

export default class FileComponent {
  wrapper: Element;
  pathFile: string;
  readonly onDestroy: () => void;
  constructor(pathFile: string, insertionPoint: Element, constructionData: FilesUploaderFileConstructorFnResult) {
    const wrapper = this.getWrapper();
    wrapper.appendChild(constructionData.elementDOM);
    insertionPoint.appendChild(wrapper);
    this.wrapper = wrapper;
    this.pathFile = pathFile;
    this.onDestroy = constructionData.onDestroy;
  }

  protected getWrapper(): Element {
    const root = document.createElement('li');
    root.setAttribute('data-file-type', FilesUploaderTypeFile.Downloaded);
    return root;
  }

  delete(
    pathRemove: string,
    headers: { [key: string]: string },
    externalData: { [key: string]: string }
  ): Promise<any> {
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
      xhr.send(info);
    });
  }

  destroy() {
    if (this.onDestroy) {
      this.onDestroy();
    }
    this.wrapper.remove();
  }
}
