import { FilesUploaderErrorType, FilesUploaderStatus } from '../enums/enums';
import LoadingComponent from '../LoadingComponent';
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
}

export interface FilesUploaderLoadingElement extends Element {
  filesUploaderLoadingElement?: LoadingComponent;
}

export type FilesUploaderLoadingConstructorFn = (
  file: File,
  onUpload: () => void,
  onCancel: () => void
) => {
  elementDOM: Element;
  onChangeStatus?: (status: FilesUploaderStatus) => void;
  onChangePercent?: (percent: number) => void;
  onError?: (errorTexts: FilesUploaderErrorInfo[]) => void;
};

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
) => {
  elementDOM: Element;
};

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