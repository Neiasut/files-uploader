import './styles/FilesUploader.scss';
import { createInput, createListElements, createListWrapper, createLoader } from './functions';
import { FilesUploaderListElements, FilesUploaderSettings } from './interfaces/interfaces';

export default class FilesUploader {
  elements: FilesUploaderListElements;
  settings: FilesUploaderSettings;
  configuration: FilesUploaderSettings;
  constructor(query: string, settings?: FilesUploaderSettings) {
    const rootElement = document.querySelector(query);
    this.settings = settings;
    this.setConfiguration(settings);
    this.createCarcass();
    rootElement.appendChild(this.elements.wrapper);
    this.addListeners();
  }

  static get defaultSettings(): FilesUploaderSettings {
    return {
      actionLoad: '/',
      actionRemove: '/',
      acceptTypes: [],
      loaderLabel: 'Drag file here or select on device',
      maxFies: 3,
      maxSize: 10 * 1024 * 1024,
      inputName: 'files'
    };
  }

  private createCarcass() {
    const {
      loaderLabel,
      inputName,
      inProcessListLabel,
      completeListLabel,
      maxFies,
      acceptTypes,
      maxSize
    } = this.configuration;
    const wrapper = document.createElement('div');
    wrapper.classList.add('FilesUploader');
    const input = createInput(inputName, maxFies, acceptTypes, maxSize);
    const loader = createLoader(input, loaderLabel);
    loader.classList.add('FilesUploader-FilesUploaderLoader');
    wrapper.appendChild(loader);
    const wrapperLists = document.createElement('div');
    wrapperLists.classList.add('FilesUploader-WrapperLists');
    const inProcessList = createListElements('inProcess');
    const completeList = createListElements('complete');
    const inProcessListWrapper = createListWrapper('inProcess', inProcessListLabel);
    inProcessListWrapper.appendChild(inProcessList);
    const completeListWrapper = createListWrapper('complete', completeListLabel);
    completeListWrapper.appendChild(completeList);
    wrapperLists.appendChild(inProcessList);
    wrapperLists.appendChild(completeList);
    wrapper.appendChild(wrapperLists);
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

  private setConfiguration(settings: FilesUploaderSettings) {
    this.configuration = Object.assign({}, FilesUploader.defaultSettings, settings);
  }

  private addListeners() {
    this.elements.input.addEventListener('change', (...args) => {
      console.log(args, this.elements.input.files);
    });
  }
}
