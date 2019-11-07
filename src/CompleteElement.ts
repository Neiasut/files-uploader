import {
  CompleteComponent,
  CompleteComponentProps,
  CompleteWrapper,
  CompleteWrapperProps,
  ComponentFactory,
  FilesUploaderAvailableStatusesComplete,
  SubComponentInfo
} from './interfaces/interfaces';
import { FilesUploaderErrorType, FilesUploaderStatus, FilesUploaderTypeFile } from './enums/enums';
import ComponentPerformer from './ComponentPerformer';
import { addHeaders, getFilesUploaderErrorInfo, transformObjectToSendData } from './functions/functions';
import { createWrapperElement } from './functions/constructors';

export class CompleteElement implements CompleteWrapper {
  id: string;
  props: CompleteWrapperProps;
  status: FilesUploaderAvailableStatusesComplete;
  errorTypes: FilesUploaderErrorType[] = [];

  constructor(props) {
    this.props = props;
  }

  render(): HTMLElement {
    return createWrapperElement(FilesUploaderTypeFile.Complete);
  }

  componentDidMount(): void {
    this.setStatus(FilesUploaderStatus.Complete);
  }

  setError(errors: FilesUploaderErrorType[]): void {
    this.errorTypes = errors;
    this.setStatus(FilesUploaderStatus.Error);
    this.getChildren().setError(errors, getFilesUploaderErrorInfo(errors, this.props.errorTexts));
  }

  setStatus(status: FilesUploaderAvailableStatusesComplete): void {
    ComponentPerformer.getRenderRoot(this).setAttribute('data-file-status', status);
    this.status = status;
    if (status !== FilesUploaderStatus.Error) {
      this.errorTypes = [];
    }
    this.getChildren().setStatus(status, this.props.statusTexts[status]);
  }

  subComponents(): SubComponentInfo[] {
    const childrenProps: CompleteComponentProps = {
      imageElement: this.props.imageElement,
      data: this.props.data,
      remove: this.props.remove
    };
    return [
      {
        key: ComponentPerformer.childrenKey,
        componentAlias: this.props.componentChildFactoryAlias,
        props: childrenProps,
        root: ComponentPerformer.getRenderRoot(this)
      }
    ];
  }

  onDeleteError(error: FilesUploaderErrorType.Server | FilesUploaderErrorType.Network) {
    const errors = [error];
    this.setError(errors);
    return {
      errors,
      filePath: this.props.data.path
    };
  }

  delete(
    pathRemove: string,
    headers: { [key: string]: string },
    externalData: { [key: string]: string }
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.setStatus(FilesUploaderStatus.Removing);
      const xhr = new XMLHttpRequest();
      xhr.open('DELETE', pathRemove, true);
      xhr.responseType = 'json';
      addHeaders(xhr, headers);
      const info = transformObjectToSendData('json', { path: this.props.data.path }, externalData);
      xhr.onload = () => {
        if (xhr.status !== 200) {
          reject(this.onDeleteError(FilesUploaderErrorType.Server));
        } else {
          resolve(xhr.response);
        }
      };
      xhr.onerror = () => {
        this.onDeleteError(FilesUploaderErrorType.Network);
      };
      xhr.send(info);
    });
  }

  getChildren(): CompleteComponent {
    return ComponentPerformer.getChildComponent(this, ComponentPerformer.childrenKey) as CompleteComponent;
  }
}

export const factoryCompleteElement: ComponentFactory<CompleteWrapperProps, CompleteElement> = props => {
  return new CompleteElement(props);
};
