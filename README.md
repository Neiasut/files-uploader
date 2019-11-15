# files-uploader

files-uploader is a ts library creates files uploader.

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

### Classic web with script tag
```js
<script src="public/InputPlusMinusWindow.js"></script>
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
Init element has types: string or Element.

## Settings

Interface: FilesUploaderSettings;

| name field | required | default value | type/interface | info |
|------------|----------|---------------|----------------|------|
| server | false | * | FilesUploaderActions | server settings
| maxSize | false | 10 * 1024 * 1024 | number | max size each file
| maxFiles | false | 3 | number | max files for upload
| acceptTypes | false | [] | string[] | array accepted file types
| autoUpload | false | false | boolean | auto upload files
| labels | false | ** | FilesUploaderLabels | labels plugin
| statusTexts | false | *** | FilesUploaderStatusTexts | statuses texts
| errorTexts | false | **** | FilesUploaderErrorTexts | Errors texts
| imageView | false | false | boolean | Variables view images
| factoryUploadingComponentAlias | false | 'defaultUploadingComponent' | string | alias uploading component
| factoryCompleteComponentAlias | false | 'defaultCompleteComponent' | string | alias complete component

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

| name field | default value | type/interface | info |
|------------|---------------|----------------|------|
| upload | { url: '/' } | FilesUploaderActionInfo | uploading settings
| remove | { url: '/' } | FilesUploaderActionInfo | remove settings

### Labels**

| name field | required | default value | type/interface | info |
|------------|----------|---------------|----------------|------|
| loader | false | 'Drag file here or select on device' | string | Text on loader
| inProcessList | false | 'List uploading files' | string | Text on 
| completeList | false | 'completeList' | string | Text on


### Statuses Texts***

| name field | required | default value | type/interface | info |
|------------|----------|---------------|----------------|------|
| waitingUpload | false | 'Waiting upload' | string | 
| uploading | false | 'Uploading file' | string | 
| complete | false | 'File on server' | string | 
| error | false | 'Error' | string | 
| removing | false | 'Removing' | string | 

### Errors Texts****

| name field | required | default value | type/interface | info |
|------------|----------|---------------|----------------|------|
| moreMaxFiles | false | 'More max files' | string | 
| size | false | 'More max size file' | string | 
| type | false | 'Not type' | string | 
| network | false | 'Network error' | string | 
| data | false | 'Error in data' | string | 
| remove | false | 'Can not remove file' | string | 
| upload | false | 'Can not upload file' | string | 

## Themes

Add theme

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

Use theme:

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

Add files in constructor

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
Add file. Trigger DidAddFile.

#### addFiles(arrFiles: FilesUploaderFileData[]): void
Add array files

#### removeFile(path: string): Promise<any>
Remove file from server

## Callbacks

```typescript
type Handler<T> = (event: T) => void;
```

#### onDidAddFileToQueue
```typescript
onDidAddFileToQueue(handler: Handler<FilesUploaderAddFileToQueueEvent>)

interface FilesUploaderAddFileToQueueEvent {
  instance: FilesUploader;
}
```
#### onDidAddFile
```typescript
onDidAddFile(handler: Handler<FilesUploaderAddFileEvent>)

interface FilesUploaderAddFileEvent {
  instance: FilesUploader;
}
```

## Work with server

