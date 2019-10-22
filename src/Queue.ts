import { FilesUploaderStatus } from './enums/enums';
import LoadingComponent from './LoadingComponent';

export default class Queue {
  private arr: LoadingComponent[] = [];

  add(element: LoadingComponent) {
    this.arr.push(element);
  }

  get(numb: number): LoadingComponent {
    return this.arr.find(element => element.numb === numb);
  }

  remove(numb: number): LoadingComponent {
    const element = this.get(numb);
    const index = this.arr.indexOf(element);
    if (index !== -1) {
      this.arr.splice(index, 1);
    }
    return element;
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
