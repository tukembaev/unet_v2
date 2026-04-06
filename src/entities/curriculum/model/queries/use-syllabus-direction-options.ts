import { useQuery } from '@tanstack/react-query';
import { fetchSyllabusDirectionOptions } from '../api';
import { curriculumKeys } from './keys';

export function useSyllabusDirectionOptions() {
  return useQuery({
    queryKey: curriculumKeys.directionOptions(),
    queryFn: fetchSyllabusDirectionOptions,
    staleTime: 5 * 60 * 1000,
  });
}
