import EventDispatcher from './EventDispatcher';
import {
  FilesUploaderAvailableStatusesUploading,
  FilesUploaderErrorInfo,
  FilesUploaderFileInfo,
  UploadingFileComponent
} from './interfaces/interfaces';
import { filesUploaderComponent } from './functions/decorators';
import { createButtonAsString } from './functions/constructors';
import { FilesUploaderStatus } from './enums/enums';

@filesUploaderComponent
class DefaultUploadingComponent implements UploadingFileComponent {
  buttonUpload: HTMLButtonElement;
  buttonCancel: HTMLButtonElement;
  wrapper: HTMLElement;
  data: FilesUploaderFileInfo;
  textError: HTMLElement;
  status: FilesUploaderAvailableStatusesUploading;
  percentageElement: HTMLElement;

  onInit(data): void {
    this.data = data;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    this.wrapper = wrapper;
    this.wrapper.classList.add('FilesUploaderUploadingComponent');
    wrapper.innerHTML = `
      <span class="FilesUploaderUploadingComponent-Name">${this.data.name}</span>
      <span class="FilesUploaderUploadingComponent-Percentage"></span>
      <span class="FilesUploaderUploadingComponent-Errors"></span>
      <span class="FilesUploaderUploadingComponent-Buttons">
        ${createButtonAsString('upload', [
          'FilesUploaderComponentButton',
          'FilesUploaderUploadingComponent-Button',
          'FilesUploaderUploadingComponent-Button_target_upload'
        ])}
        ${createButtonAsString('cancel', [
          'FilesUploaderComponentButton',
          'FilesUploaderUploadingComponent-Button',
          'FilesUploaderUploadingComponent-Button_target_cancel'
        ])}
      </span>
    `;
    this.buttonUpload = wrapper.querySelector('.FilesUploaderUploadingComponent-Button_target_upload');
    this.buttonCancel = wrapper.querySelector('.FilesUploaderUploadingComponent-Button_target_cancel');
    this.textError = wrapper.querySelector('.FilesUploaderUploadingComponent-Errors');
    this.percentageElement = wrapper.querySelector('.FilesUploaderUploadingComponent-Percentage');

    this.buttonCancel.addEventListener('click', this.handleClickCancel);
    this.buttonUpload.addEventListener('click', this.handleClickUpload);

    return wrapper;
  }

  destroy(): void {
    this.buttonCancel.removeEventListener('click', this.handleClickCancel);
    this.buttonUpload.removeEventListener('click', this.handleClickUpload);
    this.wrapper.remove();
  }

  protected didCallUploadDispatcher = new EventDispatcher();
  onDidCallUpload(handler) {
    this.didCallUploadDispatcher.register(handler);
  }
  protected fireDidCallUpload() {
    this.didCallUploadDispatcher.fire();
  }

  protected didCallCancelDispatcher = new EventDispatcher();
  onDidCallCancel(handler) {
    this.didCallCancelDispatcher.register(handler);
  }
  protected fireDidCallCancel() {
    this.didCallCancelDispatcher.fire();
  }

  changePercent(percent: number): void {
    this.percentageElement.textContent = `${percent}%`;
  }

  protected handleClickUpload = () => {
    this.fireDidCallUpload();
  };

  protected handleClickCancel = () => {
    this.fireDidCallCancel();
  };

  setStatus(status: FilesUploaderAvailableStatusesUploading): void {
    if (status !== FilesUploaderStatus.Error) {
      this.textError.textContent = '';
    }
    this.buttonUpload.hidden = status !== FilesUploaderStatus.WaitingUpload;
    this.wrapper.classList.remove(`FilesUploaderUploadingComponent_status_${this.status}`);
    this.wrapper.classList.add(`FilesUploaderUploadingComponent_status_${status}`);
    this.status = status;
  }

  setError(errorTexts: FilesUploaderErrorInfo[]): void {
    this.textError.textContent = errorTexts.map(element => element.text).join(', ');
  }
}

export const factoryDefaultUploadingComponent = (data: FilesUploaderFileInfo): DefaultUploadingComponent => {
  const instance = new DefaultUploadingComponent();
  instance.onInit(data);

  return instance;
};
