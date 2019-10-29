import { FilesUploaderFileDataElement, CompleteFileComponent, FilesUploaderErrorInfo } from './interfaces/interfaces';
import EventDispatcher from './EventDispatcher';
import { FilesUploaderStatus } from './enums/enums';
import { filesUploaderComponent } from './functions/decorators';

@filesUploaderComponent
class DefaultCompleteComponent implements CompleteFileComponent {
  buttonRemove: HTMLButtonElement;
  textError: HTMLElement;
  wrapper: HTMLElement;
  data: FilesUploaderFileDataElement;
  imageView: boolean;
  status: FilesUploaderStatus;

  onInit(data: FilesUploaderFileDataElement, imageView: boolean): void {
    this.data = data;
    this.imageView = imageView;
  }

  render(): HTMLElement {
    const root = document.createElement('div');
    root.innerHTML = `
      ${
        this.imageView
          ? `<span class="imageWrapper"><img class="image" src="${this.data.path}" alt="download image" /></span>`
          : ''
      }
      <span>${this.data.name}</span>
      <span class="textError"></span>
      <span><button type="button">Remove</button></span>
    `;
    this.buttonRemove = root.querySelector('button');
    this.buttonRemove.addEventListener('click', this.handleClickRemove);
    this.textError = root.querySelector('.textError');
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

  setStatus(status: FilesUploaderStatus): void {
    if (status !== FilesUploaderStatus.Error) {
      this.textError.textContent = '';
    }
    this.wrapper.classList.remove(`status_${this.status}`);
    this.wrapper.classList.add(`status_${status}`);
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
