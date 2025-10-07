import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api";
export function useLogin() {
  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      loginRequest(username, password),

    onSuccess: (user) => {
      console.log("✅ Login success:", user);
      // Здесь ты можешь:
      // - сделать navigate("/home")
      // - dispatch(setUser(user))
      // - показать уведомление
    },

    onError: (error: any) => {
      console.error("❌ Login error:", error);
    },
  });
}
