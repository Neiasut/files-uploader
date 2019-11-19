import { FilesUploaderFileData, FilesUploaderSendData } from './interfaces/interfaces';
import { FilesUploaderErrorType } from './enums/enums';
import { addHeaders, transformObjectToSendData, transformSendDataToFormData } from './functions/functions';
import FilesUploaderErrorNetwork from './errors/FilesUploaderErrorNetwork';

export interface ServerRequest<T> {
  xhr: XMLHttpRequest | null;
  send(): Promise<T>;
}

export class Server {
  static upload(
    url: string,
    file: File,
    headers?: { [key: string]: string },
    onData?: (data: FilesUploaderSendData) => FilesUploaderSendData
  ): ServerRequest<FilesUploaderFileData> {
    const xhr = new XMLHttpRequest();
    return {
      xhr,
      send: () =>
        new Promise((resolve, reject) => {
          xhr.open('POST', url, true);
          xhr.responseType = 'json';
          addHeaders(xhr, headers);
          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve(xhr.response);
            } else {
              reject(new FilesUploaderErrorNetwork('Error upload', [FilesUploaderErrorType.Upload], xhr));
            }
          };
          xhr.onerror = () => {
            reject(new FilesUploaderErrorNetwork('Error upload', [FilesUploaderErrorType.Network], xhr));
          };
          const sendData = transformObjectToSendData(
            {
              file
            },
            onData
          );
          const form = transformSendDataToFormData(sendData);
          xhr.send(form);
        })
    };
  }

  static remove(
    url: string,
    pathFile: string,
    headers?: { [key: string]: string },
    onData?: (data: FilesUploaderSendData) => FilesUploaderSendData
  ): ServerRequest<any> {
    const xhr = new XMLHttpRequest();
    return {
      xhr,
      send: () =>
        new Promise((resolve, reject) => {
          xhr.open('DELETE', url, true);
          xhr.responseType = 'json';
          addHeaders(xhr, headers);
          const info = transformObjectToSendData({ path: pathFile }, onData);
          xhr.onload = () => {
            if (xhr.status !== 204) {
              reject(new FilesUploaderErrorNetwork('Server error', [FilesUploaderErrorType.Remove], xhr));
            } else {
              resolve(xhr.response);
            }
          };
          xhr.onerror = () => {
            reject(new FilesUploaderErrorNetwork('NetworkError', [FilesUploaderErrorType.Network], xhr));
          };
          xhr.send(JSON.stringify(info));
        })
    };
  }
}
