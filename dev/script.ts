import FilesUploader from '../src/FilesUploader';
import './addThemes';

const instance = new FilesUploader(
  '#example1',
  {
    server: {
      upload: {
        headers: {
          'X-SOME-HEADER': '234'
        },
        onData: data => {
          data.info = 'someInfo';
          return data;
        }
      },
      remove: {
        headers: {
          'X-SOME-HEADER': '234'
        },
        onData: data => {
          data.info = 'someInfoForRemove';
          return data;
        }
      }
    },
    imageView: true
  },
  ['testSettings', 'test', 'test2'],
  [
    {
      name: 'test.txt',
      size: 400,
      path: '/test.txt'
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

const instance3 = new FilesUploader('#errorField', {}, ['errorUpload']);
console.log(instance3);
