import { useQuery } from '@tanstack/react-query';
import { fetchSyllabusList } from '../api';
import { curriculumKeys } from './keys';

export function useSyllabusList() {
  return useQuery({
    queryKey: curriculumKeys.list(),
    queryFn: fetchSyllabusList,
  });
}
