import { FilesUploaderErrorType, FilesUploaderStatus, FilesUploaderTypeFile } from './enums/enums';
import { addHeaders, getFilesUploaderErrorInfo, transformObjectToSendData } from './functions/functions';
import { CompleteFileComponent, FilesUploaderElement, FilesUploaderErrorKeys } from './interfaces/interfaces';

export default class CompleteElement implements FilesUploaderElement {
  wrapper: Element;
  pathFile: string;
  component: CompleteFileComponent;
  status: FilesUploaderStatus;
  errorTypes: FilesUploaderErrorType[] = [];
  constructor(pathFile: string, insertionPoint: Element, component: CompleteFileComponent) {
    const wrapper = this.getWrapper();
    wrapper.appendChild(component.render());
    insertionPoint.appendChild(wrapper);
    this.wrapper = wrapper;
    this.pathFile = pathFile;
    this.component = component;
    this.setStatus(FilesUploaderStatus.Complete);
  }

  protected getWrapper(): Element {
    const root = document.createElement('li');
    root.setAttribute('data-file-type', FilesUploaderTypeFile.Complete);
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

  setStatus(status: FilesUploaderStatus.Complete | FilesUploaderStatus.Error) {
    this.wrapper.setAttribute('data-file-status', status);
    this.status = status;
    if (status !== FilesUploaderStatus.Error) {
      this.errorTypes = [];
    }
    this.component.setStatus(status);
  }

  setError(errors: FilesUploaderErrorType[], listTextErrors: FilesUploaderErrorKeys) {
    this.errorTypes = errors;
    this.setStatus(FilesUploaderStatus.Error);
    this.component.setError(getFilesUploaderErrorInfo(errors, listTextErrors));
  }

  destroy() {
    this.component.destroy();
    this.wrapper.remove();
  }
}
