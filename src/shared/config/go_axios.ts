import axios from 'axios';

export const apiClientGo = axios.create({
  baseURL: 'https://utask.kstu.kg/task/api/v1/',
  // baseURL: 'http://localhost:8080/task/api/v1/',

  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// TODO убрать через auth bearer и сделать после заливки на utask через куки
apiClientGo.interceptors.request.use((config) => {
  type AuthData = {
  access_token: string;
  refresh_token: string;
  csrf_token: string;
};

const userStr = localStorage.getItem('user');

const user: AuthData | null = userStr ? JSON.parse(userStr) : null;


  if (user?.access_token) {
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }

  return config;
});

// Response interceptor
apiClientGo.interceptors.response.use(
  (response) => response,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error: any) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

