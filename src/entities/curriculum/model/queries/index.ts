import { useQuery } from '@tanstack/react-query';
import { getAllSyllabus } from '../api';

export function useAllSyllabus() {
  return useQuery({
    queryKey: ['all-syllabus'],
    queryFn: getAllSyllabus,
  });
}
