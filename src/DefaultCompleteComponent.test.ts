import { DefaultCompleteComponent, factoryDefaultCompleteComponent } from './DefaultCompleteComponent';
import { mockDefaultDiv, mockPropsCompleteComponent } from './__mock__/structures';
import { FilesUploaderErrorType, FilesUploaderStatus } from './enums/enums';
import ComponentPerformer from './ComponentPerformer';

const COMPONENT_ALIAS = 'defaultCompleteComponent';
const mountComponent = props => {
  const div = mockDefaultDiv();
  return ComponentPerformer.mountComponent(div, COMPONENT_ALIAS, props) as DefaultCompleteComponent;
};

test('render', () => {
  const props = mockPropsCompleteComponent();
  const instance = factoryDefaultCompleteComponent(props);
  const elementDOM = instance.render();
  expect(elementDOM).toBeInstanceOf(HTMLElement);
});

describe('with performer', () => {
  beforeAll(() => {
    ComponentPerformer.addFactory(COMPONENT_ALIAS, factoryDefaultCompleteComponent);
  });

  test('check param imageView', () => {
    const props = mockPropsCompleteComponent();
    const instance = mountComponent(props);
    expect(
      ComponentPerformer.getRenderRoot(instance).querySelector('.FilesUploaderCompleteComponent-ImageWrapper')
    ).toBeInstanceOf(Element);
    const props2 = mockPropsCompleteComponent();
    delete props2.imageElement;
    const instance2 = mountComponent(props2);
    expect(
      ComponentPerformer.getRenderRoot(instance2).querySelector('.FilesUploaderCompleteComponent-ImageWrapper')
    ).toBeNull();
  });

  test('run component DidMount and DidUnmount', () => {
    const props = mockPropsCompleteComponent();
    const spyComponentDidMount = jest.spyOn(DefaultCompleteComponent.prototype as any, 'componentDidMount');
    const spyComponentWillUnmount = jest.spyOn(DefaultCompleteComponent.prototype as any, 'componentWillUnmount');
    const instance = mountComponent(props);
    ComponentPerformer.unmountComponent(instance);
    expect(spyComponentDidMount).toHaveBeenCalled();
    expect(spyComponentWillUnmount).toHaveBeenCalled();
    spyComponentDidMount.mockRestore();
    spyComponentWillUnmount.mockRestore();
  });

  test('handleClickRemove', () => {
    const props = mockPropsCompleteComponent();
    const cbRemove = jest.fn();
    props.remove = cbRemove;
    const instance = mountComponent(props);
    instance.buttonRemove.dispatchEvent(new Event('click'));
    expect(cbRemove).toHaveBeenCalled();
  });

  test('setError & change status', () => {
    const props = mockPropsCompleteComponent();
    const instance = mountComponent(props);
    instance.setError(
      [FilesUploaderErrorType.Remove, FilesUploaderErrorType.Type],
      [
        {
          type: FilesUploaderErrorType.Remove,
          text: 'server error'
        },
        {
          type: FilesUploaderErrorType.Type,
          text: 'type error'
        }
      ]
    );
    const root = ComponentPerformer.getRenderRoot(instance);
    expect(instance.textErrorElement.textContent).toBe('server error, type error');
    instance.setStatus(FilesUploaderStatus.Complete, 'complete');
    expect(instance.textErrorElement.textContent).toBe('');
    expect(root.classList.contains(`FilesUploaderCompleteComponent_status_complete`)).toBeTruthy();
    instance.setStatus(FilesUploaderStatus.Error, 'error');
    expect(root.classList.contains(`FilesUploaderCompleteComponent_status_complete`)).toBeFalsy();
    expect(root.classList.contains(`FilesUploaderCompleteComponent_status_error`)).toBeTruthy();
  });
});
