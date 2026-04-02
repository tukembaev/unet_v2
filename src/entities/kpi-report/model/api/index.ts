import { apiClient } from "shared/config";
import { KpiDepartmentsReport, KpiInstituteReport } from "../types";


  export const KpiInstitutions = async (): Promise<KpiInstituteReport[]> => {
    const { data } = await apiClient.get('institutes/');
    return data;
  };
  export const fetchDepartmentsKpi = async (id : number): Promise<KpiDepartmentsReport[]> => {
    const { data } = await apiClient.get(`department/${id}/`);
    return data;
  };