import { factoryUploadingElement, UploadingElement } from './UploadingElement';
import { mockDefaultDiv, mockFilesUploaderStatusTexts, mockPropsUploadingElement } from './__mock__/structures';
import { DefaultUploadingComponent, factoryDefaultUploadingComponent } from './DefaultUploadingComponent';
import ComponentPerformer from './ComponentPerformer';
import { FilesUploaderErrorType, FilesUploaderStatus } from './enums/enums';

const COMPONENT_ALIAS = 'component';
const COMPONENT_CHILD_ALIAS = 'child';

const mountComponent = props => {
  const div = mockDefaultDiv();
  return ComponentPerformer.mountComponent(div, COMPONENT_ALIAS, props) as UploadingElement;
};

describe('test UploadingElement', () => {
  beforeAll(() => {
    ComponentPerformer.addFactory(COMPONENT_ALIAS, factoryUploadingElement);
    ComponentPerformer.addFactory(COMPONENT_CHILD_ALIAS, factoryDefaultUploadingComponent);
  });

  test('init & componentDidMount', () => {
    const props = mockPropsUploadingElement(COMPONENT_CHILD_ALIAS);
    const spyOnComponentDidMount = jest.spyOn(UploadingElement.prototype as any, 'componentDidMount');
    const instance = mountComponent(props);
    expect(ComponentPerformer.getRenderRoot(instance)).toBeInstanceOf(Element);
    expect(spyOnComponentDidMount).toHaveBeenCalled();
    expect(instance.status).toBe(FilesUploaderStatus.WaitingUpload);
    spyOnComponentDidMount.mockRestore();
  });

  test('changePercent', () => {
    const props = mockPropsUploadingElement(COMPONENT_CHILD_ALIAS);
    const spyOnChildOnChangePercent = jest.spyOn(DefaultUploadingComponent.prototype as any, 'onChangePercent');
    const instance = mountComponent(props);
    instance.changePercent(50);
    expect(instance.percent).toBe(50);
    expect(spyOnChildOnChangePercent).toHaveBeenCalled();
    spyOnChildOnChangePercent.mockRestore();
  });

  test('setStatus', () => {
    const props = mockPropsUploadingElement(COMPONENT_CHILD_ALIAS);
    const STATUS = FilesUploaderStatus.Uploading;
    props.getStatusText = jest.fn(() => {
      return mockFilesUploaderStatusTexts()[STATUS];
    });
    const spyChildSetStatus = jest.spyOn(DefaultUploadingComponent.prototype as any, 'setStatus');
    const instance = mountComponent(props);
    instance.setStatus(STATUS);
    expect(instance.status).toBe(STATUS);
    expect(spyChildSetStatus).toHaveBeenCalled();
    expect(spyChildSetStatus).toHaveBeenCalledWith(STATUS, mockFilesUploaderStatusTexts()[STATUS]);
    spyChildSetStatus.mockRestore();
  });

  test('setError', () => {
    const props = mockPropsUploadingElement(COMPONENT_CHILD_ALIAS);
    const ERROR = FilesUploaderErrorType.MoreMaxFiles;
    props.getErrorTexts = jest.fn(() => {
      return [
        {
          text: 'some error text',
          type: ERROR
        }
      ];
    });
    const spyChildSetError = jest.spyOn(DefaultUploadingComponent.prototype as any, 'setError');
    const instance = mountComponent(props);
    instance.setError([ERROR]);
    expect(instance.status).toBe(FilesUploaderStatus.Error);
    expect(spyChildSetError).toHaveBeenCalled();
    expect(spyChildSetError).toHaveBeenCalledWith(
      [ERROR],
      [
        {
          text: 'some error text',
          type: ERROR
        }
      ]
    );
    expect(instance.error).toBeTruthy();
    spyChildSetError.mockRestore();
  });
});
