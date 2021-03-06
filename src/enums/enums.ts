export enum FilesUploaderStatus {
  WaitingUpload = 'waitingUpload',
  Uploading = 'uploading',
  Complete = 'complete',
  Error = 'error',
  Removing = 'removing'
}

export enum FilesUploaderErrorType {
  MoreMaxFiles = 'moreMaxFiles',
  Size = 'size',
  Type = 'type',
  Network = 'network',
  Data = 'data',
  Remove = 'remove',
  Upload = 'upload'
}

export enum FilesUploaderTypeFile {
  Uploading = 'uploading',
  Complete = 'complete'
}

export enum FilesUploaderDefaultComponentAliases {
  UploadingElement = 'uploadingElement',
  CompleteElement = 'completeElement',
  DefaultUploadingComponent = 'defaultUploadingComponent',
  DefaultCompleteComponent = 'defaultCompleteComponent'
}

export enum FilesUploaderComponentButtonTypes {
  Upload = 'upload',
  Cancel = 'cancel',
  Remove = 'remove'
}

export enum FilesUploaderEvents {
  DidAddFileToQueue = 'didAddFileToQueue',
  DidRemoveFileFromQueue = 'didRemoveFileFromQueue',
  DidAddFileToCompleteList = 'didAddFileToCompleteList',
  DidRemoveFileFromCompleteList = 'didRemoveFileFromCompleteList',
  DidUploadFile = 'didUploadFile',
  DidRemoveFile = 'didRemoveFile'
}
