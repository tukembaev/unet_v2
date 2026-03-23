import { apiClientGo } from "shared/config";
import { TaskDetail, TaskFile } from "../types";

export const getTaskDetails = async (id: string): Promise<TaskDetail> => {
  const { data } = await apiClientGo.get<TaskDetail>(`tasks/${id}`);
  return data;
};

export const getTaskDocuments = async (id: string): Promise<TaskFile[]> => {
  const { data } = await apiClientGo.get<TaskFile[]>(`tasks/${id}/files`);
  return data;
};
