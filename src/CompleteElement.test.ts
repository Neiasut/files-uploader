import { CompleteElement, factoryCompleteElement } from './CompleteElement';
// @ts-ignore
import mock from 'xhr-mock';
import { DefaultCompleteComponent, factoryDefaultCompleteComponent } from './DefaultCompleteComponent';
import { mockDefaultDiv, mockPropsCompleteElement } from './__mock__/structures';
import { FilesUploaderErrorType, FilesUploaderStatus } from './enums/enums';
import ComponentPerformer from './ComponentPerformer';

const COMPONENT_ALIAS = 'completeElement';
const COMPONENT_CHILD_ALIAS = 'childElement';

const mountComponent = props => {
  const div = mockDefaultDiv();
  return ComponentPerformer.mountComponent(div, COMPONENT_ALIAS, props) as CompleteElement;
};

describe('tests completeElement', () => {
  beforeAll(() => {
    ComponentPerformer.addFactory(COMPONENT_ALIAS, factoryCompleteElement);
    ComponentPerformer.addFactory(COMPONENT_CHILD_ALIAS, factoryDefaultCompleteComponent);
  });

  test('init & componentDidMount', () => {
    const props = mockPropsCompleteElement(COMPONENT_CHILD_ALIAS);
    const spyOnComponentDidMount = jest.spyOn(CompleteElement.prototype as any, 'componentDidMount');
    const instance = mountComponent(props);
    expect(ComponentPerformer.getRenderRoot(instance)).toBeInstanceOf(Element);
    expect(spyOnComponentDidMount).toHaveBeenCalled();
    spyOnComponentDidMount.mockRestore();
  });

  test('setStatus', () => {
    const props = mockPropsCompleteElement(COMPONENT_CHILD_ALIAS);
    const instance = mountComponent(props);
    const spyChildSetStatus = jest.spyOn(DefaultCompleteComponent.prototype as any, 'setStatus');
    const childInstance = ComponentPerformer.getChildComponent(
      instance,
      ComponentPerformer.childrenKey
    ) as DefaultCompleteComponent;
    instance.setStatus(FilesUploaderStatus.Complete);
    expect(spyChildSetStatus).toHaveBeenCalled();
    expect(childInstance.status).toBe(FilesUploaderStatus.Complete);
    expect(instance.errorTypes.length).toBe(0);
    spyChildSetStatus.mockRestore();
  });

  test('setError', () => {
    const props = mockPropsCompleteElement(COMPONENT_CHILD_ALIAS);
    const instance = mountComponent(props);
    const spyChildSetError = jest.spyOn(DefaultCompleteComponent.prototype as any, 'setStatus');
    const childInstance = ComponentPerformer.getChildComponent(
      instance,
      ComponentPerformer.childrenKey
    ) as DefaultCompleteComponent;
    instance.setError([FilesUploaderErrorType.Remove]);
    expect(spyChildSetError).toHaveBeenCalled();
    expect(childInstance.status).toBe(FilesUploaderStatus.Error);
    spyChildSetError.mockRestore();
  });

  describe('network tests', () => {
    beforeEach(() => {
      mock.setup();
    });

    afterEach(() => {
      mock.teardown();
    });

    test('success remove request', async () => {
      expect.assertions(1);
      mock.delete('/test', {
        status: 200,
        body: JSON.stringify({ status: 'success' })
      });
      const props = mockPropsCompleteElement(COMPONENT_CHILD_ALIAS);
      const instance = mountComponent(props);
      const data = await instance.delete('/test', {}, {});
      expect(data.status).toBe('success');
    });

    test('error remove request', async () => {
      expect.assertions(2);
      mock.delete('/test', {
        status: 412,
        body: JSON.stringify(null)
      });
      const props = mockPropsCompleteElement(COMPONENT_CHILD_ALIAS);
      const instance = mountComponent(props);
      try {
        await instance.delete('/test', {}, {});
      } catch (e) {
        expect(e.reasons[0]).toBe(FilesUploaderErrorType.Remove);
        expect(e.reasons.length).toBe(1);
      }
    });
  });
});
