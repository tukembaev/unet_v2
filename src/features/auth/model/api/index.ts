
import { LoginResponse } from "../types";
import { apiClient } from "shared/config";

const API_URL = "https://uadmin.kstu.kg";

export async function loginRequest(
  username: string,
  password: string
): Promise<string> {
  const { data } = await apiClient.post<LoginResponse>(
    `${API_URL}/users/api/v1/users/auth`,
    { username, password }
  );
 
  return data.pin;
}

