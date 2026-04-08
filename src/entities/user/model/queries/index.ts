import { useQuery, useMutation } from "@tanstack/react-query";
import { getUsersList, syncUsers, getCurrentUser, getEmployeeDetails, getEmployeeByUserId } from "../api";

export function useUsersList() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsersList,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
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

export function useEmployeeByUserId(userId: string, enabled = true) {
  return useQuery({
    queryKey: ['employeeByUserId', userId],
    queryFn: () => getEmployeeByUserId(userId),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000,
  });
}