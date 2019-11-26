import FilesUploader from './FilesUploader';

(window => {
  if (typeof window !== 'undefined') {
    (window as any).FilesUploader = FilesUploader;
    return;
  }
  throw new Error('no FilesUploader added');
})(window);
