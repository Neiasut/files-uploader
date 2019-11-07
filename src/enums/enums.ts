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
  Server = 'server',
  Network = 'network'
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
