import { factoryDefaultCompleteComponent } from './DefaultCompleteComponent';
import { mockDefaultDiv, mockFilesUploaderFileDataElement } from './__mock__/structures';
import { FilesUploaderErrorType, FilesUploaderStatus } from './enums/enums';

test('render', () => {
  const data = mockFilesUploaderFileDataElement();
  const instance = factoryDefaultCompleteComponent(data, false);
  const elementDOM = instance.render();
  expect(elementDOM).toBeInstanceOf(HTMLElement);
});

test('check param imageView', () => {
  const data = mockFilesUploaderFileDataElement();
  const instance = factoryDefaultCompleteComponent(data, false);
  const elementDOM = instance.render();
  expect(elementDOM.querySelector('.imageWrapper')).toBeNull();
  const instance2 = factoryDefaultCompleteComponent(data, true);
  const elementDOM2 = instance2.render();
  expect(elementDOM2.querySelector('.imageWrapper')).toBeInstanceOf(HTMLElement);
});

test('destroy', () => {
  const data = mockFilesUploaderFileDataElement();
  const instance = factoryDefaultCompleteComponent(data, false);
  const div = mockDefaultDiv();
  div.appendChild(instance.render());
  instance.destroy();
  expect(div.childNodes.length).toBe(0);
});

test('handleClickRemove', () => {
  const data = mockFilesUploaderFileDataElement();
  const instance = factoryDefaultCompleteComponent(data, false);
  const render = instance.render();
  const fn = jest.fn();
  instance.onDidCallRemove(fn);
  render.querySelector('button').dispatchEvent(new Event('click'));
  expect(fn).toHaveBeenCalled();
});

test('setError & change status', () => {
  const data = mockFilesUploaderFileDataElement();
  const instance = factoryDefaultCompleteComponent(data, false);
  const render = instance.render();
  instance.setError([
    {
      type: FilesUploaderErrorType.Server,
      text: 'server error'
    },
    {
      type: FilesUploaderErrorType.Type,
      text: 'type error'
    }
  ]);
  const textError = render.querySelector('.textError');
  expect(textError.textContent).toBe('server error, type error');
  instance.setStatus(FilesUploaderStatus.Complete);
  expect(textError.textContent).toBe('');
  expect(render.classList.contains(`status_complete`)).toBeTruthy();
  instance.setStatus(FilesUploaderStatus.Error);
  expect(render.classList.contains(`status_complete`)).toBeFalsy();
  expect(render.classList.contains(`status_error`)).toBeTruthy();
});
