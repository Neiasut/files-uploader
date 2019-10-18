import { FilesUploaderErrorType, FilesUploaderStatus } from './enums/enums';
import {
  FilesUploaderErrorInfo,
  FilesUploaderFileDataElement,
  FilesUploaderLoadingConstructorFn,
  FilesUploaderLoadingDataElement,
  FilesUploaderLoadingElement
} from './interfaces/interfaces';
import { calcPercentage } from './functions';

export default class LoadingComponent {
  percent = 0;
  wrapper: Element;
  protected onChangePercent: (percent: number) => void | null;
  protected onChangeStatus: (status: FilesUploaderStatus) => void | null;
  protected onError: (errors: FilesUploaderErrorInfo[]) => void | null;
  xhr: XMLHttpRequest | null = null;
  data: FilesUploaderLoadingDataElement;
  constructor(
    insertionPoint: Element,
    numb: number,
    data: FilesUploaderLoadingDataElement,
    constructorFn: FilesUploaderLoadingConstructorFn,
    onUpload: () => void,
    onCancel: () => void
  ) {
    this.data = data;
    const dataFromConstructorFn = constructorFn(data, onUpload, onCancel);
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
    this.setStatus(data.status);
  }

  protected getWrapper(numb: number): FilesUploaderLoadingElement {
    const root = document.createElement('li');
    root.setAttribute('data-index', numb.toString());
    return root;
  }

  changePercent(percent: number) {
    this.percent = percent;
    if (this.onChangePercent !== null) {
      this.onChangePercent(percent);
    }
  }

  setStatus(status: FilesUploaderStatus) {
    this.wrapper.setAttribute('data-file-status', FilesUploaderStatus[status].toLowerCase());
    if (this.onChangeStatus !== null) {
      this.onChangeStatus(status);
    }
  }

  setError(errors: FilesUploaderErrorInfo[]): void {
    this.setStatus(FilesUploaderStatus.Error);
    if (this.onError !== null) {
      this.onError(errors);
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
      dataUpload.append('file', this.data.file);
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
