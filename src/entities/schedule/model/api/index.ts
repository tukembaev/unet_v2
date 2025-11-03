import { apiClient } from "shared/config";
import { ISchedule } from "../types";

export const fetchSchedules = async (): Promise<ISchedule> => {
  const { data } = await apiClient.get<ISchedule>("students/schedule/my/");
  return data;
};
