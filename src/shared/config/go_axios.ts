import axios from 'axios';

export const apiClientGo = axios.create({
  baseURL: 'http://localhost:8081/api/v1/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth headers
apiClientGo.interceptors.request.use(
  (config) => {
    // Add X-User-ID header for development
    config.headers['X-User-ID'] = 'X-User-ID'; // You can make this dynamic based on your auth state
    return config;
  },
  (error) => Promise.reject(error)
);

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

