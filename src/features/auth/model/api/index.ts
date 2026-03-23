
import { apiUserClient } from "shared/config";
import { LoginResponse } from "../types";


export async function loginRequest(
  username: string,
  password: string
): Promise<any> {
    let data = await apiUserClient.post<LoginResponse>(
    `users/auth`,
    { username, password }
  );
    localStorage.setItem('user' , JSON.stringify(data.data))
    return data
}

