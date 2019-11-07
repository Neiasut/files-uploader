import { FilesUploaderErrorType } from '../enums/enums';
import FilesUploaderError from './FileUploaderError';

type FilesUploaderErrorNetworkReasons =
  | FilesUploaderErrorType.Network
  | FilesUploaderErrorType.Upload
  | FilesUploaderErrorType.Remove;

export default class FilesUploaderErrorNetwork extends FilesUploaderError {
  request: XMLHttpRequest;
  constructor(message: string, reasons: FilesUploaderErrorNetworkReasons[], request: XMLHttpRequest) {
    super(message, reasons);
    this.request = request;
  }
}
