import { apiClient } from 'shared/config/axios';
import { Directions } from '../types';

export const getAllSyllabus = async (): Promise<Directions> => {
  const { data } = await apiClient.get('all-syllabus/');
  return data;
};
