// @ts-ignore
import mock from 'xhr-mock';
import { FilesUploaderFileData } from '../interfaces/interfaces';
import { getFileExtension } from '../functions/functions';

export const mockServerUploadSuccess = () => {
  mock.post('/test', (request, response) => {
    const formData: FormData = request.body();
    const fileRequest = formData.get('file') as File;
    const extension = getFileExtension(fileRequest.name);
    const data: FilesUploaderFileData = {
      name: fileRequest.name,
      size: fileRequest.size,
      extension,
      path: '/somePath/' + fileRequest.name
    };
    return response.status(200).body(JSON.stringify(data));
  });
};

export const mockServerRemoveSuccess = () => {
  mock.delete('/delete', (request, response) => {
    return response.status(200).body(JSON.stringify({}));
  });
};
