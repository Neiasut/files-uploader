import { FilesUploaderErrorType, FilesUploaderStatus } from '../enums/enums';
import FilesUploader from '../FilesUploader';

export interface FilesUploaderListElements {
  input: HTMLInputElement;
  wrapper: Element;
  loader: Element;
  wrapperLists: Element;
  inProcessList: Element;
  completeList: Element;
  inProcessListWrapper: Element;
  completeListWrapper: Element;
}

export interface FilesUploaderLabels {
  loader?: string;
  inProcessList?: string;
  completeList?: string;
}

export interface FilesUploaderSettings {
  actionLoad?: string;
  actionRemove?: string;
  maxSize?: number;
  maxFiles?: number;
  acceptTypes?: string[];
  maxParallelUploads?: number;
  autoUpload?: boolean;
  factoryUploadingComponent?: (data: FilesUploaderFileInfo) => LoadingFileComponent;
  factoryCompleteComponent?: (data: FilesUploaderFileDataElement, imageView: boolean) => CompleteFileComponent;
  labels?: FilesUploaderLabels;
  statusTexts?: FilesUploaderStatusesKeys;
  errorTexts?: FilesUploaderErrorKeys;
  imageView?: boolean;
  headersLoad?: { [key: string]: string };
  headersRemove?: { [key: string]: string };
  externalDataLoad?: { [key: string]: string };
  externalDataRemove?: { [key: string]: string };
}

export type FilesUploaderStatusesKeys = Record<FilesUploaderStatus, string>;
export type FilesUploaderErrorKeys = Record<FilesUploaderErrorType, string>;

export interface FilesUploaderErrorInfo {
  type: FilesUploaderErrorType;
  text: string;
}

export interface FilesUploaderFileInfo {
  readonly name: string;
  readonly size: number;
  readonly extension: string;
}

export interface FilesUploaderFileDataElement extends FilesUploaderFileInfo {
  id: string;
  path: string;
  externalData?: object;
}

export interface FilesUploaderAddFileToQueueEvent {
  instance: FilesUploader;
}

export interface FilesUploaderAddFileEvent {
  instance: FilesUploader;
}

export interface FilesUploaderFileData extends FilesUploaderFileInfo {
  path: string;
  externalData?: object;
}

export interface FilesUploaderElement {
  setError(errors: FilesUploaderErrorType[], listTextErrors: FilesUploaderErrorKeys): void;
  setStatus(status: FilesUploaderStatus): void;
}

export interface FilesUploaderComponent {
  onInit(...args): void;
  render(): HTMLElement;
  destroy(): void;
  setStatus?(status: FilesUploaderStatus): void;
  setError?(errorTexts: FilesUploaderErrorInfo[]): void;
}

export interface CompleteFileComponent extends FilesUploaderComponent {
  onInit(data: FilesUploaderFileDataElement, imageView: boolean): void;
  onDidCallRemove(handler: () => void): void;
}

export interface LoadingFileComponent extends FilesUploaderComponent {
  onInit(data: FilesUploaderFileInfo): void;
  onDidCallUpload(handler: () => void): void;
  onDidCallCancel(handler: () => void): void;
  changePercent?(percent: number): void;
}
