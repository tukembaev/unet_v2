import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSyllabus } from '../api';
import type { CreateSyllabusPayload } from '../types';
import { curriculumKeys } from './keys';

export function useCreateSyllabus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSyllabusPayload) => createSyllabus(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: curriculumKeys.list() });
    },
  });
}
