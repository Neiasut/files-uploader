import { factoryUploadingElement, UploadingElement } from './UploadingElement';
import { mockDefaultDiv, mockPropsUploadingElement } from './__mock__/structures';
// @ts-ignore
import mock from 'xhr-mock';
import { DefaultUploadingComponent, factoryDefaultUploadingComponent } from './DefaultUploadingComponent';
import ComponentPerformer from './ComponentPerformer';
import { FilesUploaderErrorType, FilesUploaderStatus } from './enums/enums';
import { FilesUploaderFileData } from './interfaces/interfaces';

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
    const spyChildSetStatus = jest.spyOn(DefaultUploadingComponent.prototype as any, 'setStatus');
    const instance = mountComponent(props);
    const STATUS = FilesUploaderStatus.Uploading;
    instance.setStatus(STATUS);
    expect(instance.status).toBe(STATUS);
    expect(spyChildSetStatus).toHaveBeenCalled();
    expect(spyChildSetStatus).toHaveBeenCalledWith(STATUS, props.statusTexts[STATUS]);
    spyChildSetStatus.mockRestore();
  });

  test('setError', () => {
    const props = mockPropsUploadingElement(COMPONENT_CHILD_ALIAS);
    const spyChildSetError = jest.spyOn(DefaultUploadingComponent.prototype as any, 'setError');
    const instance = mountComponent(props);
    const ERRORS = [FilesUploaderErrorType.MoreMaxFiles];
    instance.setError(ERRORS);
    expect(instance.status).toBe(FilesUploaderStatus.Error);
    expect(spyChildSetError).toHaveBeenCalled();
    expect(spyChildSetError).toHaveBeenCalledWith(ERRORS, [
      {
        text: props.errorTexts[ERRORS[0]],
        type: ERRORS[0]
      }
    ]);
    expect(instance.error).toBeTruthy();
    spyChildSetError.mockRestore();
  });

  describe('async tests', () => {
    beforeEach(() => {
      mock.setup();
    });

    afterEach(() => {
      mock.teardown();
    });

    test('success upload', async () => {
      expect.assertions(3);
      mock.post('/test', (request, response) => {
        const formData: FormData = request.body();
        const fileRequest = formData.get('file') as File;
        expect(request.header('X-TOTAL-COUNT')).toBe('1');
        expect(formData.get('some_field')).toBe('2');
        const data: FilesUploaderFileData = {
          name: fileRequest.name,
          size: fileRequest.size,
          extension: 'txt',
          path: '/somePath/' + fileRequest.name
        };
        return response.status(200).body(JSON.stringify(data));
      });
      const props = mockPropsUploadingElement(COMPONENT_CHILD_ALIAS);
      const instance = mountComponent(props);
      const dataResponse = await instance.upload(
        '/test',
        {
          'X-TOTAL-COUNT': '1'
        },
        data => {
          data.some_field = '2';
          return data;
        }
      );
      expect(dataResponse.name).toBe(props.file.name);
    });

    test('error upload', async () => {
      expect.assertions(3);
      mock.post('/test', (request, response) => {
        return response.status(412).body(JSON.stringify({}));
      });
      const props = mockPropsUploadingElement(COMPONENT_CHILD_ALIAS);
      const instance = mountComponent(props);
      try {
        await instance.upload('/test');
      } catch (e) {
        expect(Array.isArray(e.reasons)).toBeTruthy();
        expect(e.reasons.length).toBe(1);
        expect(e.reasons[0]).toBe(FilesUploaderErrorType.Upload);
      }
    });

    test('test abort()', () => {
      mock.post(
        '/test',
        (request, response) => {
          return response.status(412).body(JSON.stringify({}));
        },
        3000
      );
      const props = mockPropsUploadingElement(COMPONENT_CHILD_ALIAS);
      const instance = mountComponent(props);
      try {
        instance.upload('/test');
        instance.abort();
      } catch (e) {
        expect(instance.xhr.status).toBe(0);
      }
    });
  });
});
