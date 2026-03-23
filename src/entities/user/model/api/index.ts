
import { apiUserClient } from "shared/config";
import { apiClientGo } from "shared/config/go_axios";
import { UserListItem, CurrentUser, EmployeeDetails } from "../types";

export const getUsersList = async (): Promise<UserListItem[]> => {
  const { data } = await apiUserClient.get(`employees/select`);
  return data;
};

export const syncUsers = async (users: UserListItem[]): Promise<void> => {
  // Используем абсолютный путь для users/sync (без v1)
  await apiClientGo.post('http://localhost:8080/api/users/sync', users);
};

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const { data } = await apiUserClient.get(`users/me`);
  return data;
};

export const getEmployeeDetails = async (userId: string): Promise<EmployeeDetails> => {
  const { data } = await apiUserClient.get(`employees/${userId}`);
  return data;
};
