import { useQuery } from '@tanstack/react-query';
import { fetchSyllabusTemplatesByDirection } from '../api';
import { curriculumKeys } from './keys';

export function useSyllabusTemplatesByDirection(directionId: number | undefined) {
  return useQuery({
    queryKey: curriculumKeys.templatesByDirection(directionId),
    queryFn: () => fetchSyllabusTemplatesByDirection(directionId!),
    enabled: directionId != null && directionId > 0,
  });
}
