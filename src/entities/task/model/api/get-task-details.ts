import { apiClientGo } from "shared/config";
import { TaskDetail } from "../types";

export const getTaskDetails = async (id: string): Promise<TaskDetail> => {
  const { data } = await apiClientGo.get<TaskDetail>(`tasks/${id}`);
  return data;
};

