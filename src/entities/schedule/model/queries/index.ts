import { useQuery } from "@tanstack/react-query";
import { fetchSchedules } from "../api";
import { ISchedule } from "../types";


export const useSchedulesQuery = () => {
  return useQuery<ISchedule>({
    queryKey: ["schedules"],
    queryFn: fetchSchedules,
    staleTime: 1000 * 60 * 5, // 5 минут кэш
    refetchOnWindowFocus: false,
  });
};