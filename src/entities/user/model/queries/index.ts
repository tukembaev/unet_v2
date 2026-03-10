import { useQuery, useMutation } from "@tanstack/react-query";
import { getUsersList, syncUsers } from "../api";

export function useUsersList() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsersList, 
  });
}

export function useSyncUsers() {
  return useMutation({
    mutationFn: syncUsers,
  });
}