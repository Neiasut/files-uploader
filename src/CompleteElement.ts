import {
  CompleteComponent,
  CompleteComponentProps,
  CompleteWrapper,
  CompleteWrapperProps,
  ComponentFactory,
  FilesUploaderAvailableStatusesComplete,
  FilesUploaderSendData,
  SubComponentInfo
} from './interfaces/interfaces';
import { FilesUploaderErrorType, FilesUploaderStatus, FilesUploaderTypeFile } from './enums/enums';
import ComponentPerformer from './ComponentPerformer';
import { addHeaders, getFilesUploaderErrorInfo, transformObjectToSendData } from './functions/functions';
import { createWrapperElement } from './functions/constructors';
import FilesUploaderErrorNetwork from './errors/FilesUploaderErrorNetwork';

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

  delete(
    pathRemove: string,
    headers?: { [key: string]: string },
    onData?: (data: FilesUploaderSendData) => FilesUploaderSendData
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const path = this.props.data.path;
      this.setStatus(FilesUploaderStatus.Removing);
      const xhr = new XMLHttpRequest();
      xhr.open('DELETE', pathRemove, true);
      xhr.responseType = 'json';
      addHeaders(xhr, headers);
      const info = transformObjectToSendData({ path }, onData);
      xhr.onload = () => {
        if (xhr.status !== 204) {
          this.setError([FilesUploaderErrorType.Remove]);
          reject(new FilesUploaderErrorNetwork('Server error', [FilesUploaderErrorType.Remove], xhr));
        } else {
          resolve(xhr.response);
        }
      };
      xhr.onerror = () => {
        this.setError([FilesUploaderErrorType.Network]);
        reject(new FilesUploaderErrorNetwork('NetworkError', [FilesUploaderErrorType.Network], xhr));
      };
      xhr.send(JSON.stringify(info));
    });
  }

  getChildren(): CompleteComponent {
    return ComponentPerformer.getChildComponent(this, ComponentPerformer.childrenKey) as CompleteComponent;
  }
}

export const factoryCompleteElement: ComponentFactory<CompleteWrapperProps, CompleteElement> = props => {
  return new CompleteElement(props);
};
