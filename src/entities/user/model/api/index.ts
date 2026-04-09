
import { apiUserClient } from "shared/config";
import { apiClientGo } from "shared/config/go_axios";
import {
  UserListItem,
  CurrentUser,
  EmployeeDetails,
  PatchCurrentUserBody,
  ChangePasswordBody,
} from "../types";

export const getUsersList = async (): Promise<UserListItem[]> => {
  const { data } = await apiUserClient.get(`employees/select`, {
    timeout: 30000,
  });
  return data;
};

export const syncUsers = async (users: UserListItem[]): Promise<void> => {
  // Используем абсолютный путь для users/sync (без v1)
  await apiClientGo.post(
    'https://uadmin.kstu.kg/task/api/users/sync'
  //  'http://localhost:8080/task/api/users/sync'
    , users);
};

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const { data } = await apiUserClient.get(`users/me`);
  return data;
};

export const patchCurrentUser = async (
  body: PatchCurrentUserBody
): Promise<CurrentUser> => {
  const { data } = await apiUserClient.patch<CurrentUser>(`users/me`, body);
  return data;
};

export const changePassword = async (
  body: ChangePasswordBody
): Promise<void> => {
  await apiUserClient.post(`users/me/password`, body);
};

export const getEmployeeDetails = async (userId: string): Promise<EmployeeDetails> => {
  const { data } = await apiUserClient.get(`employees/${userId}`);
  return data;
};

export const getEmployeeByUserId = async (userId: string): Promise<EmployeeDetails> => {
  const { data } = await apiUserClient.get(`employees/${userId}`);
  return data;
};
