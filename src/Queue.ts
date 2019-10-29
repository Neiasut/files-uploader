import { FilesUploaderStatus } from './enums/enums';
import LoadingElement from './LoadingComponent';

export default class Queue {
  private arr: LoadingElement[] = [];

  add(element: LoadingElement) {
    this.arr.push(element);
  }

  get(numb: number): LoadingElement {
    return this.arr.find(element => element.numb === numb);
  }

  remove(numb: number): LoadingElement {
    const element = this.get(numb);
    const index = this.arr.indexOf(element);
    if (index !== -1) {
      return this.arr.splice(index, 1)[0];
    }
    return;
  }

  get length() {
    return this.arr.length;
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
