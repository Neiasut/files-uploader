import {
  ComponentFactory,
  FilesUploaderAvailableStatusesUploading,
  FilesUploaderErrorInfo,
  UploadingComponent,
  UploadingComponentProps
} from './interfaces/interfaces';
import { FilesUploaderErrorType, FilesUploaderStatus } from './enums/enums';
import { createButtonAsString } from './functions/constructors';
import ComponentPerformer from './ComponentPerformer';

export class DefaultUploadingComponent implements UploadingComponent {
  props: UploadingComponentProps;
  status: FilesUploaderAvailableStatusesUploading;
  errors: FilesUploaderErrorType[];
  buttonUpload: HTMLButtonElement;
  buttonCancel: HTMLButtonElement;
  textErrorElement: HTMLElement;
  percentageElement: HTMLElement;
  statusElement: HTMLElement;

  constructor(props) {
    this.props = props;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('FilesUploaderUploadingComponent');
    const { imageElement } = this.props;
    if (imageElement) {
      const wrapperImage = document.createElement('div');
      wrapperImage.classList.add('FilesUploaderUploadingComponent-ImageWrapper');
      imageElement.classList.add('FilesUploaderUploadingComponent-Image');
      wrapperImage.appendChild(imageElement);
      wrapper.appendChild(wrapperImage);
    }
    wrapper.innerHTML += `
      <div class="FilesUploaderUploadingComponent-Content">
        <div class="FilesUploaderUploadingComponent-Name">${this.props.file.name}</div>
        <div class="FilesUploaderUploadingComponent-Info">
          <div class="FilesUploaderUploadingComponent-Status"></div>
          <div class="FilesUploaderUploadingComponent-Errors"></div>
        </div>
        <span class="FilesUploaderUploadingComponent-Percentage"></span>
      </div>
      <div class="FilesUploaderUploadingComponent-Buttons">
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
      </div>
    `;

    return wrapper;
  }

  protected handleClickUpload = () => {
    this.props.upload();
  };

  protected handleClickCancel = () => {
    this.props.cancel();
  };

  componentDidMount(): void {
    const root = ComponentPerformer.getRenderRoot(this);
    this.buttonUpload = root.querySelector('.FilesUploaderUploadingComponent-Button_target_upload');
    this.buttonCancel = root.querySelector('.FilesUploaderUploadingComponent-Button_target_cancel');
    this.textErrorElement = root.querySelector('.FilesUploaderUploadingComponent-Errors');
    this.percentageElement = root.querySelector('.FilesUploaderUploadingComponent-Percentage');
    this.statusElement = root.querySelector('.FilesUploaderUploadingComponent-Status');

    this.buttonCancel.addEventListener('click', this.handleClickCancel);
    this.buttonUpload.addEventListener('click', this.handleClickUpload);
  }

  componentWillUnmount(): void {
    this.buttonCancel.removeEventListener('click', this.handleClickCancel);
    this.buttonUpload.removeEventListener('click', this.handleClickUpload);
  }

  setError(errors: FilesUploaderErrorType[], errorTexts: FilesUploaderErrorInfo[]): void {
    this.errors = errors;
    this.textErrorElement.textContent = errorTexts.map(element => element.text).join(', ');
  }

  setStatus(status: FilesUploaderAvailableStatusesUploading, statusText: string): void {
    const root = ComponentPerformer.getRenderRoot(this);
    if (status !== FilesUploaderStatus.Error) {
      this.textErrorElement.textContent = '';
    }
    this.buttonUpload.hidden = status !== FilesUploaderStatus.WaitingUpload;
    root.classList.remove(`FilesUploaderUploadingComponent_status_${this.status}`);
    root.classList.add(`FilesUploaderUploadingComponent_status_${status}`);
    this.status = status;
    this.statusElement.textContent = statusText;
  }

  onChangePercent(percent: number): void {
    this.percentageElement.textContent = `${percent} %`;
  }
}

export const factoryDefaultUploadingComponent: ComponentFactory<
  UploadingComponentProps,
  DefaultUploadingComponent
> = props => {
  return new DefaultUploadingComponent(props);
};
