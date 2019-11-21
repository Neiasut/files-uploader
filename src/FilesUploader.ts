import {
  calcPercentage,
  getElementImage,
  getFileExtension,
  getFilesUploaderErrorInfo,
  getQueryElement,
  mergeDeepConfig,
  setInput,
  validateFileExtension,
  validateFileSize
} from './functions/functions';
import {
  createDefaultIcon,
  createListElements,
  createListWrapper,
  createLoader,
  createSprite
} from './functions/constructors';
import {
  CompleteWrapper,
  CompleteWrapperProps,
  FilesUploaderAddFileEvent,
  FilesUploaderAddFileToQueueEvent,
  FilesUploaderConfiguration,
  FilesUploaderErrorInfo,
  FilesUploaderFileData,
  FilesUploaderListElements,
  FilesUploaderRemoveFileEvent,
  FilesUploaderSettings,
  FilesUploaderUploadFileEvent,
  UploadingWrapper,
  UploadingWrapperProps
} from './interfaces/interfaces';
import {
  FilesUploaderComponentButtonTypes,
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
import { Server } from './Server';

document.body.appendChild(createSprite());

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

(() => {
  document.body.appendChild(createSprite());
})();

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
      autoUpload: false,
      factoryUploadingComponentAlias: FilesUploaderDefaultComponentAliases.DefaultUploadingComponent,
      factoryCompleteComponentAlias: FilesUploaderDefaultComponentAliases.DefaultCompleteComponent,
      imageView: false,
      buttons: {
        [FilesUploaderComponentButtonTypes.Upload]: {
          inner: createDefaultIcon('upload'),
          title: 'upload'
        },
        [FilesUploaderComponentButtonTypes.Cancel]: {
          inner: createDefaultIcon('cancel'),
          title: 'cancel'
        },
        [FilesUploaderComponentButtonTypes.Remove]: {
          inner: createDefaultIcon('remove'),
          title: 'remove'
        }
      }
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
      const { input } = this.elements;
      const files = Array.from(input.files);
      this.addFilesToQueue(files);
      input.value = '';
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

  private addFilesToQueue(files: File[]) {
    files.forEach(file => {
      const element = this.addFileToQueue(file);
      if (this.configuration.autoUpload && !element.error) {
        this.upload(element);
      }
    });
  }

  private addFileToQueue(file: File): UploadingWrapper {
    const { maxSize, acceptTypes, factoryUploadingComponentAlias, imageView } = this.configuration;
    this.counterLoadFiles += 1;
    const imageElement = getElementImage(imageView, null, null, file, null);
    const props: UploadingWrapperProps = {
      file,
      getStatusText: this.getStatusText,
      getErrorTexts: this.getErrorTexts,
      componentChildFactoryAlias: factoryUploadingComponentAlias,
      imageElement,
      upload: () => {
        this.upload(element);
      },
      cancel: () => {
        this.removeQueueFile(element);
      },
      buttonConstructor: this.createComponentButton
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
    if (errorTypes.length > 0) {
      element.setError(errorTypes);
    }
    this.fireDidAddFileToQueue({
      instance: this,
      file
    });
    return element;
  }

  private async upload(element: UploadingWrapper): Promise<FilesUploaderFileData> {
    const {
      server: { upload },
      maxFiles
    } = this.configuration;
    const file = element.props.file;
    if (this.files.length + this.queue.countUploadingFiles >= maxFiles) {
      element.setError([FilesUploaderErrorType.MoreMaxFiles]);
      return;
    }
    element.setStatus(FilesUploaderStatus.Uploading);
    const request = Server.upload(upload.url, file, upload.headers, upload.onData);
    request.xhr.upload.addEventListener(
      'progress',
      e => {
        const percent = calcPercentage(e.loaded, e.total);
        element.changePercent(percent);
      },
      false
    );
    element.uploadingRequest = request;
    try {
      const dataResponse = await request.send();
      this.removeQueueFile(element);
      this.addFile(dataResponse, file);
      this.fireDidUploadFile({
        instance: this,
        file
      });
      return dataResponse;
    } catch (e) {
      if (e instanceof FilesUploaderError) {
        element.setError(e.reasons);
      }
    }
  }

  private removeQueueFile(element: UploadingWrapper) {
    if (element.uploadingRequest) {
      element.uploadingRequest.xhr.abort();
    }
    this.queue.remove(element.id);
    ComponentPerformer.unmountComponent(element);
  }

  private addFile(data: FilesUploaderFileData, file?: File) {
    const { factoryCompleteComponentAlias, imageView } = this.configuration;
    const imageElement = getElementImage(
      imageView,
      FilesUploader.imageExtensions,
      getFileExtension(data.name),
      file,
      data.path
    );
    const props: CompleteWrapperProps = {
      componentChildFactoryAlias: factoryCompleteComponentAlias,
      getStatusText: this.getStatusText,
      getErrorTexts: this.getErrorTexts,
      file,
      imageElement,
      data,
      buttonConstructor: this.createComponentButton,
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
      instance: this,
      data
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
      throw new FilesUploaderError(`Can't find element with path = "${path}"`, [FilesUploaderErrorType.Data]);
    }
    const request = Server.remove(remove.url, path, remove.headers, remove.onData);
    component.removeRequest = request;
    component.setStatus(FilesUploaderStatus.Removing);
    try {
      const body = await request.send();
      ComponentPerformer.unmountComponent(component);
      this.files.remove(component.id);
      this.fireDidRemoveFile({
        instance: this,
        data: component.props.data
      });
      return body;
    } catch (e) {
      if (e instanceof FilesUploaderError) {
        component.setError(e.reasons);
      }
    }
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

  private didRemoveFileDispatcher = new EventDispatcher<FilesUploaderRemoveFileEvent>();
  onDidRemoveFile(handler: Handler<FilesUploaderRemoveFileEvent>) {
    this.didRemoveFileDispatcher.register(handler);
  }
  private fireDidRemoveFile(event: FilesUploaderRemoveFileEvent) {
    this.didRemoveFileDispatcher.fire(event);
  }

  private didUploadFileDispatcher = new EventDispatcher<FilesUploaderUploadFileEvent>();
  onDidUploadFile(handler: Handler<FilesUploaderUploadFileEvent>) {
    this.didUploadFileDispatcher.register(handler);
  }
  private fireDidUploadFile(event: FilesUploaderUploadFileEvent) {
    this.didUploadFileDispatcher.fire(event);
  }

  addFiles(arrFiles: FilesUploaderFileData[]) {
    arrFiles.forEach(file => {
      this.addFile(file);
    });
  }

  static imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  private getStatusText = (status: FilesUploaderStatus): string => {
    return this.configuration.statusTexts[status];
  };

  private getErrorTexts = (errors: FilesUploaderErrorType[]): FilesUploaderErrorInfo[] => {
    return getFilesUploaderErrorInfo(errors, this.configuration.errorTexts);
  };

  private createComponentButton = (type: FilesUploaderComponentButtonTypes): HTMLButtonElement => {
    const info = this.configuration.buttons[type];
    const button = document.createElement('button');
    button.type = 'button';
    if (Array.isArray(info.classes)) {
      button.classList.add(...info.classes);
    }
    if (typeof info.title === 'string') {
      button.title = info.title;
    }
    button.innerHTML = info.inner;

    return button;
  };
}
