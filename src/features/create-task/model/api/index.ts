import { apiClientGo } from 'shared/config/go_axios';
import {
  CreateTaskRequest,
  CreateTaskResponse,
  UploadTaskFileRequest
} from '../types';

export const createTask = async (taskData: CreateTaskRequest): Promise<CreateTaskResponse> => {
  const { data } = await apiClientGo.post<CreateTaskResponse>('tasks', taskData);
  return data;
};

export const uploadTaskFile = async ({ taskId, file, url, extra }: UploadTaskFileRequest): Promise<void> => {
  const formData = new FormData();
  
  if (file) {
    formData.append('file', file);
  }
  
  if (url) {
    formData.append('url', url);
  }
  
  if (extra) {
    formData.append('extra', JSON.stringify(extra));
  }

  await apiClientGo.post(`tasks/${taskId}/files`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
