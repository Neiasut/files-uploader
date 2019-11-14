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
  <queryString|Element>,
  <settings>,
  <arrThemes>,
  <files>
);
```

## Settings

| Name field | required | default value | info |
|------------|----------|---------------|------|
| actionLoad | false | '/' | path for uploading files
| actionRemove | false | '/' | path for removing files
| maxSize | false | 10 * 1024 * 1024 | max size in bytes
| maxFiles | false | 3 | max upload files
| acceptTypes | false | [] | accept types
| autoUpload | false | false | auto upload
| factoryUploadingComponentAlias | false | defaultFactory | 
| factoryCompleteComponentAlias | false | defaultFactory |
| labels | false | labels | 
| statusTexts | false | texts |
| errorTexts | false | error texts |
| imageView | false | false |
| headersLoad | false | {} | 
| headersRemove | false | {} | 
| externalDataLoad | false | {} |
| externalDataRemove | false | {} |
