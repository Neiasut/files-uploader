import { DefaultUploadingComponent, factoryDefaultUploadingComponent } from './DefaultUploadingComponent';
import { mockDefaultDiv, mockPropsUploadingComponent } from './__mock__/structures';
import ComponentPerformer from './ComponentPerformer';

test('render', () => {
  const props = mockPropsUploadingComponent();
  const instance = factoryDefaultUploadingComponent(props);
  const render = instance.render();
  expect(render).toBeInstanceOf(HTMLElement);
});

test('functions', () => {
  ComponentPerformer.addFactory('defaultUploadingComponent', factoryDefaultUploadingComponent);
  const div = mockDefaultDiv();
  const props = mockPropsUploadingComponent();
  const cbCancel = jest.fn();
  const cbUpload = jest.fn();
  props.cancel = cbCancel;
  props.upload = cbUpload;
  const instance = ComponentPerformer.mountComponent(
    div,
    'defaultUploadingComponent',
    props
  ) as DefaultUploadingComponent;
  instance.buttonCancel.dispatchEvent(new Event('click'));
  instance.buttonUpload.dispatchEvent(new Event('click'));
  expect(cbCancel).toHaveBeenCalled();
  expect(cbUpload).toHaveBeenCalled();
});
