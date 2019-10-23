import Themes from './Themes';
import { mockInstanceFilesUploader } from './__mock__/structures';

const defaultInit = () => new Themes();

test('add', () => {
  const instance = defaultInit();
  instance.add('test', {
    afterConstructor: () => 0,
    settings: {
      imageView: true
    }
  });
  const theme = instance.get('test');
  expect(typeof theme.afterConstructor === 'function').toBeTruthy();
  expect(theme.settings.imageView).toBeTruthy();
  expect(() => {
    instance.add('test', {});
  }).toThrow(Error);
});

test('get', () => {
  const instance = defaultInit();
  instance.add('test', {});
  instance.add('test2', {});
  expect(instance.get('test')).toBeDefined();
  expect(() => {
    instance.get('test3');
  }).toThrow(Error);
});

test('fireAfterConstructor', () => {
  const instanceFilesUploader = mockInstanceFilesUploader();
  const instance = defaultInit();
  let a = 0;
  instance.add('test', {
    afterConstructor: () => {
      a += 1;
    }
  });
  instance.fireAfterConstructor('test', instanceFilesUploader);
  expect(a).toBe(1);
  instance.fireAfterConstructor('test', instanceFilesUploader);
  instance.fireAfterConstructor('test', instanceFilesUploader);
  expect(a).toBe(3);
});

test('fireAfterConstructorForArrThemes', () => {
  const instanceFilesUploader = mockInstanceFilesUploader();
  const instance = defaultInit();
  let a = 0;
  instance.add('test', {
    afterConstructor: () => {
      a += 1;
    }
  });
  instance.add('test2', {
    afterConstructor: () => {
      a += 3;
    }
  });
  instance.add('test3', {
    settings: {}
  });
  instance.fireAfterConstructorForArrThemes(['test', 'test2'], instanceFilesUploader);
  expect(a).toBe(4);
  instance.fireAfterConstructorForArrThemes(['test'], instanceFilesUploader);
  expect(a).toBe(5);
  instance.fireAfterConstructorForArrThemes(['test2'], instanceFilesUploader);
  expect(a).toBe(8);
  instance.fireAfterConstructorForArrThemes(['test3'], instanceFilesUploader);
  expect(a).toBe(8);
});

test('getConfigurationForArrThemes', () => {
  const instance = defaultInit();
  instance.add('test', {
    settings: {
      imageView: true
    }
  });
  instance.add('test2', {
    settings: {
      imageView: false
    }
  });
  instance.add('test3', {
    settings: {
      maxSize: 4
    }
  });
  instance.add('test4', {});
  const settings = instance.getConfigurationForArrThemes(['test', 'test2', 'test3', 'test4']);
  expect(settings.imageView).toBeFalsy();
  expect(settings.maxSize).toBe(4);
  expect(settings.autoUpload).not.toBeDefined();
});
