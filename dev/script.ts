import FilesUploader from '../src/FilesUploader';
import './addThemes';

const instance = new FilesUploader(
  '#example1',
  {
    headersLoad: {
      'X-SOME-HEADER': '234'
    },
    headersRemove: {
      'X-SOME-HEADER': '234'
    },
    externalDataLoad: {
      info: 'someInfo'
    },
    externalDataRemove: {
      info: 'someInfoForRemove'
    },
    imageView: true
  },
  ['testSettings', 'test', 'test2'],
  [
    {
      name: 'test.txt',
      size: 400,
      path: '/test.txt',
      extension: 'txt'
    }
  ]
);

instance.onDidAddFileToQueue(event => {
  console.log('azazaza', event.instance);
});

console.log('test', instance);

const instance2 = new FilesUploader(
  '#exampleImage',
  {
    acceptTypes: ['png', 'jpg'],
    autoUpload: true,
    imageView: true
  },
  ['testSettings']
);

console.log(instance2);

new FilesUploader('#errorField', {}, ['errorUpload']);
