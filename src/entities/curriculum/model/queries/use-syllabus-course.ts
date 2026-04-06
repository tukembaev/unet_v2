import { useQuery } from '@tanstack/react-query';
import { fetchSyllabusCourse } from '../api';
import { curriculumKeys } from './keys';

export function useSyllabusCourse(
  syllabusId: number | undefined,
  profileId?: number,
  options?: { language?: string; enabled?: boolean }
) {
  const enabled =
    options?.enabled !== undefined ? options.enabled : !!syllabusId;

  return useQuery({
    queryKey: curriculumKeys.course(syllabusId, profileId),
    queryFn: () =>
      fetchSyllabusCourse(syllabusId!, {
        profileId,
        language: options?.language,
      }),
    enabled: enabled && !!syllabusId,
  });
}
