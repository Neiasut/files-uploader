import { FilesUploaderLoadingDataElement } from './interfaces/interfaces';
import { FilesUploaderErrorType, FilesUploaderStatus } from './enums/enums';

export default class FilesUploaderQueue {
  private arr: FilesUploaderLoadingDataElement[] = [];

  get(numb: number): FilesUploaderLoadingDataElement {
    return this.arr.find(element => element.numb === numb);
  }

  remove(numb: number): FilesUploaderLoadingDataElement {
    const element = this.get(numb);
    const index = this.arr.indexOf(element);
    if (index !== -1) {
      this.arr.splice(index, 1);
    }
    return element;
  }

  changeElement(numb: number, status: FilesUploaderStatus, errorReasons: FilesUploaderErrorType[]) {
    const data = this.get(numb);
    if (typeof data !== 'undefined') {
      data.error = status === FilesUploaderStatus.Error;
      data.status = status;
      data.errorTypes = errorReasons;

      return;
    }
    throw new Error(`Element with numb = "${numb}" doesn't exist in queue!`);
  }

  get length() {
    return this.arr.length;
  }

  createElement(file: File, numb: number): FilesUploaderLoadingDataElement {
    const element: FilesUploaderLoadingDataElement = {
      file,
      numb,
      status: FilesUploaderStatus.WaitUpload,
      error: false,
      errorTypes: []
    };
    this.arr.push(element);
    return element;
  }

  get countUploadingFiles(): number {
    return this.arr.reduce((acc, cur) => {
      if (cur.status === FilesUploaderStatus.Uploading) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }
}
