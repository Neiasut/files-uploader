import { factoryDefaultUploadingComponent } from './DefaultUploadingComponent';
import { mockDefaultDiv, mockFilesUploaderFileData } from './__mock__/structures';

test('render', () => {
  const instance = factoryDefaultUploadingComponent(mockFilesUploaderFileData());
  const render = instance.render();
  expect(render).toBeInstanceOf(HTMLElement);
});

test('destroy', () => {
  const div = mockDefaultDiv();
  const instance = factoryDefaultUploadingComponent(mockFilesUploaderFileData());
  div.appendChild(instance.render());
  instance.destroy();
  expect(div.childNodes.length).toBe(0);
});

test('functions', () => {
  const div = mockDefaultDiv();
  const instance = factoryDefaultUploadingComponent(mockFilesUploaderFileData());
  const cbCancel = jest.fn();
  const cbUpload = jest.fn();
  instance.onDidCallCancel(cbCancel);
  instance.onDidCallUpload(cbUpload);
  const render = instance.render();
  render.querySelector('.cancel').dispatchEvent(new Event('click'));
  render.querySelector('.upload').dispatchEvent(new Event('click'));
  expect(cbCancel).toHaveBeenCalled();
  expect(cbUpload).toHaveBeenCalled();
});
