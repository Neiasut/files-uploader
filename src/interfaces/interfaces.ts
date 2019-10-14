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
  loaderLabel?: string;
  inProcessListLabel?: string;
  completeListLabel?: string;
}

export interface FilesUploaderSettings extends FilesUploaderLabels {
  actionLoad?: string;
  actionRemove?: string;
  maxSize?: number;
  maxFies?: number;
  acceptTypes?: string[];
  inputName?: string;
}
