import { FilesUploaderErrorType, FilesUploaderStatus, FilesUploaderTypeFile } from './enums/enums';
import {
  FilesUploaderErrorInfo,
  FilesUploaderErrorKeys,
  FilesUploaderFileDataElement,
  FilesUploaderLoadingConstructorFnResult
} from './interfaces/interfaces';
import {
  addHeaders,
  calcPercentage,
  getFilesUploaderErrorInfo,
  transformObjectToSendData
} from './functions/functions';

export default class LoadingComponent {
  percent = 0;
  wrapper: Element;
  protected onChangePercent?: (percent: number) => void;
  protected onChangeStatus?: (status: FilesUploaderStatus) => void;
  protected onError?: (errors: FilesUploaderErrorInfo[]) => void;
  protected onDestroy?: () => void;
  xhr: XMLHttpRequest | null = null;
  status: FilesUploaderStatus;
  errorTypes: FilesUploaderErrorType[] = [];
  readonly file: File;
  readonly numb: number;

  constructor(insertionPoint: Element, numb: number, file: File, info: FilesUploaderLoadingConstructorFnResult) {
    this.numb = numb;
    this.file = file;
    const wrapper = this.getWrapper(numb);
    wrapper.appendChild(info.elementDOM);
    this.onChangePercent = info.onChangePercent;
    this.onChangeStatus = info.onChangeStatus;
    this.onError = info.onError;
    this.onDestroy = info.onDestroy;
    insertionPoint.appendChild(wrapper);
    this.wrapper = wrapper;
    this.setStatus(FilesUploaderStatus.WaitUpload);
  }

  get error(): boolean {
    return this.errorTypes.length > 0;
  }

  protected getWrapper(numb: number): Element {
    const root = document.createElement('li');
    root.setAttribute('data-index', numb.toString());
    root.setAttribute('data-file-type', FilesUploaderTypeFile.Introduced);
    return root;
  }

  changePercent(percent: number) {
    this.percent = percent;
    if (this.onChangePercent) {
      this.onChangePercent(percent);
    }
  }

  setStatus(status: FilesUploaderStatus) {
    this.wrapper.setAttribute('data-file-status', status);
    this.status = status;
    if (status !== FilesUploaderStatus.Error) {
      this.errorTypes = [];
    }
    if (this.onChangeStatus) {
      this.onChangeStatus(status);
    }
  }

  setError(errors: FilesUploaderErrorType[], listTextErrors: FilesUploaderErrorKeys): void {
    this.errorTypes = errors;
    this.setStatus(FilesUploaderStatus.Error);
    if (this.onError) {
      this.onError(getFilesUploaderErrorInfo(errors, listTextErrors));
    }
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
    this.xhr.abort();
  }

  destroy() {
    if (this.onDestroy) {
      this.onDestroy();
    }
    this.wrapper.remove();
  }
}
