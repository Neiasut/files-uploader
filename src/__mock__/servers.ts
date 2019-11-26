// @ts-ignore
import mock from 'xhr-mock';
import { FilesUploaderFileData } from '../interfaces/interfaces';

export const mockServerUploadSuccess = () => {
  mock.post('/test', (request, response) => {
    const formData: FormData = request.body();
    const fileRequest = formData.get('file') as File;
    const data: FilesUploaderFileData = {
      name: fileRequest.name,
      size: fileRequest.size,
      path: '/somePath/' + fileRequest.name
    };
    return response.status(200).body(JSON.stringify(data));
  });
};

export const mockServerRemoveSuccess = () => {
  mock.delete('/delete', (request, response) => {
    return response.status(204).body(JSON.stringify({}));
  });
};
