import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api";

export function useLogin() {
  return useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => loginRequest(username, password),
  });
}
