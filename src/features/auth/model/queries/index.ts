import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginRequest } from "../api";
import { toast } from "sonner";
// export function useLogin() {
//   return useMutation({
//     mutationFn: ({ username, password }: { username: string; password: string }) =>
//       loginRequest(username, password),

//     onSuccess: (user) => {
//       console.log("✅ Login success:", user);
//         toast.success("Успешный вход в систему", { description: `Добро пожаловать, ${user.first_name}  ${user.surname}!`})
//     },

//     onError: (error: any) => {
//       console.error("❌ Login error:", error);
//       toast.error("Ошибка входа в систему", { description: error?.response?.data?.detail || "Пожалуйста, попробуйте заново." });
//     },
//   });
// }


import { User } from "../types";
import { useNavigate } from "react-router-dom";

// Ключ для react-query кэша
const USER_QUERY_KEY = ["authUser"];
// 🔹 Хук для авторизации
export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      loginRequest(username, password),

    onSuccess: (user) => {
      console.log("✅ Login success:", user);
   
      queryClient.setQueryData(USER_QUERY_KEY, user);
      toast.success("Успешный вход в систему", { description: `Добро пожаловать, ${user.first_name}  ${user.surname}!`})
      navigate("/home"); 
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
