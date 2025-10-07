import {jwtDecode} from "jwt-decode";
import { LoginResponse, User } from "../types";
import { apiClient } from "shared/config";

const API_URL = "https://utask.kstu.kg";

export async function loginRequest(username: string, password: string): Promise<User> {
  const { data } = await apiClient.post<LoginResponse>(`${API_URL}/user/api/v1/users/auth/`, {
    username,
    password,
  });

  const userData = jwtDecode<{ user_data: Omit<User, "token"> }>(data.access).user_data;
  const user = { ...userData, token: data.access };

  localStorage.setItem("token", data.access);
  localStorage.setItem("refresh", data.refresh);
  localStorage.setItem("user", JSON.stringify(user));

  return user;
}
