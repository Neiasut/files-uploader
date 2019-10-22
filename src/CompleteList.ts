import { FilesUploaderFileDataElement, FilesUploaderFileData } from './interfaces/interfaces';
import { generateRandomString, mergeDeepConfig } from './functions/functions';

export default class CompleteList {
  private arr: FilesUploaderFileDataElement[] = [];

  add(data: FilesUploaderFileData): FilesUploaderFileDataElement {
    const info: FilesUploaderFileDataElement = mergeDeepConfig({}, data, {
      id: generateRandomString()
    });
    this.arr.push(info);
    return info;
  }

  remove(id: string): FilesUploaderFileDataElement {
    const index = this.arr.findIndex(element => element.id === id);
    if (index !== -1) {
      return this.arr.splice(index, 1)[0];
    }
  }

  get length() {
    return this.arr.length;
  }

  updatePosition(oldIndex: number, newIndex: number) {
    const elementData = this.arr.splice(oldIndex, 1);
    this.arr.splice(newIndex, 0, elementData[0]);
  }

  get(id: string): FilesUploaderFileDataElement {
    return this.getByFn(element => element.id === id);
  }

  getByFn(cb: (element: FilesUploaderFileDataElement, numb: number) => void): FilesUploaderFileDataElement {
    return this.arr.find((element, numb) => cb(element, numb));
  }
}
