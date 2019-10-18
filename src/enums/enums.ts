export enum FilesUploaderStatus {
  WaitUpload = 'WaitUpload',
  Uploading = 'Uploading',
  Complete = 'Complete',
  Error = 'Error'
}

export enum FilesUploaderErrorType {
  MoreMaxFiles = 'MoreMaxFiles',
  Size = 'Size',
  Type = 'Type',
  Server = 'Server'
}
