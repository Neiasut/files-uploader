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
    }
  },
  ['testSettings', 'test', 'test2']
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
