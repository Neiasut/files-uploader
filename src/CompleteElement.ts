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
import { createWrapperElement } from './functions/constructors';

export class CompleteElement implements CompleteWrapper {
  id: string;
  props: CompleteWrapperProps;
  status: FilesUploaderAvailableStatusesComplete;
  errorTypes: FilesUploaderErrorType[] = [];
  removeRequest;

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
    this.getChildren().setError(errors, this.props.getErrorTexts(errors));
  }

  setStatus(status: FilesUploaderAvailableStatusesComplete): void {
    ComponentPerformer.getRenderRoot(this).setAttribute('data-file-status', status);
    this.status = status;
    if (status !== FilesUploaderStatus.Error) {
      this.errorTypes = [];
    }
    this.getChildren().setStatus(status, this.props.getStatusText(status));
  }

  subComponents(): SubComponentInfo[] {
    const childrenProps: CompleteComponentProps = {
      imageElement: this.props.imageElement,
      data: this.props.data,
      remove: this.props.remove,
      buttonConstructor: this.props.buttonConstructor
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

  getChildren(): CompleteComponent {
    return ComponentPerformer.getChildComponent(this, ComponentPerformer.childrenKey) as CompleteComponent;
  }
}

export const factoryCompleteElement: ComponentFactory<CompleteWrapperProps, CompleteElement> = props => {
  return new CompleteElement(props);
};
