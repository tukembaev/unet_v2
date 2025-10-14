import { useQuery } from '@tanstack/react-query';
import { getUsers, getDisciplineTemplates, getFaculties } from '../api';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers, 
  });
}

export function useDisciplineTemplates(levelEducation: string, kind: number) {
  return useQuery({
    queryKey: ['discipline-templates', levelEducation, kind],
    queryFn: () => getDisciplineTemplates(levelEducation, kind),
    enabled: !!levelEducation && !!kind,
  });
}
export function useFaculties() {
  return useQuery({
    queryKey: ['faculties'],
    queryFn: getFaculties,
  });
}

