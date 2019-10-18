import './styles/FilesUploader.scss';
import {
  createListElements,
  createListWrapper,
  createLoader,
  defaultFileComponentConstructorFn,
  defaultLoadingComponentConstructorFn,
  mergeDeepConfig,
  setInput,
  validateFileExtension,
  validateFileSize
} from './functions';
import {
  FilesUploaderFileDataElement,
  FilesUploaderListElements,
  FilesUploaderSettings
} from './interfaces/interfaces';
import { FilesUploaderErrorType, FilesUploaderStatus } from './enums/enums';
import LoadingComponent from './LoadingComponent';
import FilesUploaderQueue from './FilesUploaderQueue';
import FilesUploaderCompleteList from './FilesUploaderCompleteList';
import FileComponent from './FileComponent';

export default class FilesUploader {
  elements: FilesUploaderListElements;
  settings: FilesUploaderSettings;
  configuration: FilesUploaderSettings;
  private queue = new FilesUploaderQueue();
  private files = new FilesUploaderCompleteList();
  private counterLoadFiles = 0;
  constructor(query: string, settings?: FilesUploaderSettings) {
    const input = document.querySelector(query);
    this.settings = settings;
    this.setConfiguration(settings);
    this.createCarcass(input as HTMLInputElement);
    this.addListeners();
  }

  static get defaultSettings(): FilesUploaderSettings {
    return {
      actionLoad: '/',
      actionRemove: '/',
      acceptTypes: [],
      labels: {
        Loader: 'Drag file here or select on device',
        InProcessList: 'List files in process',
        CompleteList: 'List complete files'
      },
      statusTexts: {
        WaitUpload: 'Wait Upload',
        Uploading: 'Uploading files',
        Complete: 'Complete downloading files',
        Error: 'test'
      },
      errorTexts: {
        MoreMaxFiles: 'More max files',
        Size: 'More max size file',
        Type: 'Not type',
        Server: 'Server error'
      },
      maxFiles: 3,
      maxSize: 10 * 1024 * 1024,
      maxParallelUploads: 3,
      autoUpload: false,
      loadingComponentConstructorFn: defaultLoadingComponentConstructorFn,
      fileComponentConstructorFn: defaultFileComponentConstructorFn
    };
  }

  private createCarcass(input: HTMLInputElement) {
    const { labels, maxFiles, acceptTypes, maxSize } = this.configuration;
    const wrapper = document.createElement('div');
    wrapper.classList.add('FilesUploader');
    setInput(input, maxFiles, acceptTypes, maxSize);
    const loader = createLoader(labels.Loader);
    loader.classList.add('FilesUploader-FilesUploaderLoader');
    wrapper.appendChild(loader);
    const wrapperLists = document.createElement('div');
    wrapperLists.classList.add('FilesUploader-WrapperLists');
    const inProcessList = createListElements('inProcess');
    const completeList = createListElements('complete');
    const inProcessListWrapper = createListWrapper('inProcess', labels.InProcessList);
    inProcessListWrapper.appendChild(inProcessList);
    const completeListWrapper = createListWrapper('complete', labels.CompleteList);
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

  private setConfiguration(settings?: FilesUploaderSettings) {
    if (typeof settings !== 'object' || settings === null) {
      settings = {};
    }
    this.configuration = mergeDeepConfig({}, FilesUploader.defaultSettings, settings);
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

  addFile(data: FilesUploaderFileDataElement) {
    this.files.add(data);
    const fileInstance = new FileComponent(
      this.elements.completeList,
      data,
      this.configuration.fileComponentConstructorFn,
      () => {
        fileInstance.delete(this.configuration.actionRemove).then(() => {
          fileInstance.destroy();
          this.files.remove(data.path);
        });
      }
    );
  }
}
