import { apiClient } from 'shared/config/axios';
import { Direction } from '../types';

export const getUsers = async (): Promise<Direction[]> => {
  const { data } = await apiClient.get('api/kind');
  return data;
};