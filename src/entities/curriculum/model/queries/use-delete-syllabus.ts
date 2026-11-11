import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSyllabus } from '../api';
import { curriculumKeys } from './keys';

/** DELETE /syllabus/{id}/ — удаление РУП. */
export function useDeleteSyllabus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (syllabusId: number) => deleteSyllabus(syllabusId),
    onSuccess: (_data, syllabusId) => {
      void queryClient.invalidateQueries({ queryKey: curriculumKeys.list() });
      void queryClient.invalidateQueries({
        queryKey: curriculumKeys.course(syllabusId),
      });
      void queryClient.invalidateQueries({ queryKey: ['reports'] });
      void queryClient.invalidateQueries({ queryKey: ['syllabus-report'] });
    },
  });
}
