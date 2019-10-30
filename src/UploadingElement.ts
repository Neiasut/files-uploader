import { FilesUploaderErrorType, FilesUploaderStatus, FilesUploaderTypeFile } from './enums/enums';
import {
  FilesUploaderAvailableStatusesUploading,
  FilesUploaderElement,
  FilesUploaderErrorKeys,
  FilesUploaderFileDataElement,
  UploadingFileComponent
} from './interfaces/interfaces';
import {
  addHeaders,
  calcPercentage,
  getFilesUploaderErrorInfo,
  transformObjectToSendData
} from './functions/functions';

export default class UploadingElement implements FilesUploaderElement {
  percent = 0;
  wrapper: Element;
  xhr: XMLHttpRequest | null = null;
  status: FilesUploaderAvailableStatusesUploading;
  errorTypes: FilesUploaderErrorType[] = [];
  readonly file: File;
  readonly numb: number;
  component: UploadingFileComponent;

  constructor(insertionPoint: Element, numb: number, file: File, component: UploadingFileComponent) {
    this.numb = numb;
    this.file = file;
    this.component = component;
    const wrapper = this.getWrapper(numb);
    wrapper.appendChild(component.render());
    insertionPoint.appendChild(wrapper);
    this.wrapper = wrapper;
    this.setStatus(FilesUploaderStatus.WaitingUpload);
  }

  get error(): boolean {
    return this.errorTypes.length > 0;
  }

  protected getWrapper(numb: number): Element {
    const root = document.createElement('li');
    root.setAttribute('data-index', numb.toString());
    root.setAttribute('data-file-type', FilesUploaderTypeFile.Uploading);
    return root;
  }

  changePercent(percent: number) {
    this.percent = percent;
    if (this.component.changePercent) {
      this.component.changePercent(percent);
    }
  }

  setStatus(status: FilesUploaderAvailableStatusesUploading) {
    this.wrapper.setAttribute('data-file-status', status);
    this.status = status;
    if (status !== FilesUploaderStatus.Error) {
      this.errorTypes = [];
    }
    this.component.setStatus(status);
  }

  setError(errors: FilesUploaderErrorType[], listTextErrors: FilesUploaderErrorKeys): void {
    this.errorTypes = errors;
    this.setStatus(FilesUploaderStatus.Error);
    this.component.setError(getFilesUploaderErrorInfo(errors, listTextErrors));
  }

  async upload(path: string, headers: { [key: string]: string }, externalData: { [key: string]: string }) {
    return new Promise<FilesUploaderFileDataElement>((resolve, reject: (types: FilesUploaderErrorType[]) => void) => {
      const xhr = new XMLHttpRequest();
      this.xhr = xhr;
      xhr.open('POST', path, true);
      xhr.responseType = 'json';
      this.setStatus(FilesUploaderStatus.Uploading);
      addHeaders(xhr, headers);
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject([FilesUploaderErrorType.Server]);
        }
      };
      xhr.upload.addEventListener(
        'progress',
        e => {
          const percent = calcPercentage(e.loaded, e.total);
          this.changePercent(percent);
        },
        false
      );
      const sendData = transformObjectToSendData(
        'multipartForm',
        {
          file: this.file
        },
        externalData
      );
      xhr.send(sendData);
    });
  }

  abort() {
    if (this.xhr instanceof XMLHttpRequest) {
      this.xhr.abort();
    }
  }

  destroy() {
    this.component.destroy();
    this.wrapper.remove();
  }
}
