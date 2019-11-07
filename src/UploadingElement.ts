import {
  ComponentFactory,
  FilesUploaderAvailableStatusesUploading,
  FilesUploaderFileData,
  SubComponentInfo,
  UploadingComponent,
  UploadingComponentProps,
  UploadingWrapper,
  UploadingWrapperProps
} from './interfaces/interfaces';
import { FilesUploaderErrorType, FilesUploaderStatus, FilesUploaderTypeFile } from './enums/enums';
import ComponentPerformer from './ComponentPerformer';
import {
  addHeaders,
  calcPercentage,
  getFilesUploaderErrorInfo,
  transformObjectToSendData
} from './functions/functions';
import { createWrapperElement } from './functions/constructors';

export class UploadingElement implements UploadingWrapper {
  id: string;
  props: UploadingWrapperProps;
  status: FilesUploaderAvailableStatusesUploading;
  errorTypes: FilesUploaderErrorType[] = [];
  percent = 0;
  xhr: XMLHttpRequest | null = null;

  constructor(props: UploadingWrapperProps) {
    this.props = props;
  }

  render(): HTMLElement {
    return createWrapperElement(FilesUploaderTypeFile.Uploading);
  }

  setError(errors: FilesUploaderErrorType[]): void {
    this.errorTypes = errors;
    this.setStatus(FilesUploaderStatus.Error);
    this.getChildren().setError(errors, getFilesUploaderErrorInfo(errors, this.props.errorTexts));
  }

  setStatus(status: FilesUploaderAvailableStatusesUploading): void {
    ComponentPerformer.getRenderRoot(this).setAttribute('data-file-status', status);
    this.status = status;
    if (status !== FilesUploaderStatus.Error) {
      this.errorTypes = [];
    }
    this.getChildren().setStatus(status, this.props.statusTexts[status]);
  }

  subComponents(): SubComponentInfo[] {
    const propsChildren: UploadingComponentProps = {
      file: this.props.file,
      imageElement: this.props.imageElement,
      upload: this.props.upload,
      cancel: this.props.cancel
    };
    return [
      {
        key: ComponentPerformer.childrenKey,
        componentAlias: this.props.componentChildFactoryAlias,
        root: ComponentPerformer.getRenderRoot(this),
        props: propsChildren
      }
    ];
  }

  componentDidMount(): void {
    this.setStatus(FilesUploaderStatus.WaitingUpload);
  }

  get error(): boolean {
    return this.errorTypes.length > 0;
  }

  changePercent(percent: number) {
    this.percent = percent;
    this.getChildren().onChangePercent(percent);
  }

  protected onUploadError(error: FilesUploaderErrorType.Server | FilesUploaderErrorType.Network) {
    const errors = [error];
    this.setError(errors);
    return {
      errors,
      fileName: this.props.file.name
    };
  }

  async upload(path: string, headers: { [key: string]: string }, externalData: { [key: string]: string }) {
    return new Promise<FilesUploaderFileData>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      this.xhr = xhr;
      xhr.open('POST', path, true);
      xhr.responseType = 'json';
      this.setStatus(FilesUploaderStatus.Uploading);
      addHeaders(xhr, headers);
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(this.onUploadError(FilesUploaderErrorType.Server));
        }
      };
      xhr.onerror = () => {
        this.onUploadError(FilesUploaderErrorType.Network);
      };
      xhr.upload.addEventListener(
        'progress',
        e => {
          const percent = calcPercentage(e.loaded, e.total);
          this.changePercent(percent);
        },
        false
      );
      const sendData = transformObjectToSendData(
        'multipartForm',
        {
          file: this.props.file
        },
        externalData
      );
      xhr.send(sendData);
    });
  }

  abort() {
    if (this.xhr instanceof XMLHttpRequest) {
      this.xhr.abort();
    }
  }

  getChildren(): UploadingComponent {
    return ComponentPerformer.getChildComponent(this, ComponentPerformer.childrenKey) as UploadingComponent;
  }
}

export const factoryUploadingElement: ComponentFactory<UploadingWrapperProps, UploadingElement> = props => {
  return new UploadingElement(props);
};
