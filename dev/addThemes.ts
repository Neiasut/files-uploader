import FilesUploader from '../src/FilesUploader';

FilesUploader.themes.add('testSettings', {
  settings: {
    acceptTypes: ['exe', 'jpg'],
    maxSize: 6 * 1204 * 1024,
    autoUpload: false,
    server: {
      upload: {
        url: 'http://files-uploader-back/upload.php'
      },
      remove: {
        url: 'http://files-uploader-back/remove.php'
      }
    }
  }
});

FilesUploader.themes.add('test', {
  afterConstructor(instanceTheme) {
    instanceTheme.onDidAddFileToQueue(() => {
      console.log('theme test on add file to queue!');
    });
    console.log('theme 1');
  }
});

FilesUploader.themes.add('test2', {
  afterConstructor(instanceTheme) {
    instanceTheme.onDidAddFileToQueue(() => {
      console.log('theme test2 on add file to queue!');
    });
    console.log('theme 2');
  }
});

FilesUploader.themes.add('errorUpload', {
  settings: {
    acceptTypes: ['exe', 'jpg'],
    maxSize: 6 * 1204 * 1024,
    autoUpload: true,
    server: {
      upload: {
        url: 'http://files-uploader-back/upload_error.php'
      },
      remove: {
        url: 'http://files-uploader-back/remove.php'
      }
    }
  }
});
