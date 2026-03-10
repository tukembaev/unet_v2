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
