
import { apiUserClient } from "shared/config";
import { apiClientGo } from "shared/config/go_axios";
import { UserListItem } from "../types";

export const getUsersList = async (): Promise<UserListItem[]> => {
  const { data } = await apiUserClient.get(`employees/select`);
  return data;
};

export const syncUsers = async (users: UserListItem[]): Promise<void> => {
  // Используем абсолютный путь для users/sync (без v1)
  await apiClientGo.post('http://localhost:8080/api/users/sync', users);
};
