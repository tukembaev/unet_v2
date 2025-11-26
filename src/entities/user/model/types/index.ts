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
