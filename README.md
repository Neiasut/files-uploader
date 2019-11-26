# files-uploader

files-uploader is a ts library, which creates files uploader. Size: min: 38 kB, gzip: 10.39 kB.

## Setup

### add with:
#### npm
```cmd
npm install files-uploader --save
```
#### yarn
```cmd
yarn add files-uploader
```

### Add with tag script
```html
<link rel="stylesheet" href="dist/filesUploader.min.css">
<script src="dist/filesUploader.min.js"></script>
```
```js
new window.FilesUploader();
```

### ES6 import
```typescript
import FilesUploader from 'FilesUploader';
```

## Usage
```typescript
const instance = new FilesUploader(
  <InitElement>,
  <settings>,
  <arrThemes>,
  <files>
);
```

## InitElement
Initial element should by of 2 types: string or Element.

## Settings

Interface: FilesUploaderSettings;

| field name | required | default value | type/interface | info |
|------------|----------|---------------|----------------|------|
| server | false | * | FilesUploaderActions | server settings
| maxSize | false | 10 * 1024 * 1024 | number | max size of each file
| maxFiles | false | 3 | number | maximum number of files for uploading
| acceptTypes | false | [] | string[] | array of accepted file types
| autoUpload | false | false | boolean | autoload of files
| labels | false | ** | FilesUploaderLabels | labels
| statusTexts | false | *** | FilesUploaderStatusTexts | statuses texts
| errorTexts | false | **** | FilesUploaderErrorTexts | errors texts
| imageView | false | false | boolean | variable for image view
| factoryUploadingComponentAlias | false | 'defaultUploadingComponent' | string | factory alias for uploading component
| factoryCompleteComponentAlias | false | 'defaultCompleteComponent' | string | factory alias for complete component

### Server settings*

```typescript
interface FilesUploaderActions {
  upload?: FilesUploaderActionInfo;
  remove?: FilesUploaderActionInfo;
}

interface FilesUploaderActionInfo {
  url?: string;
  headers?: { [key: string]: string };
  onData?: (data: FilesUploaderSendData) => FilesUploaderSendData;
}

interface FilesUploaderSendData {
  [key: string]: string | File;
}
```

| field name | default value | type/interface | info |
|------------|---------------|----------------|------|
| upload | { url: '/' } | FilesUploaderActionInfo | upload settings
| remove | { url: '/' } | FilesUploaderActionInfo | remove settings

### Labels**

| field name | required | default value | type/interface | info |
|------------|----------|---------------|----------------|------|
| loader | false | 'Drag file here or select on device' | string | text on loader
| inProcessList | false | 'List uploading files' | string | label for uploading files list
| completeList | false | 'completeList' | string | label for completed files list


### Statuses Texts***

| field name | required | default value | type/interface | info |
|------------|----------|---------------|----------------|------|
| waitingUpload | false | 'Waiting upload' | string | waiting status text
| uploading | false | 'Uploading file' | string | uploading status text
| complete | false | 'File on server' | string | completed status text
| error | false | 'Error' | string | error status text
| removing | false | 'Removing' | string | removing status text

### Errors Texts****

| name field | required | default value | type/interface |
|------------|----------|---------------|----------------|
| moreMaxFiles | false | 'max number of files is exceeded' | string | 
| size | false | 'max file size is exceeded' | string | 
| type | false | 'file extension error' | string | 
| network | false | 'network error' | string | 
| data | false | 'data error' | string | 
| remove | false | 'file can not be removed' | string | 
| upload | false | 'file can not be uploaded' | string | 

## Themes

Add a theme

```typescript
import FilesUploader from 'FilesUploader';

interface Theme {
  settings?: FilesUploaderSettings;
  afterConstructor?: (instance: FilesUploader, themeSettings: FilesUploaderSettings) => void;
}

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
```

Use a theme:

```typescript
const instance = new FilesUploader(
  '#exampleImage',
  {
    acceptTypes: ['png', 'jpg'],
    autoUpload: true,
    imageView: true
  },
  ['testSettings']
);
```

## Files

Add files in a constructor

```typescript
const instance2 = new FilesUploader(
  '#exampleImage',
  {},
  [],
  [
    {
      name: 'test.txt',
      size: 400,
      path: '/test.txt',
      extension: 'txt'
    }
  ]
);
```

## Public fields

#### elements: FilesUploaderListElements
```typescript
interface FilesUploaderListElements {
  input: HTMLInputElement;
  wrapper: Element;
  loader: Element;
  wrapperLists: Element;
  uploadingList: Element;
  completeList: Element;
  uploadingListWrapper: Element;
  completeListWrapper: Element;
}
```
#### settings: FilesUploaderSettings
#### configuration: FilesUploaderConfiguration
#### files: Queue<CompleteWrapper>

## Public methods

```typescript
interface FilesUploaderFileInfo {
  readonly name: string;
  readonly size: number;
  readonly extension: string;
}

interface FilesUploaderFileData extends FilesUploaderFileInfo {
  path: string;
  externalData?: object;
}
```

#### addFile(data: FilesUploaderFileData): void
Add a file. Invoke callbacks for FilesUploaderAddFileToQueueEvent.

#### addFiles(arrFiles: FilesUploaderFileData[]): void
Add files array.

#### removeFile(path: string): Promise<any>
Remove a file from the server.

#### destroy() 
Destructor.

## Callbacks(dispatchers)

```typescript
type Handler<T> = (event: T) => void;

enum FilesUploaderEvents {
  DidAddFileToQueue = 'didAddFileToQueue',
  DidRemoveFileFromQueue = 'didRemoveFileFromQueue',
  DidAddFileToCompleteList = 'didAddFileToCompleteList',
  DidRemoveFileFromCompleteList = 'didRemoveFileFromCompleteList',
  DidUploadFile = 'didUploadFile',
  DidRemoveFile = 'didRemoveFile'
}

class EventDispatcher<T> {
    register(handler: Handler<T>) {}
    unregister(handler: Handler<T>){}
}

instance.dispatchers = {
    [FilesUploaderEvents.DidAddFileToQueue]: new EventDispatcher<FilesUploaderAddFileToQueueEvent>(),
    [FilesUploaderEvents.DidRemoveFileFromQueue]: new EventDispatcher<FilesUploaderRemoveFileFromQueueEvent>(),
    [FilesUploaderEvents.DidAddFileToCompleteList]: new EventDispatcher<FilesUploaderAddFileToListEvent>(),
    [FilesUploaderEvents.DidRemoveFileFromCompleteList]: new EventDispatcher<FilesUploaderRemoveFileFromListEvent>(),
    [FilesUploaderEvents.DidUploadFile]: new EventDispatcher<FilesUploaderFileUploadEvent>(),
    [FilesUploaderEvents.DidRemoveFile]: new EventDispatcher<FilesUploaderFileRemoveEvent>()
};
```

## Work with the server

### Upload
send instance FormData to <instance.configuration.server.upload.url> with key file: File.
SUCCESS: response HTTP status code: 200 with data (json): 
```typescript
interface SuccessResponse {
    path: string;
    name: string;
    size: number;
    extension: string;
}
```

### Remove
send json object to <instance.configuration.server.remove.url> with key path.
SUCCESS: response HTTP status code: 204

## Custom components

Create custom component: create an implementation class interface CompleteComponent or UploadingComponent (/src/interfaces/interfaces.ts), create factory for this class.

Examples: /src/DefaultCompleteComponent.ts, /src/DefaultUploadingComponent

Add factory custom component:
```typescript
ComponentPerformer.addFactory('aliasFactory', factoryComponent);
```
