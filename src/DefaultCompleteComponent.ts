import {
  CompleteFileComponent,
  FilesUploaderAvailableStatusesComplete,
  FilesUploaderErrorInfo,
  FilesUploaderFileDataElement
} from './interfaces/interfaces';
import EventDispatcher from './EventDispatcher';
import { FilesUploaderStatus } from './enums/enums';
import { filesUploaderComponent } from './functions/decorators';
import { createButtonAsString } from './functions/constructors';

@filesUploaderComponent
class DefaultCompleteComponent implements CompleteFileComponent {
  buttonRemove: HTMLButtonElement;
  textError: HTMLElement;
  wrapper: HTMLElement;
  data: FilesUploaderFileDataElement;
  imageView: boolean;
  status: FilesUploaderAvailableStatusesComplete;

  onInit(data: FilesUploaderFileDataElement, imageView: boolean): void {
    this.data = data;
    this.imageView = imageView;
  }

  render(): HTMLElement {
    const root = document.createElement('div');
    root.classList.add('FilesUploaderCompleteComponent');
    root.innerHTML = `
      ${
        this.imageView
          ? `<span class="FilesUploaderCompleteComponent-ImageWrapper"><img class="FilesUploaderCompleteComponent-Image" src="${this.data.path}" alt="download image" /></span>`
          : ''
      }
      <span class="FilesUploaderCompleteComponent-Name">${this.data.name}</span>
      <span class="FilesUploaderCompleteComponent-Errors"></span>
      <span class="FilesUploaderCompleteComponent-Actions">${createButtonAsString('remove', [
        'FilesUploaderComponentButton',
        'FilesUploaderCompleteComponent-Button'
      ])}</span>
    `;
    this.buttonRemove = root.querySelector('button');
    this.buttonRemove.addEventListener('click', this.handleClickRemove);
    this.textError = root.querySelector('.FilesUploaderCompleteComponent-Errors');
    this.wrapper = root;
    return root;
  }

  destroy(): void {
    this.buttonRemove.removeEventListener('click', this.handleClickRemove);
    this.wrapper.remove();
  }

  protected didCallRemoveDispatcher = new EventDispatcher();
  onDidCallRemove(handler: () => void): void {
    this.didCallRemoveDispatcher.register(handler);
  }
  protected fireDidCallRemove() {
    this.didCallRemoveDispatcher.fire();
  }

  protected handleClickRemove = () => {
    this.fireDidCallRemove();
  };

  setError(errorTexts: FilesUploaderErrorInfo[]): void {
    this.textError.textContent = errorTexts.map(element => element.text).join(', ');
  }

  setStatus(status: FilesUploaderAvailableStatusesComplete): void {
    if (status !== FilesUploaderStatus.Error) {
      this.textError.textContent = '';
    }
    this.buttonRemove.disabled = status === FilesUploaderStatus.Removing;
    this.wrapper.classList.remove(`FilesUploaderCompleteComponent_status_${this.status}`);
    this.wrapper.classList.add(`FilesUploaderCompleteComponent_status_${status}`);
    this.status = status;
  }
}

export const factoryDefaultCompleteComponent = (
  data: FilesUploaderFileDataElement,
  imageView: boolean
): DefaultCompleteComponent => {
  const instance = new DefaultCompleteComponent();
  instance.onInit(data, imageView);
  return instance;
};
