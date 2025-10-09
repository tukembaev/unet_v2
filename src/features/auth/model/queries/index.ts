import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginRequest } from "../api";
import { toast } from "sonner";
import { User } from "../types";
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
// 🔹 Хук для получения текущего пользователя
export function useAuthUser() {
  return useQuery<User | null>({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      // если в кэше нет — берём из localStorage
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      return JSON.parse(userStr) as User;
    },
    staleTime: Infinity,
    initialData: () => {
      const userStr = localStorage.getItem("user");
      return userStr ? (JSON.parse(userStr) as User) : null;
    },
  });
}
