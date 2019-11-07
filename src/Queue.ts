import { FilesUploaderStatus } from './enums/enums';
import EventDispatcher from './EventDispatcher';
import { QueueElement } from './interfaces/interfaces';

export default class Queue<T extends QueueElement> {
  private arr: T[] = [];

  add(element: T) {
    this.arr.push(element);
    this.fireDidChangeLength();
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

  updatePositionElement(oldPosition: number, newPosition: number) {
    const elementData = this.arr.splice(oldPosition, 1);
    this.arr.splice(newPosition, 0, elementData[0]);
  }

  protected didChangeLengthDispatcher = new EventDispatcher<number>();
  onDidChangeLength(handler: (length: number) => void) {
    this.didChangeLengthDispatcher.register(handler);
  }
  protected fireDidChangeLength() {
    this.didChangeLengthDispatcher.fire(this.length);
  }
}
