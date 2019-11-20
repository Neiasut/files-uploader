import {
  CompleteComponent,
  CompleteComponentProps,
  ComponentFactory,
  FilesUploaderAvailableStatusesComplete,
  FilesUploaderErrorInfo
} from './interfaces/interfaces';
import { FilesUploaderComponentButtonTypes, FilesUploaderErrorType, FilesUploaderStatus } from './enums/enums';
import ComponentPerformer from './ComponentPerformer';

export class DefaultCompleteComponent implements CompleteComponent {
  props: CompleteComponentProps;
  buttonRemove: HTMLButtonElement;
  textErrorElement: HTMLElement;
  status: FilesUploaderAvailableStatusesComplete;
  statusElement: HTMLElement;

  constructor(props) {
    this.props = props;
  }

  render(): HTMLElement {
    const root = document.createElement('div');
    root.classList.add('FilesUploaderCompleteComponent');
    const { imageElement, buttonConstructor } = this.props;
    if (imageElement) {
      const wrapperImage = document.createElement('div');
      wrapperImage.classList.add('FilesUploaderCompleteComponent-ImageWrapper');
      imageElement.classList.add('FilesUploaderCompleteComponent-Image');
      wrapperImage.appendChild(imageElement);
      root.appendChild(wrapperImage);
    }
    root.innerHTML += `
      <div class="FilesUploaderCompleteComponent-Content">
        <div class="FilesUploaderCompleteComponent-Name">${this.props.data.name}</div>
        <div class="FilesUploaderUploadingComponent-Info">
          <div class="FilesUploaderCompleteComponent-Status"></div>
          <div class="FilesUploaderCompleteComponent-Errors"></div>
        </div>
      </div>
      <span class="FilesUploaderCompleteComponent-Buttons"></span>
    `;
    const buttonRemove = buttonConstructor(FilesUploaderComponentButtonTypes.Remove);
    buttonRemove.classList.add(
      ...[
        'FilesUploaderComponentButton',
        'FilesUploaderCompleteComponent-Button',
        'FilesUploaderCompleteComponent-Button_target_remove'
      ]
    );
    root.querySelector('.FilesUploaderCompleteComponent-Buttons').appendChild(buttonRemove);

    return root;
  }

  setError(errors: FilesUploaderErrorType[], errorTexts?: FilesUploaderErrorInfo[]): void {
    this.textErrorElement.textContent = errorTexts.map(element => element.text).join(', ');
  }

  setStatus(status: FilesUploaderAvailableStatusesComplete, statusText: string): void {
    const root = ComponentPerformer.getRenderRoot(this);
    if (status !== FilesUploaderStatus.Error) {
      this.textErrorElement.textContent = '';
    }
    this.buttonRemove.disabled = status === FilesUploaderStatus.Removing;
    root.classList.remove(`FilesUploaderCompleteComponent_status_${this.status}`);
    root.classList.add(`FilesUploaderCompleteComponent_status_${status}`);
    this.status = status;
    this.statusElement.textContent = statusText;
  }

  componentDidMount(): void {
    const root = ComponentPerformer.getRenderRoot(this);
    this.buttonRemove = root.querySelector('.FilesUploaderCompleteComponent-Button_target_remove');
    this.buttonRemove.addEventListener('click', this.handleClickRemove);
    this.textErrorElement = root.querySelector('.FilesUploaderCompleteComponent-Errors');
    this.statusElement = root.querySelector('.FilesUploaderCompleteComponent-Status');
  }

  componentWillUnmount(): void {
    this.buttonRemove.removeEventListener('click', this.handleClickRemove);
  }

  protected handleClickRemove = () => {
    this.props.remove();
  };
}

export const factoryDefaultCompleteComponent: ComponentFactory<
  CompleteComponentProps,
  DefaultCompleteComponent
> = props => {
  return new DefaultCompleteComponent(props);
};
