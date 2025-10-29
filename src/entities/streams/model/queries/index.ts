import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFlowsShedules, getFlowsShedules, getSubjectsInDepartments, getTeachersInDepartment, getWorkPlanInDepartment, patchTeachers } from "../api";
import { FlowInfo } from "../types";
import { toast } from "sonner";

export const useFlows = (syllabusId: string) => {
  return useQuery({
    queryKey: ["flows", syllabusId],
    queryFn: () => getSubjectsInDepartments(syllabusId),
  });
};

export const useWorkPlans = () => {
  return useQuery({
    queryKey: ["workPlans"],
    queryFn: () => getWorkPlanInDepartment(),
  });
};



export const useUpdateTeacher = (sheduleId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ flowId, teacher }: { flowId: number; teacher: number }) =>
      patchTeachers(flowId, { teacher }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flowInfo", sheduleId] });
      toast.success("Преподаватель успешно обновлен");
    },
  });
};

export const useFlowsSchedules = (sheduleId: string | number | null) => {
  return useQuery<FlowInfo[], Error>({
    queryKey: ["flowInfo", sheduleId],
    queryFn: async () => {
      if (!sheduleId) return [];
      await createFlowsShedules(sheduleId);
      const response = await getFlowsShedules(sheduleId);
      return response.data;
    },
    enabled: !!sheduleId, 
  });
};

export const useSelectEmployees = () => {
  return useQuery({
    queryKey: ["selectEmployees"],
    queryFn: () => getTeachersInDepartment(),
  });
};
