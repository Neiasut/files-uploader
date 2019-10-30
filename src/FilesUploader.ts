import './styles/FilesUploader.scss';
import {
  getFilesUploaderFileInfoFromInstanceFile,
  getQueryElement,
  mergeDeepConfig,
  setInput,
  validateFileExtension,
  validateFileSize
} from './functions/functions';
import { createListElements, createListWrapper, createLoader } from './functions/constructors';
import {
  FilesUploaderAddFileEvent,
  FilesUploaderAddFileToQueueEvent,
  FilesUploaderFileData,
  FilesUploaderListElements,
  FilesUploaderSettings
} from './interfaces/interfaces';
import { FilesUploaderErrorType, FilesUploaderStatus, FilesUploaderTypeFile } from './enums/enums';
import UploadingElement from './UploadingElement';
import Queue from './Queue';
import CompleteList from './CompleteList';
import CompleteElement from './CompleteElement';
import EventDispatcher, { Handler } from './EventDispatcher';
import Themes from './Themes';
import { factoryDefaultUploadingComponent } from './DefaultUploadingComponent';
import { factoryDefaultCompleteComponent } from './DefaultCompleteComponent';

export default class FilesUploader {
  elements: FilesUploaderListElements;
  settings: FilesUploaderSettings;
  configuration: FilesUploaderSettings;
  private queue = new Queue();
  files = new CompleteList();
  private counterLoadFiles = 0;

  constructor(
    query: string | HTMLInputElement,
    settings?: FilesUploaderSettings,
    themes?: string[],
    files?: FilesUploaderFileData[]
  ) {
    const input = getQueryElement(query);
    if (input === false) {
      throw new Error(`Parameter "query" is not valid!`);
    }
    const themesUse = Array.isArray(themes) ? themes : [];
    this.settings = settings;
    this.setConfiguration(themesUse, settings);
    this.createCarcass(input);
    this.addListeners();
    FilesUploader.themes.fireAfterConstructorForArrThemes(themesUse, this);
    if (Array.isArray(files)) {
      this.addFiles(files);
    }
  }

  static themes = new Themes();
  static get defaultSettings(): FilesUploaderSettings {
    return {
      actionLoad: '/',
      actionRemove: '/',
      acceptTypes: [],
      labels: {
        loader: 'Drag file here or select on device',
        inProcessList: 'List uploading files',
        completeList: 'List files'
      },
      statusTexts: {
        [FilesUploaderStatus.WaitingUpload]: 'Wait Upload',
        [FilesUploaderStatus.Uploading]: 'Uploading files',
        [FilesUploaderStatus.Complete]: 'Complete downloading files',
        [FilesUploaderStatus.Error]: 'Error',
        [FilesUploaderStatus.Removing]: 'Removing'
      },
      errorTexts: {
        [FilesUploaderErrorType.MoreMaxFiles]: 'More max files',
        [FilesUploaderErrorType.Size]: 'More max size file',
        [FilesUploaderErrorType.Type]: 'Not type',
        [FilesUploaderErrorType.Server]: 'Server error'
      },
      maxFiles: 3,
      maxSize: 10 * 1024 * 1024,
      maxParallelUploads: 3,
      autoUpload: false,
      factoryUploadingComponent: factoryDefaultUploadingComponent,
      factoryCompleteComponent: factoryDefaultCompleteComponent,
      imageView: false,
      headersLoad: {},
      headersRemove: {},
      externalDataLoad: {},
      externalDataRemove: {}
    };
  }

  private createCarcass(input: HTMLInputElement) {
    const { labels, maxFiles, acceptTypes, maxSize } = this.configuration;
    const wrapper = document.createElement('div');
    wrapper.classList.add('FilesUploader');
    setInput(input, maxFiles, acceptTypes, maxSize);
    const loader = createLoader(labels.loader);
    loader.classList.add('FilesUploader-FilesUploaderLoader');
    wrapper.appendChild(loader);
    const wrapperLists = document.createElement('div');
    wrapperLists.classList.add('FilesUploader-WrapperLists');
    const uploadingList = createListElements(FilesUploaderTypeFile.Uploading);
    const completeList = createListElements(FilesUploaderTypeFile.Complete);
    const uploadingListWrapper = createListWrapper(FilesUploaderTypeFile.Uploading, labels.inProcessList);
    uploadingListWrapper.appendChild(uploadingList);
    const completeListWrapper = createListWrapper(FilesUploaderTypeFile.Complete, labels.completeList);
    completeListWrapper.appendChild(completeList);
    wrapperLists.appendChild(uploadingListWrapper);
    wrapperLists.appendChild(completeListWrapper);
    wrapper.appendChild(wrapperLists);
    input.parentNode.insertBefore(wrapper, input.nextSibling);
    loader.appendChild(input);
    this.elements = {
      input,
      wrapper,
      wrapperLists,
      loader,
      uploadingList,
      completeList,
      uploadingListWrapper,
      completeListWrapper
    };
  }

  private setConfiguration(themes: string[], settings?: FilesUploaderSettings) {
    if (typeof settings !== 'object' || settings === null) {
      settings = {};
    }
    const settingsThemes = FilesUploader.themes.getConfigurationForArrThemes(themes);
    this.configuration = mergeDeepConfig({}, FilesUploader.defaultSettings, settingsThemes, settings);
  }

  private addListeners() {
    this.elements.input.addEventListener('change', () => {
      this.onAddFiles();
    });
    this.queue.onDidChangeLength(lengthQueue => {
      const { wrapper } = this.elements;
      if (lengthQueue > 0) {
        wrapper.classList.add('hasUploadingFiles');
      } else {
        wrapper.classList.remove('hasUploadingFiles');
      }
    });
    this.files.onDidChangeLength(lengthFiles => {
      const { wrapper } = this.elements;
      if (lengthFiles > 0) {
        wrapper.classList.add('hasCompleteFiles');
      } else {
        wrapper.classList.remove('hasCompleteFiles');
      }
    });
  }

  private onAddFiles() {
    const { input } = this.elements;
    Array.from(input.files).forEach(file => {
      this.addFileToQueue(file);
    });
    input.value = '';
  }

  private addFileToQueue(file: File) {
    const { maxSize, acceptTypes, maxFiles, factoryUploadingComponent, autoUpload } = this.configuration;
    this.counterLoadFiles += 1;
    const loadingComponent = factoryUploadingComponent(getFilesUploaderFileInfoFromInstanceFile(file));
    loadingComponent.onDidCallUpload(() => {
      this.uploadFile(element);
    });
    loadingComponent.onDidCallCancel(() => {
      this.removeQueueFile(element);
    });
    const element = new UploadingElement(this.elements.uploadingList, this.counterLoadFiles, file, loadingComponent);
    this.queue.add(element);
    const errorTypes: FilesUploaderErrorType[] = [];
    if (!validateFileSize(file, maxSize)) {
      errorTypes.push(FilesUploaderErrorType.Size);
    }
    if (!validateFileExtension(file, acceptTypes)) {
      errorTypes.push(FilesUploaderErrorType.Type);
    }
    if (this.files.length + this.queue.countUploadingFiles >= maxFiles) {
      errorTypes.push(FilesUploaderErrorType.MoreMaxFiles);
    }
    if (errorTypes.length > 0) {
      this.setErrorToElementQueue(element, errorTypes);
    }
    this.fireDidAddFileToQueue({
      instance: this
    });
    if (autoUpload && !element.error) {
      this.uploadFile(element);
    }
  }

  private setErrorToElementQueue(element: UploadingElement, errors: FilesUploaderErrorType[]) {
    element.setError(errors, this.configuration.errorTexts);
  }

  private uploadFile(element: UploadingElement) {
    const { actionLoad, headersLoad, externalDataLoad } = this.configuration;
    if (!element.error) {
      element.setStatus(FilesUploaderStatus.Uploading);
      element
        .upload(actionLoad, headersLoad, externalDataLoad)
        .then(dataResponse => {
          this.removeQueueFile(element);
          this.addFile(dataResponse);
        })
        .catch((reasons: FilesUploaderErrorType[]) => {
          this.setErrorToElementQueue(element, reasons);
        });
    }
  }

  private removeQueueFile(element: UploadingElement) {
    element.abort();
    element.destroy();
    this.queue.remove(element.numb);
  }

  addFile(data: FilesUploaderFileData) {
    const { actionRemove, headersRemove, externalDataRemove, factoryCompleteComponent, imageView } = this.configuration;
    const info = this.files.add(data);
    const fileCompleteComponent = factoryCompleteComponent(info, imageView);
    const fileInstance = new CompleteElement(data.path, this.elements.completeList, fileCompleteComponent);
    fileCompleteComponent.onDidCallRemove(() => {
      fileInstance
        .delete(actionRemove, headersRemove, externalDataRemove)
        .then(() => {
          fileInstance.destroy();
          this.files.remove(info.id);
        })
        .catch(() => {
          fileInstance.setError([FilesUploaderErrorType.Server], this.configuration.errorTexts);
        });
    });
    this.fireDidAddFile({
      instance: this
    });
  }

  private didAddFileToQueueDispatcher = new EventDispatcher<FilesUploaderAddFileToQueueEvent>();
  onDidAddFileToQueue(handler: Handler<FilesUploaderAddFileToQueueEvent>) {
    this.didAddFileToQueueDispatcher.register(handler);
  }
  private fireDidAddFileToQueue(event: FilesUploaderAddFileToQueueEvent) {
    this.didAddFileToQueueDispatcher.fire(event);
  }

  private didAddFileDispatcher = new EventDispatcher<FilesUploaderAddFileEvent>();
  onDidAddFile(handler: Handler<FilesUploaderAddFileEvent>) {
    this.didAddFileDispatcher.register(handler);
  }
  private fireDidAddFile(event: FilesUploaderAddFileEvent) {
    this.didAddFileDispatcher.fire(event);
  }

  addFiles(arrFiles: FilesUploaderFileData[]) {
    arrFiles.forEach(file => {
      this.addFile(file);
    });
  }
}
