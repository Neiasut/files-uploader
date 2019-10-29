import EventDispatcher from './EventDispatcher';
import { FilesUploaderFileInfo, LoadingFileComponent } from './interfaces/interfaces';
import { filesUploaderComponent } from './functions/decorators';

@filesUploaderComponent
class DefaultUploadingComponent implements LoadingFileComponent {
  buttonUpload: HTMLButtonElement;
  buttonCancel: HTMLButtonElement;
  wrapper: HTMLElement;
  data: FilesUploaderFileInfo;

  onInit(data): void {
    this.data = data;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    this.wrapper = wrapper;
    wrapper.innerHTML = `
      <span class="name">${this.data.name}</span>
      <span class="percentage"></span>
      <span class="errors"></span>
      <span class="actions">
        <button class="upload" type="button">upload</button>
        <button class="cancel" type="button">cancel</button>
      </span>
    `;
    this.buttonUpload = wrapper.querySelector('.upload');
    this.buttonCancel = wrapper.querySelector('.cancel');

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
    this.wrapper.querySelector('.percentage').textContent = `${percent}%`;
  }

  protected handleClickUpload = () => {
    this.fireDidCallUpload();
  };

  protected handleClickCancel = () => {
    this.fireDidCallCancel();
  };
}

export const factoryDefaultUploadingComponent = (data: FilesUploaderFileInfo): DefaultUploadingComponent => {
  const instance = new DefaultUploadingComponent();
  instance.onInit(data);

  return instance;
};
