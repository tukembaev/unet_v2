import { useQuery } from '@tanstack/react-query';
import { fetchSyllabusById } from '../api';
import { curriculumKeys } from './keys';

export function useSyllabusDetail(id: number | null, enabled = true) {
  return useQuery({
    queryKey: curriculumKeys.detail(id ?? undefined),
    queryFn: () => fetchSyllabusById(id!),
    enabled: enabled && id != null && id > 0,
  });
}
