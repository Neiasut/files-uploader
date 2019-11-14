import './styles/FilesUploader.scss';
import {
  getElementImage,
  getQueryElement,
  mergeDeepConfig,
  setInput,
  validateFileExtension,
  validateFileSize
} from './functions/functions';
import { createListElements, createListWrapper, createLoader } from './functions/constructors';
import {
  CompleteWrapper,
  CompleteWrapperProps,
  FilesUploaderAddFileEvent,
  FilesUploaderAddFileToQueueEvent,
  FilesUploaderConfiguration,
  FilesUploaderFileData,
  FilesUploaderListElements,
  FilesUploaderSettings,
  UploadingWrapper,
  UploadingWrapperProps
} from './interfaces/interfaces';
import {
  FilesUploaderDefaultComponentAliases,
  FilesUploaderErrorType,
  FilesUploaderStatus,
  FilesUploaderTypeFile
} from './enums/enums';
import Queue from './Queue';
import EventDispatcher, { Handler } from './EventDispatcher';
import Themes from './Themes';
import ComponentPerformer from './ComponentPerformer';
import { factoryUploadingElement } from './UploadingElement';
import { factoryCompleteElement } from './CompleteElement';
import { factoryDefaultUploadingComponent } from './DefaultUploadingComponent';
import { factoryDefaultCompleteComponent } from './DefaultCompleteComponent';
import FilesUploaderError from './errors/FileUploaderError';

ComponentPerformer.addFactory(FilesUploaderDefaultComponentAliases.UploadingElement, factoryUploadingElement);
ComponentPerformer.addFactory(FilesUploaderDefaultComponentAliases.CompleteElement, factoryCompleteElement);
ComponentPerformer.addFactory(
  FilesUploaderDefaultComponentAliases.DefaultUploadingComponent,
  factoryDefaultUploadingComponent
);
ComponentPerformer.addFactory(
  FilesUploaderDefaultComponentAliases.DefaultCompleteComponent,
  factoryDefaultCompleteComponent
);

export default class FilesUploader {
  elements: FilesUploaderListElements;
  settings: FilesUploaderSettings;
  configuration: FilesUploaderConfiguration;
  private queue: Queue<UploadingWrapper> = new Queue();
  files: Queue<CompleteWrapper> = new Queue();
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
      server: {
        upload: {
          url: '/'
        },
        remove: {
          url: '/'
        }
      },
      acceptTypes: [],
      labels: {
        loader: 'Drag file here or select on device',
        inProcessList: 'List uploading files',
        completeList: 'List files'
      },
      statusTexts: {
        [FilesUploaderStatus.WaitingUpload]: 'Waiting upload',
        [FilesUploaderStatus.Uploading]: 'Uploading file',
        [FilesUploaderStatus.Complete]: 'File on server',
        [FilesUploaderStatus.Error]: 'Error',
        [FilesUploaderStatus.Removing]: 'Removing'
      },
      errorTexts: {
        [FilesUploaderErrorType.MoreMaxFiles]: 'More max files',
        [FilesUploaderErrorType.Size]: 'More max size file',
        [FilesUploaderErrorType.Type]: 'Not type',
        [FilesUploaderErrorType.Network]: 'Network error',
        [FilesUploaderErrorType.Data]: 'Error in data',
        [FilesUploaderErrorType.Remove]: 'Can not remove file',
        [FilesUploaderErrorType.Upload]: 'Can not upload file'
      },
      maxFiles: 3,
      maxSize: 10 * 1024 * 1024,
      maxParallelUploads: 3,
      autoUpload: false,
      factoryUploadingComponentAlias: FilesUploaderDefaultComponentAliases.DefaultUploadingComponent,
      factoryCompleteComponentAlias: FilesUploaderDefaultComponentAliases.DefaultCompleteComponent,
      imageView: false
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
    const {
      maxSize,
      acceptTypes,
      maxFiles,
      factoryUploadingComponentAlias,
      autoUpload,
      statusTexts,
      errorTexts,
      imageView
    } = this.configuration;
    this.counterLoadFiles += 1;
    const imageElement = getElementImage(imageView, null, null, file, null);
    const props: UploadingWrapperProps = {
      file,
      statusTexts,
      errorTexts,
      componentChildFactoryAlias: factoryUploadingComponentAlias,
      imageElement,
      upload: () => {
        this.uploadFile(element, file);
      },
      cancel: () => {
        this.removeQueueFile(element);
      }
    };
    const element = ComponentPerformer.mountComponent(
      this.elements.uploadingList,
      FilesUploaderDefaultComponentAliases.UploadingElement,
      props
    ) as UploadingWrapper;
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
      element.setError(errorTypes);
    }
    this.fireDidAddFileToQueue({
      instance: this
    });
    if (autoUpload && !element.error) {
      this.uploadFile(element, file);
    }
  }

  private uploadFile(element: UploadingWrapper, file?: File) {
    const {
      server: { upload }
    } = this.configuration;
    if (!element.error) {
      element.upload(upload.url, upload.headers, upload.onData).then(dataResponse => {
        this.removeQueueFile(element);
        this.addFile(dataResponse, file);
      });
    }
  }

  private removeQueueFile(element: UploadingWrapper) {
    element.abort();
    this.queue.remove(element.id);
    ComponentPerformer.unmountComponent(element);
  }

  addFile(data: FilesUploaderFileData, file?: File) {
    const { factoryCompleteComponentAlias, imageView, statusTexts, errorTexts } = this.configuration;
    const imageElement = getElementImage(imageView, FilesUploader.imageExtensions, data.extension, file, data.path);
    const props: CompleteWrapperProps = {
      componentChildFactoryAlias: factoryCompleteComponentAlias,
      statusTexts,
      errorTexts,
      file,
      imageElement,
      data,
      remove: async () => {
        await this.removeFile(data.path);
      }
    };
    const element = ComponentPerformer.mountComponent(
      this.elements.completeList,
      FilesUploaderDefaultComponentAliases.CompleteElement,
      props
    ) as CompleteWrapper;
    this.files.add(element);
    this.fireDidAddFile({
      instance: this
    });
  }

  async removeFile(path: string): Promise<any> {
    const {
      server: { remove }
    } = this.configuration;
    const component = this.files.getByFn(comp => {
      return comp.props.data.path === path;
    });
    if (typeof component === 'undefined') {
      throw new FilesUploaderError(`Can't element with path = "${path}"`, [FilesUploaderErrorType.Data]);
    }
    const body = await component.delete(remove.url, remove.headers, remove.onData);
    ComponentPerformer.unmountComponent(component);
    this.files.remove(component.id);
    return body;
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

  static imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
}
