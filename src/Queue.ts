import { FilesUploaderStatus } from './enums/enums';
import UploadingElement from './UploadingElement';
import EventDispatcher from './EventDispatcher';

export default class Queue {
  private arr: UploadingElement[] = [];

  add(element: UploadingElement) {
    this.arr.push(element);
    this.fireDidChangeLength();
  }

  get(numb: number): UploadingElement {
    return this.arr.find(element => element.numb === numb);
  }

  remove(numb: number): UploadingElement {
    const element = this.get(numb);
    const index = this.arr.indexOf(element);
    if (index !== -1) {
      const removed = this.arr.splice(index, 1)[0];
      this.fireDidChangeLength();
      return removed;
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

  protected didChangeLengthDispatcher = new EventDispatcher<number>();
  onDidChangeLength(handler: (length: number) => void) {
    this.didChangeLengthDispatcher.register(handler);
  }
  protected fireDidChangeLength() {
    this.didChangeLengthDispatcher.fire(this.length);
  }
}
