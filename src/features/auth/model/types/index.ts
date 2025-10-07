export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  inn: string;
  pin: string | null;
  token: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  surname: string | null;
}
