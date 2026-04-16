import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appendSemesterToSyllabus } from '../api';
import { curriculumKeys } from './keys';

export function useAppendSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ syllabusId }: { syllabusId: number }) =>
      appendSemesterToSyllabus(syllabusId),
    onSuccess: (_, { syllabusId }) => {
      void queryClient.invalidateQueries({ queryKey: curriculumKeys.course(syllabusId) });
      void queryClient.invalidateQueries({ queryKey: ['syllabus-report'] });
    },
  });
}
