export type UserRole = "student" | "teacher" | "employee";

export interface IUser {
  id: number;
  first_name: string;
  last_name?: string;
  surname?: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  role: UserRole;
  image?: string;
}

// Types for CreateTaskDialog
export interface UserListItem {
  id?: number;
  user_id: string;
  full_name: string;
  middle_name: string | null;
  email: string;
  is_active?: boolean;
  avatar?: string;
  avatar_url?: string | null;
}

// Current user profile types
export interface Employment {
  id: string;
  organization_name: string;
  position: string;
  rate: number;
  employment_type: "MAIN" | "PART_TIME";
  start_date: string;
  end_date: string | null;
  is_active: boolean;
}

export interface EmployeeProfile {
  is_active: boolean;
  employments: Employment[];
}

export interface CurrentUser {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  phone_number: string;
  birth_date: string;
  gender: "M" | "F";
  is_active: boolean;
  permissions: string[];
  employee_profile: EmployeeProfile;
  avatar_url: string | null;
}

/** PATCH /users/me — поля зависят от контракта API */
export interface PatchCurrentUserBody {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  email?: string;
  phone_number?: string;
  birth_date?: string;
  gender?: "M" | "F";
}

export interface ChangePasswordBody {
  current_password: string;
  new_password: string;
}

// Employee details types
export interface EmployeeDetails {
  id: string;
  username: string;
  full_name: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  phone_number: string;
  birth_date: string;
  gender: "M" | "F";
  is_active: boolean;
  employee_profile: EmployeeProfile;
  avatar_url: string | null;
}
