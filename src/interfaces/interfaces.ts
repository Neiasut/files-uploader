import { FilesUploaderErrorType, FilesUploaderStatus } from '../enums/enums';
import LoadingComponent from '../LoadingComponent';

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
  Loader?: string;
  InProcessList?: string;
  CompleteList?: string;
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
  statusTexts?: FilesUploaderStatusesKeys<string>;
  errorTexts?: FilesUploaderErrorKeys<string>;
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

type FilesUploaderStatusesKeys<K> = { [key in keyof typeof FilesUploaderStatus]?: K };
export type FilesUploaderErrorKeys<K> = { [key in keyof typeof FilesUploaderErrorType]?: K };
export interface FilesUploaderErrorInfo {
  type: keyof typeof FilesUploaderErrorType;
  text: string;
}

export type FilesUploaderFileConstructorFn = (
  data: FilesUploaderFileDataElement,
  onDelete: () => void
) => {
  elementDOM: Element;
};

export interface FilesUploaderFileInfo {
  readonly name: string;
  readonly size: number;
  readonly type: string;
}

export interface FilesUploaderFileDataElement extends FilesUploaderFileInfo {
  path: string;
  externalData?: object;
}
