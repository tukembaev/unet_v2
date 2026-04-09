import { queryClient } from 'shared/config/query-client';

/**
 * Централизованная функция выхода из системы
 * Очищает все данные пользователя и кэш
 */
export const performLogout = () => {
  // Очищаем весь кэш React Query
  queryClient.clear();
  
  // Очищаем localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('refresh');
  localStorage.removeItem('pin');
  localStorage.removeItem('user');
  
  // Очищаем sessionStorage
  sessionStorage.clear();
};
