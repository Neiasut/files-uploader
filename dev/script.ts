import FilesUploader from '../src/FilesUploader';

const instance = new FilesUploader('#example1', {
  acceptTypes: ['exe', 'jpg'],
  maxSize: 6 * 1204 * 1024,
  autoUpload: false,
  actionLoad: 'http://formstone/files_uploader_upload.php',
  // actionLoad: 'http://formstone/files_uploader_upload_error.php',
  actionRemove: 'http://formstone/files_uploader_remove.php'
});

console.log('test', instance);
