import { SelectOptions } from "entities/education-management";
import { apiClient } from "shared/config";
import { StreamsEmployee } from "../types";


export async function getSubjectsInDepartments(id:number|string) {
  return apiClient.get(`/subjects-stream/?syllabus=${id}`);
}
export async function  getWorkPlanInDepartment (): Promise<SelectOptions[]>  {
  const {data} = await apiClient.get(`/workplan-select/`)
  return data;
}


  export async function createFlowsShedules(id : number | string) {
    return apiClient.post(`/subjects-stream/${id}/streams/generate/`);
  }

export async function getFlowsShedules(id: number | string) {
  return apiClient.get(`/subjects-stream/${id}/streams/`);
}

export async function patchTeachers(flowId: number, body: any) {
  return apiClient.patch(`/streams/${flowId}/`, body);
}

export async function getTeachersInDepartment(): Promise<StreamsEmployee[]> {
  const {data} = await apiClient.get(`/department/99/employees/`);
  let changeData: StreamsEmployee[] = data.map((item: any) => ({
    label: item.label,
    value: item.employee_id,   
  }));
  return changeData;
}