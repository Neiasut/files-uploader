import { FilesUploaderErrorType } from '../enums/enums';

export default class FilesUploaderError extends Error {
  reasons: FilesUploaderErrorType[];
  constructor(message: string, reasons: FilesUploaderErrorType[]) {
    super(message);
    this.reasons = reasons;
  }
}
