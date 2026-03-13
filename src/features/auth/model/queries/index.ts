import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { loginRequest } from "../api";
// Ключ для react-query кэша
const USER_QUERY_KEY = ["authUser"];
// 🔹 Хук для авторизации
export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      loginRequest(username, password),
    onSuccess: (user) => {
      queryClient.setQueryData(USER_QUERY_KEY, user);
    },

    onError: (error: any) => {
      console.error("❌ Login error:", error);
      toast.error("Ошибка входа в систему", { description: error?.response?.data?.detail || "Пожалуйста, попробуйте заново." });
    },
  });
}
