// it-department/model/types/index.ts

export type ID = number | string;

export interface EmployeeEmployment {
  id: string;
  organization_name?: string | null;
  position?: string | null;
  rate?: number | null;
  employment_type?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_active?: boolean;
}

export interface Employee {
  id: ID; // UUID
  username: string;
  full_name: string;
  email?: string | null;
  phone_number?: string | null;
  is_active: boolean;
  avatar_url?: string | null;
  employee_profile?: {
    is_active?: boolean;
    employments?: EmployeeEmployment[];
  } | null;
}

export interface EmployeeDetail extends Employee {
  first_name?: string | null;
  last_name?: string | null;
  middle_name?: string | null;
  birth_date?: string | null;
  gender?: string | null;
}

export interface EmployeesResponse {
  total: number;
  page: number;
  size: number;
  items: Employee[];
}

export interface EmployeeFilters {
  search?: string;
  page?: number;
  size?: number;
}
