import { apiClient } from "shared/config";
import { TaskDetail } from "../types";

export const getTaskDetails = async (id: number): Promise<TaskDetail> => {
  const { data } = await apiClient.get<TaskDetail>(`tasks/${id}/`);
  return data;
};

