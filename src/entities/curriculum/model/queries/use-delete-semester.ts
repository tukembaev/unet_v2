import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSemesterFromSyllabus } from '../api';
import { curriculumKeys } from './keys';

/** DELETE /semester/{semesterId}/ — в URL передаётся id семестра, не РУП. */
export function useDeleteSemester(syllabusId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (semesterId: number) => deleteSemesterFromSyllabus(semesterId),
    onSuccess: () => {
      if (syllabusId != null) {
        void queryClient.invalidateQueries({
          queryKey: curriculumKeys.course(syllabusId),
        });
      }
      void queryClient.invalidateQueries({ queryKey: ['syllabus-report'] });
    },
  });
}
