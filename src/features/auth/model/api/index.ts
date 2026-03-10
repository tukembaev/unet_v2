
import { apiUserClient } from "shared/config";
import { LoginResponse } from "../types";


export async function loginRequest(
  username: string,
  password: string
): Promise<void> {
    await apiUserClient.post<LoginResponse>(
    `users/auth`,
    { username, password }
  );
 
}

