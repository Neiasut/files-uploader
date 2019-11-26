import {
  ComponentFactory,
  FilesUploaderAvailableStatusesUploading,
  SubComponentInfo,
  UploadingComponent,
  UploadingComponentProps,
  UploadingWrapper,
  UploadingWrapperProps
} from './interfaces/interfaces';
import { FilesUploaderErrorType, FilesUploaderStatus, FilesUploaderTypeFile } from './enums/enums';
import ComponentPerformer from './ComponentPerformer';
import { createWrapperElement } from './functions/constructors';

export class UploadingElement implements UploadingWrapper {
  id: string;
  props: UploadingWrapperProps;
  status: FilesUploaderAvailableStatusesUploading;
  errorTypes: FilesUploaderErrorType[] = [];
  percent = 0;
  uploadingRequest;

  constructor(props: UploadingWrapperProps) {
    this.props = props;
  }

  render(): HTMLElement {
    return createWrapperElement(FilesUploaderTypeFile.Uploading);
  }

  setError(errors: FilesUploaderErrorType[]): void {
    this.errorTypes = errors;
    this.setStatus(FilesUploaderStatus.Error);
    this.getChildren().setError(errors, this.props.getErrorTexts(errors));
  }

  setStatus(status: FilesUploaderAvailableStatusesUploading): void {
    ComponentPerformer.getRenderRoot(this).setAttribute('data-file-status', status);
    this.status = status;
    if (status !== FilesUploaderStatus.Error) {
      this.errorTypes = [];
    }
    this.getChildren().setStatus(status, this.props.getStatusText(status));
  }

  subComponents(): SubComponentInfo[] {
    const propsChildren: UploadingComponentProps = {
      file: this.props.file,
      imageElement: this.props.imageElement,
      upload: this.props.upload,
      cancel: this.props.cancel,
      buttonConstructor: this.props.buttonConstructor
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

  getChildren(): UploadingComponent {
    return ComponentPerformer.getChildComponent(this, ComponentPerformer.childrenKey) as UploadingComponent;
  }
}

export const factoryUploadingElement: ComponentFactory<UploadingWrapperProps, UploadingElement> = props => {
  return new UploadingElement(props);
};
