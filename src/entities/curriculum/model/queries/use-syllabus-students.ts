import { useQuery } from '@tanstack/react-query';
import { fetchSyllabusStudents } from '../api';
import { curriculumKeys } from './keys';

export function useSyllabusStudents(syllabusId: number | null) {
  return useQuery({
    queryKey: curriculumKeys.students(syllabusId),
    queryFn: () => fetchSyllabusStudents(syllabusId!),
    enabled: syllabusId != null && syllabusId > 0,
  });
}
