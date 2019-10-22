import { FilesUploaderSettings } from './interfaces/interfaces';
import FilesUploader from './FilesUploader';
import { mergeDeepConfig } from './functions/functions';

export interface Theme {
  settings?: FilesUploaderSettings;
  afterConstructor?: (instance: FilesUploader, themeSettings: FilesUploaderSettings) => void;
}

export default class Themes {
  private list: Map<string, Theme> = new Map();

  addTheme(nameTheme: string, theme: Theme) {
    if (this.list.has(nameTheme)) {
      throw new Error(`Theme with name "${nameTheme}" already exist!`);
    }
    this.list.set(nameTheme, theme);
  }

  getTheme(nameTheme: string): Theme {
    if (!this.list.has(nameTheme)) {
      throw new Error(`Theme with name "${nameTheme}" does not exist!`);
    }
    return this.list.get(nameTheme);
  }

  fireAfterConstructor(nameTheme: string, instance: FilesUploader) {
    const { afterConstructor, settings } = this.getTheme(nameTheme);
    if (typeof afterConstructor === 'function') {
      afterConstructor(instance, settings);
    }
  }

  fireAfterConstructorForArrThemes(arrNames: string[], instance: FilesUploader) {
    arrNames.forEach(nameTheme => {
      this.fireAfterConstructor(nameTheme, instance);
    });
  }

  getConfigurationForArrThemes(arrNames: string[]): FilesUploaderSettings {
    const arrThemesSettings = arrNames.map(nameTheme => {
      const themeSettings = this.getTheme(nameTheme).settings;
      return themeSettings ? themeSettings : {};
    });
    return mergeDeepConfig({}, ...arrThemesSettings);
  }
}
