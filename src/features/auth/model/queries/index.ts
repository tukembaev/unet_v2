import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginRequest } from "../api";

const USER_QUERY_KEY = ["authUser"];

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => loginRequest(username, password),

    onSuccess: (user) => {
      queryClient.setQueryData(USER_QUERY_KEY, user);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}
