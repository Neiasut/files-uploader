import './styles/FilesUploader.scss';
import { mergeDeepConfig, setInput, validateFileExtension, validateFileSize } from './functions/functions';
import {
  createListElements,
  createListWrapper,
  createLoader,
  defaultFileComponentConstructorFn,
  defaultLoadingComponentConstructorFn
} from './functions/constructors';
import {
  FilesUploaderAddFileToQueueEvent,
  FilesUploaderListElements,
  FilesUploaderFileData,
  FilesUploaderSettings
} from './interfaces/interfaces';
import { FilesUploaderErrorType, FilesUploaderStatus, FilesUploaderTypeFile } from './enums/enums';
import LoadingComponent from './LoadingComponent';
import Queue from './Queue';
import CompleteList from './CompleteList';
import FileComponent from './FileComponent';
import EventDispatcher, { Handler } from './EventDispatcher';
import Themes from './Themes';

export default class FilesUploader {
  elements: FilesUploaderListElements;
  settings: FilesUploaderSettings;
  configuration: FilesUploaderSettings;
  private queue = new Queue();
  files = new CompleteList();
  private counterLoadFiles = 0;

  constructor(query: string, settings?: FilesUploaderSettings, themes?: string[]) {
    const input = document.querySelector(query);
    const themesUse = Array.isArray(themes) ? themes : [];
    this.settings = settings;
    this.setConfiguration(themesUse, settings);
    this.createCarcass(input as HTMLInputElement);
    this.addListeners();
    FilesUploader.themes.fireAfterConstructorForArrThemes(themesUse, this);
  }

  static themes = new Themes();
  static get defaultSettings(): FilesUploaderSettings {
    return {
      actionLoad: '/',
      actionRemove: '/',
      acceptTypes: [],
      labels: {
        loader: 'Drag file here or select on device',
        inProcessList: 'List files in process',
        completeList: 'List complete files'
      },
      statusTexts: {
        [FilesUploaderStatus.WaitUpload]: 'Wait Upload',
        [FilesUploaderStatus.Uploading]: 'Uploading files',
        [FilesUploaderStatus.Complete]: 'Complete downloading files',
        [FilesUploaderStatus.Error]: 'test'
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
      loadingComponentConstructorFn: defaultLoadingComponentConstructorFn,
      fileComponentConstructorFn: defaultFileComponentConstructorFn,
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
    const inProcessList = createListElements(FilesUploaderTypeFile.Introduced);
    const completeList = createListElements(FilesUploaderTypeFile.Downloaded);
    const inProcessListWrapper = createListWrapper(FilesUploaderTypeFile.Introduced, labels.inProcessList);
    inProcessListWrapper.appendChild(inProcessList);
    const completeListWrapper = createListWrapper(FilesUploaderTypeFile.Downloaded, labels.completeList);
    completeListWrapper.appendChild(completeList);
    wrapperLists.appendChild(inProcessList);
    wrapperLists.appendChild(completeList);
    wrapper.appendChild(wrapperLists);
    input.parentNode.insertBefore(wrapper, input.nextSibling);
    loader.appendChild(input);
    this.elements = {
      input,
      wrapper,
      wrapperLists,
      loader,
      inProcessList,
      completeList,
      inProcessListWrapper,
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
  }

  private onAddFiles() {
    const { input } = this.elements;
    Array.from(input.files).forEach(file => {
      this.addFileToQueue(file);
    });
    input.value = '';
  }

  private addFileToQueue(file: File) {
    const { maxSize, acceptTypes, maxFiles, loadingComponentConstructorFn, autoUpload } = this.configuration;
    this.counterLoadFiles += 1;

    const element = new LoadingComponent(
      this.elements.inProcessList,
      this.counterLoadFiles,
      file,
      loadingComponentConstructorFn,
      () => {
        this.uploadFile(element);
      },
      () => {
        this.removeQueueFile(element);
      }
    );
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

  private setErrorToElementQueue(element: LoadingComponent, errors: FilesUploaderErrorType[]) {
    element.setError(errors, this.configuration.errorTexts);
  }

  private uploadFile(element: LoadingComponent) {
    const { actionLoad } = this.configuration;
    if (!element.error || element.errorTypes.includes(FilesUploaderErrorType.Server)) {
      element.setStatus(FilesUploaderStatus.Uploading);
      element
        .upload(actionLoad)
        .then(dataResponse => {
          element.setStatus(FilesUploaderStatus.Complete);
          this.removeQueueFile(element);
          this.addFile(dataResponse);
        })
        .catch((reasons: FilesUploaderErrorType[]) => {
          this.setErrorToElementQueue(element, reasons);
        });
    }
  }

  private removeQueueFile(element: LoadingComponent) {
    element.abort();
    element.destroy();
    this.queue.remove(element.numb);
  }

  addFile(data: FilesUploaderFileData) {
    const info = this.files.add(data);
    const fileInstance = new FileComponent(
      this.elements.completeList,
      info,
      this.configuration.fileComponentConstructorFn,
      () => {
        fileInstance
          .delete(this.configuration.actionRemove)
          .then(() => {
            fileInstance.destroy();
            this.files.remove(info.id);
          })
          .catch(() => {
            console.error(`File ${data.path} can't delete`);
          });
      },
      this.configuration.imageView
    );
  }

  private didAddFileToQueueDispatcher = new EventDispatcher<FilesUploaderAddFileToQueueEvent>();
  onDidAddFileToQueue(handler: Handler<FilesUploaderAddFileToQueueEvent>) {
    this.didAddFileToQueueDispatcher.register(handler);
  }
  private fireDidAddFileToQueue(event: FilesUploaderAddFileToQueueEvent) {
    this.didAddFileToQueueDispatcher.fire(event);
  }
}
