import { FilesUploaderErrorType, FilesUploaderStatus, FilesUploaderTypeFile } from './enums/enums';
import {
  FilesUploaderErrorInfo,
  FilesUploaderErrorKeys,
  FilesUploaderFileDataElement,
  FilesUploaderLoadingConstructorFn,
  FilesUploaderLoadingElement
} from './interfaces/interfaces';
import { calcPercentage, getFilesUploaderErrorInfo } from './functions';

export default class LoadingComponent {
  percent = 0;
  wrapper: Element;
  protected onChangePercent: (percent: number) => void | null;
  protected onChangeStatus: (status: FilesUploaderStatus) => void | null;
  protected onError: (errors: FilesUploaderErrorInfo[]) => void | null;
  xhr: XMLHttpRequest | null = null;
  status: FilesUploaderStatus;
  errorTypes: FilesUploaderErrorType[] = [];
  readonly file: File;
  readonly numb: number;

  constructor(
    insertionPoint: Element,
    numb: number,
    file: File,
    constructorFn: FilesUploaderLoadingConstructorFn,
    onUpload: () => void,
    onCancel: () => void
  ) {
    this.numb = numb;
    this.file = file;
    const dataFromConstructorFn = constructorFn(file, onUpload, onCancel);
    const wrapper = this.getWrapper(numb);
    wrapper.appendChild(dataFromConstructorFn.elementDOM);
    const onChangePercent = dataFromConstructorFn.onChangePercent;
    this.onChangePercent = typeof onChangePercent === 'function' ? onChangePercent : null;
    const onChangeStatus = dataFromConstructorFn.onChangeStatus;
    this.onChangeStatus = typeof onChangeStatus === 'function' ? onChangeStatus : null;
    const onError = dataFromConstructorFn.onError;
    this.onError = typeof onError === 'function' ? onError : null;
    insertionPoint.appendChild(wrapper);
    this.wrapper = wrapper;
    this.setStatus(FilesUploaderStatus.WaitUpload);
  }

  get error(): boolean {
    return this.errorTypes.length > 0;
  }

  protected getWrapper(numb: number): FilesUploaderLoadingElement {
    const root = document.createElement('li');
    root.setAttribute('data-index', numb.toString());
    root.setAttribute('data-file-type', FilesUploaderTypeFile.Introduced);
    return root;
  }

  changePercent(percent: number) {
    this.percent = percent;
    if (this.onChangePercent !== null) {
      this.onChangePercent(percent);
    }
  }

  setStatus(status: FilesUploaderStatus) {
    this.wrapper.setAttribute('data-file-status', status);
    this.status = status;
    if (status !== FilesUploaderStatus.Error) {
      this.errorTypes = [];
    }
    if (this.onChangeStatus !== null) {
      this.onChangeStatus(status);
    }
  }

  setError(errors: FilesUploaderErrorType[], listTextErrors: FilesUploaderErrorKeys): void {
    this.errorTypes = errors;
    this.setStatus(FilesUploaderStatus.Error);
    if (this.onError !== null) {
      this.onError(getFilesUploaderErrorInfo(errors, listTextErrors));
    }
  }

  async upload(path: string) {
    return new Promise<FilesUploaderFileDataElement>((resolve, reject: (types: FilesUploaderErrorType[]) => void) => {
      const xhr = new XMLHttpRequest();
      this.xhr = xhr;
      xhr.open('POST', path, true);
      xhr.responseType = 'json';
      this.setStatus(FilesUploaderStatus.Uploading);
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.onerror = () => {
        reject([FilesUploaderErrorType.Server]);
      };
      xhr.upload.addEventListener(
        'progress',
        e => {
          const percent = calcPercentage(e.loaded, e.total);
          this.changePercent(percent);
        },
        false
      );
      const dataUpload = new FormData();
      dataUpload.append('file', this.file);
      dataUpload.append(
        'object',
        JSON.stringify({
          test: 'test'
        })
      );
      xhr.send(dataUpload);
    });
  }

  abort() {
    if (this.xhr !== null) {
      this.xhr.abort();
    }
    this.xhr = null;
  }

  destroy() {
    this.wrapper.remove();
  }
}
