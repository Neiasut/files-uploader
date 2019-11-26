import { FilesUploaderStatus } from './enums/enums';
import EventDispatcher from './EventDispatcher';
import { QueueDidChangeLengthEvent, QueueElement } from './interfaces/interfaces';
import { generateRandomString } from './functions/functions';

export default class Queue<T extends QueueElement> {
  private arr: T[] = [];
  private oldLength: number = 0;

  add(element: T) {
    if (typeof element.id !== 'string') {
      element.id = generateRandomString();
    }
    this.oldLength = this.arr.length;
    this.arr.push(element);
    this.fireDidChangeLength(element);
  }

  get(id: string): T {
    return this.getByFn(element => element.id === id);
  }

  getByFn(cb: (component: T, position: number) => void): T {
    return this.arr.find((element, position) => cb(element, position));
  }

  remove(id: string): T {
    const element = this.get(id);
    const index = this.arr.indexOf(element);
    if (index !== -1) {
      this.oldLength = this.arr.length;
      const removed = this.arr.splice(index, 1)[0];
      this.fireDidChangeLength(element);
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

  updatePositionElement(oldPosition: number, newPosition: number) {
    const elementData = this.arr.splice(oldPosition, 1);
    this.arr.splice(newPosition, 0, elementData[0]);
  }

  didChangeLengthDispatcher = new EventDispatcher<QueueDidChangeLengthEvent<T>>();

  private fireDidChangeLength(element: T) {
    this.didChangeLengthDispatcher.fire({
      element,
      queueLength: this.arr.length,
      queueOldLength: this.oldLength
    });
  }

  fnToAll(cb: (element: T) => void) {
    this.arr.forEach(el => {
      cb(el);
    });
  }
}
