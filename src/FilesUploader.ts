import {
  calcPercentage,
  getElementImage,
  getFileExtension,
  getFilesUploaderErrorInfo,
  getQueryElement,
  mergeDeepConfig,
  setInput,
  unsetInput,
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
  FilesUploaderAddFileToListEvent,
  FilesUploaderAddFileToQueueEvent,
  FilesUploaderConfiguration,
  FilesUploaderErrorInfo,
  FilesUploaderFileData,
  FilesUploaderFileRemoveEvent,
  FilesUploaderFileUploadEvent,
  FilesUploaderListElements,
  FilesUploaderRemoveFileFromListEvent,
  FilesUploaderRemoveFileFromQueueEvent,
  FilesUploaderSettings,
  QueueDidChangeLengthEvent,
  UploadingWrapper,
  UploadingWrapperProps
} from './interfaces/interfaces';
import {
  FilesUploaderComponentButtonTypes,
  FilesUploaderDefaultComponentAliases,
  FilesUploaderErrorType,
  FilesUploaderEvents,
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

interface FilesUploaderListener<T> {
  eventType?: string;
  cb: T;
}

interface FilesUploaderListeners {
  inputChange: FilesUploaderListener<() => void>;
  changeLengthQueue: FilesUploaderListener<Handler<QueueDidChangeLengthEvent<UploadingWrapper>>>;
  changeLengthFiles: FilesUploaderListener<Handler<QueueDidChangeLengthEvent<CompleteWrapper>>>;
}

export default class FilesUploader {
  elements: FilesUploaderListElements;
  settings: FilesUploaderSettings;
  configuration: FilesUploaderConfiguration;
  private queue: Queue<UploadingWrapper> = new Queue();
  files: Queue<CompleteWrapper> = new Queue();
  private counterLoadFiles = 0;
  private listeners: FilesUploaderListeners;

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
    const { input } = this.elements;
    const listeners: FilesUploaderListeners = {
      inputChange: {
        eventType: 'change',
        cb: () => {
          const files = Array.from(input.files);
          this.addFilesToQueue(files);
          input.value = '';
        }
      },
      changeLengthQueue: {
        cb: event => {
          const { wrapper } = this.elements;
          if (event.queueLength > 0) {
            wrapper.classList.add('hasUploadingFiles');
          } else {
            wrapper.classList.remove('hasUploadingFiles');
          }
          if (event.queueOldLength < event.queueLength) {
            this.dispatchers[FilesUploaderEvents.DidAddFileToQueue].fire({
              instance: this,
              file: event.element.props.file
            });
          } else {
            this.dispatchers[FilesUploaderEvents.DidRemoveFileFromQueue].fire({
              instance: this,
              file: event.element.props.file
            });
          }
        }
      },
      changeLengthFiles: {
        cb: event => {
          const { wrapper } = this.elements;
          if (event.queueLength > 0) {
            wrapper.classList.add('hasCompleteFiles');
          } else {
            wrapper.classList.remove('hasCompleteFiles');
          }
          if (event.queueOldLength < event.queueLength) {
            this.dispatchers[FilesUploaderEvents.DidAddFileToCompleteList].fire({
              instance: this,
              data: event.element.props.data
            });
          } else {
            this.dispatchers[FilesUploaderEvents.DidRemoveFileFromCompleteList].fire({
              instance: this,
              data: event.element.props.data
            });
          }
        }
      }
    };
    input.addEventListener(listeners.inputChange.eventType, listeners.inputChange.cb);
    this.queue.didChangeLengthDispatcher.register(listeners.changeLengthQueue.cb);
    this.files.didChangeLengthDispatcher.register(listeners.changeLengthFiles.cb);
    this.listeners = listeners;
  }

  private removeListeners() {
    const { input } = this.elements;
    const listeners = this.listeners;
    input.removeEventListener(listeners.inputChange.eventType, listeners.inputChange.cb);
    this.queue.didChangeLengthDispatcher.unregister(listeners.changeLengthQueue.cb);
    this.files.didChangeLengthDispatcher.unregister(listeners.changeLengthFiles.cb);
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
    this.queue.add(element);
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
      this.dispatchers[FilesUploaderEvents.DidUploadFile].fire({
        instance: this,
        file: element.props.file
      });
      this.removeQueueFile(element);
      this.addFile(dataResponse, file);
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
      this.dispatchers[FilesUploaderEvents.DidRemoveFile].fire({
        instance: this,
        data: component.props.data
      });
      this.removeCompleteFileFromQueue(component);
      return body;
    } catch (e) {
      if (e instanceof FilesUploaderError) {
        component.setError(e.reasons);
      }
    }
  }

  private removeCompleteFileFromQueue(component: CompleteWrapper) {
    if (component.removeRequest) {
      component.removeRequest.xhr.abort();
    }
    this.files.remove(component.id);
    ComponentPerformer.unmountComponent(component);
  }

  dispatchers = {
    [FilesUploaderEvents.DidAddFileToQueue]: new EventDispatcher<FilesUploaderAddFileToQueueEvent>(),
    [FilesUploaderEvents.DidRemoveFileFromQueue]: new EventDispatcher<FilesUploaderRemoveFileFromQueueEvent>(),
    [FilesUploaderEvents.DidAddFileToCompleteList]: new EventDispatcher<FilesUploaderAddFileToListEvent>(),
    [FilesUploaderEvents.DidRemoveFileFromCompleteList]: new EventDispatcher<FilesUploaderRemoveFileFromListEvent>(),
    [FilesUploaderEvents.DidUploadFile]: new EventDispatcher<FilesUploaderFileUploadEvent>(),
    [FilesUploaderEvents.DidRemoveFile]: new EventDispatcher<FilesUploaderFileRemoveEvent>()
  };

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

  destroy() {
    this.removeListeners();
    this.queue.fnToAll(queueElement => {
      this.removeQueueFile(queueElement);
    });
    this.files.fnToAll(queueElement => {
      this.removeCompleteFileFromQueue(queueElement);
    });
    this.elements.wrapper.parentNode.insertBefore(this.elements.input, this.elements.wrapper);
    this.elements.wrapper.remove();
    unsetInput(this.elements.input);
  }
}
