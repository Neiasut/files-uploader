import { FilesUploaderComponentButtonTypes, FilesUploaderErrorType, FilesUploaderStatus } from '../enums/enums';
import FilesUploader from '../FilesUploader';
import { ServerRequest } from '../Server';

export interface FilesUploaderListElements {
  input: HTMLInputElement;
  wrapper: Element;
  loader: Element;
  wrapperLists: Element;
  uploadingList: Element;
  completeList: Element;
  uploadingListWrapper: Element;
  completeListWrapper: Element;
}

export interface FilesUploaderLabels {
  loader?: string;
  inProcessList?: string;
  completeList?: string;
}

export interface FilesUploaderSendData {
  [key: string]: string | File;
}

interface FilesUploaderActionInfo {
  url?: string;
  headers?: { [key: string]: string };
  onData?: (data: FilesUploaderSendData) => FilesUploaderSendData;
}

interface FilesUploaderActions {
  upload?: FilesUploaderActionInfo;
  remove?: FilesUploaderActionInfo;
}

export interface FilesUploaderComponentButton {
  inner: string;
  classes?: string[];
  title?: string;
}

export interface FilesUploaderSettings {
  maxSize?: number;
  maxFiles?: number;
  acceptTypes?: string[];
  autoUpload?: boolean;
  factoryUploadingComponentAlias?: string;
  factoryCompleteComponentAlias?: string;
  labels?: FilesUploaderLabels;
  statusTexts?: FilesUploaderStatusTexts;
  errorTexts?: FilesUploaderErrorTexts;
  imageView?: boolean;
  server?: FilesUploaderActions;
  buttons?: FilesUploaderComponentButtons;
}

export interface FilesUploaderConfiguration extends FilesUploaderSettings {
  maxSize: number;
  maxFiles: number;
  acceptTypes: string[];
  autoUpload: boolean;
  factoryUploadingComponentAlias: string;
  factoryCompleteComponentAlias: string;
  labels: FilesUploaderLabels;
  statusTexts: FilesUploaderStatusTexts;
  errorTexts: FilesUploaderErrorTexts;
  imageView: boolean;
  server: FilesUploaderActions;
}

export type FilesUploaderStatusTexts = Partial<Record<FilesUploaderStatus, string>>;
export type FilesUploaderErrorTexts = Partial<Record<FilesUploaderErrorType, string>>;
export type FilesUploaderComponentButtons = Partial<
  Record<FilesUploaderComponentButtonTypes, FilesUploaderComponentButton>
>;

export interface FilesUploaderErrorInfo {
  type: FilesUploaderErrorType;
  text: string;
}

export interface FilesUploaderFileInfo {
  readonly name: string;
  readonly size: number;
}

interface FilesUploaderEvent {
  instance: FilesUploader;
}

export interface FilesUploaderAddFileToQueueEvent extends FilesUploaderEvent {
  file: File;
}

export interface FilesUploaderRemoveFileFromQueueEvent extends FilesUploaderEvent {
  file: File;
}

export interface FilesUploaderAddFileToListEvent extends FilesUploaderEvent {
  data: FilesUploaderFileData;
}

export interface FilesUploaderRemoveFileFromListEvent extends FilesUploaderEvent {
  data: FilesUploaderFileData;
}

export interface FilesUploaderFileUploadEvent extends FilesUploaderEvent {
  file: File;
}

export interface FilesUploaderFileRemoveEvent extends FilesUploaderEvent {
  data: FilesUploaderFileData;
}

export interface FilesUploaderFileData extends FilesUploaderFileInfo {
  path: string;
}

export type FilesUploaderAvailableStatusesComplete =
  | FilesUploaderStatus.Complete
  | FilesUploaderStatus.Error
  | FilesUploaderStatus.Removing;

export type FilesUploaderAvailableStatusesUploading =
  | FilesUploaderStatus.WaitingUpload
  | FilesUploaderStatus.Error
  | FilesUploaderStatus.Uploading;

export interface QueueElement {
  status: FilesUploaderStatus;
  id: string;
}

export interface QueueDidChangeLengthEvent<T extends QueueElement> {
  element: T;
  queueLength: number;
  queueOldLength: number;
}

export interface SubComponentInfo {
  root: Element;
  componentAlias: string;
  key: string;
  props?: any;
}

interface ComponentProtectedFields {
  _inDOM?: boolean;
  _children?: Array<Component<any>>;
  _renderRoot?: Element;
  _key?: string;
}

export interface Component<T> extends ComponentProtectedFields {
  props: T;
  render(): HTMLElement;
  subComponents?(): SubComponentInfo[];
  componentWillUnmount?(): void;
  componentDidMount?(): void;
}

export type ComponentFactory<T, K extends Component<T>> = (props: T) => K;

interface WrapperProps {
  componentChildFactoryAlias: string;
  getStatusText(status: FilesUploaderStatus): string;
  getErrorTexts(errors: FilesUploaderErrorType[]): FilesUploaderErrorInfo[];
  imageElement?: HTMLImageElement;
  buttonConstructor(type: FilesUploaderComponentButtonTypes): HTMLButtonElement;
}

export interface UploadingWrapperProps extends WrapperProps {
  file: File;
  upload(): void;
  cancel(): void;
}

export interface UploadingWrapper extends Component<UploadingWrapperProps>, QueueElement {
  readonly error: boolean;
  percent: number;
  uploadingRequest?: ServerRequest<FilesUploaderFileData>;
  status: FilesUploaderAvailableStatusesUploading;
  setStatus(status: FilesUploaderAvailableStatusesUploading): void;
  setError(errors: FilesUploaderErrorType[]): void;
  changePercent(percent: number): void;
  getChildren(): UploadingComponent;
}

export interface CompleteWrapperProps extends WrapperProps {
  data: FilesUploaderFileData;
  file?: File;
  remove(): void;
}

export interface CompleteWrapper extends Component<CompleteWrapperProps>, QueueElement {
  status: FilesUploaderAvailableStatusesComplete;
  setStatus(status: FilesUploaderAvailableStatusesComplete): void;
  setError(errors: FilesUploaderErrorType[]): void;
  getChildren(): CompleteComponent;
  removeRequest?: ServerRequest<any>;
}

interface ComponentProps {
  imageElement?: HTMLImageElement;
  buttonConstructor(type: FilesUploaderComponentButtonTypes): HTMLButtonElement;
}

export interface UploadingComponentProps extends ComponentProps {
  file: File;
  upload(): void;
  cancel(): void;
}

export interface UploadingComponent extends Component<UploadingComponentProps> {
  setStatus(status: FilesUploaderAvailableStatusesUploading, statusText: string): void;
  setError(errors: FilesUploaderErrorType[], errorTexts: FilesUploaderErrorInfo[]): void;
  onChangePercent(percent: number): void;
}

export interface CompleteComponentProps extends ComponentProps {
  data: FilesUploaderFileData;
  remove(): void;
}

export interface CompleteComponent extends Component<CompleteComponentProps> {
  setStatus(status: FilesUploaderAvailableStatusesComplete, statusText: string): void;
  setError(errors: FilesUploaderErrorType[], errorTexts: FilesUploaderErrorInfo[]): void;
}
