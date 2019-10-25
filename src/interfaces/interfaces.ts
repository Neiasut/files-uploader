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
  loadingComponentConstructorFn?: FilesUploaderLoadingConstructorFn;
  fileComponentConstructorFn?: FilesUploaderFileConstructorFn;
  labels?: FilesUploaderLabels;
  statusTexts?: FilesUploaderStatusesKeys;
  errorTexts?: FilesUploaderErrorKeys;
  imageView?: boolean;
  headersLoad?: { [key: string]: string };
  headersRemove?: { [key: string]: string };
  externalDataLoad?: { [key: string]: string };
  externalDataRemove?: { [key: string]: string };
}

export type FilesUploaderLoadingConstructorFn = (
  file: File,
  onUpload: () => void,
  onCancel: () => void
) => FilesUploaderLoadingConstructorFnResult;

export interface FilesUploaderLoadingConstructorFnResult {
  elementDOM: Element;
  onChangeStatus?: (status: FilesUploaderStatus) => void;
  onChangePercent?: (percent: number) => void;
  onError?: (errorTexts: FilesUploaderErrorInfo[]) => void;
  onDestroy?: () => void;
}

export type FilesUploaderStatusesKeys = Record<FilesUploaderStatus, string>;
export type FilesUploaderErrorKeys = Record<FilesUploaderErrorType, string>;

export interface FilesUploaderErrorInfo {
  type: FilesUploaderErrorType;
  text: string;
}

export type FilesUploaderFileConstructorFn = (
  data: FilesUploaderFileDataElement,
  onDelete: () => void,
  imageView: boolean
) => FilesUploaderFileConstructorFnResult;

export interface FilesUploaderFileConstructorFnResult {
  elementDOM: Element;
  onDestroy?: () => void;
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

export interface FilesUploaderFileData extends FilesUploaderFileInfo {
  path: string;
  externalData?: object;
}
