
import { LoginResponse } from "../types";
import { apiClient } from "shared/config";

const API_URL = "https://utask.kstu.kg";

export async function loginRequest(
  username: string,
  password: string
): Promise<string> {
  const { data } = await apiClient.post<LoginResponse>(
    `${API_URL}/user/api/v2/users/auth/`,
    { username, password }
  );
  localStorage.setItem("token", data.access);
  localStorage.setItem("refresh", data.refresh);
  localStorage.setItem("pin", data.pin);

  return data.pin;
}

