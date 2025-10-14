// it-department/model/types/index.ts

export type ID = number | string;

export interface Employee {
  id: ID;
  surname: string;
  first_name: string;
  inn?: string | null;
  number_phone?: string | null;
  email_person?: string | null;
  is_active: boolean;
}

export interface EmployeesResponse {
  count: number;
  results: Employee[];
}

export interface EmployeeUpdatePayload {
  number_phone?: string;
  email?: string;
  is_active?: boolean;
  reset_password?: boolean;
  reset_pin?: boolean;
}

export interface EmployeeFilters {
  search?: string;
  page?: number;
  before_age?: string;
  after_age?: string;
  gender?: string;
  position_id?: string;
  citizen?: string;
  stavka?: string;
  national?: string;
}
