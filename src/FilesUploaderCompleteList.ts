import { FilesUploaderFileDataElement } from './interfaces/interfaces';

export default class FilesUploaderCompleteList {
  private arr: FilesUploaderFileDataElement[] = [];

  add(data: FilesUploaderFileDataElement) {
    this.arr.push(data);
  }

  remove(path: string): FilesUploaderFileDataElement {
    const index = this.arr.findIndex(element => element.path === path);
    if (index !== -1) {
      return this.arr.splice(index, 1)[0];
    }
  }

  get length() {
    return this.arr.length;
  }
}
