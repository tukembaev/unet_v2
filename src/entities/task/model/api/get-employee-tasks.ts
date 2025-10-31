import { apiClient } from "shared/config";
import { EmployeeTasksResponse } from "../types";

export const getEmployeeTasks = async (userId: number): Promise<EmployeeTasksResponse> => {
  const { data } = await apiClient.get<EmployeeTasksResponse>(`employee-tasks/${userId}/`);
  return data;
};

