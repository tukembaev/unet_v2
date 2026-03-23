import { useQuery, useMutation } from "@tanstack/react-query";
import { getUsersList, syncUsers, getCurrentUser, getEmployeeDetails } from "../api";

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

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });
}

export function useEmployeeDetails(userId: string, enabled = true) {
  return useQuery({
    queryKey: ['employeeDetails', userId],
    queryFn: () => getEmployeeDetails(userId),
    enabled: enabled && !!userId,
  });
}