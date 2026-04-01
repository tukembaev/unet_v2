import { SelectOptions } from "entities/education-management";
import { apiClient } from "shared/config";
import { StreamsEmployee } from "../types";
import { toast } from "sonner";


export async function getSubjectsInDepartments(id:number|string) {
  return apiClient.get(`/subjects-stream/?syllabus=${id}`);
}
export async function  getWorkPlanInDepartment (): Promise<SelectOptions[]>  {
  const {data} = await apiClient.get(`/workplan-select/`)
  return data;
}


  export async function createFlowsShedules(id : number | string) {
    try {
      const response = await apiClient.post(`/subjects-stream/${id}/streams/generate/`);
      toast.success('Расписание потоков успешно создано');
      return response;
    } catch (error: any) {
      const status = error?.response?.status || 'неизвестная ошибка';
      toast.error(`Ошибка при создании расписания потоков (${status})`);
      throw error;
    }
  }

export async function getFlowsShedules(id: number | string) {
  return apiClient.get(`/subjects-stream/${id}/streams/`);
}

export async function patchTeachers(flowId: number, body: any) {
  try {
    const response = await apiClient.patch(`/streams/${flowId}/`, body);
    toast.success('Преподаватель успешно обновлен');
    return response;
  } catch (error: any) {
    const status = error?.response?.status || 'неизвестная ошибка';
    toast.error(`Ошибка при обновлении преподавателя (${status})`);
    throw error;
  }
}

export async function getTeachersInDepartment(): Promise<StreamsEmployee[]> {
  const {data} = await apiClient.get(`/department/99/employees/`);
  let changeData: StreamsEmployee[] = data.map((item: any) => ({
    label: item.label,
    value: item.employee_id,   
  }));
  return changeData;
}