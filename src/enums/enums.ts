export enum FilesUploaderStatus {
  WaitUpload = 'waitUpload',
  Uploading = 'uploading',
  Complete = 'complete',
  Error = 'error'
}

export enum FilesUploaderErrorType {
  MoreMaxFiles = 'moreMaxFiles',
  Size = 'size',
  Type = 'type',
  Server = 'server'
}

export enum FilesUploaderTypeFile {
  Introduced = 'introduced',
  Downloaded = 'downloaded'
}
