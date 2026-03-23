import { apiClientGo } from "shared/config";
import { EmployeeTask } from "../types";


export const getEmployeeTasks = async (): Promise<EmployeeTask[]> => {
  const { data } = await apiClientGo.get<EmployeeTask[]>(`tasks`);
  return data;
};

