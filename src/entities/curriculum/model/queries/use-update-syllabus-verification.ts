import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSyllabusById } from '../api';
import { curriculumKeys } from './keys';

export type SyllabusVerificationPayload =
  | { is_verified: true; reason_reject: null }
  | { is_verified: false; reason_reject: string };

export function useUpdateSyllabusVerification(syllabusId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SyllabusVerificationPayload) =>
      updateSyllabusById(syllabusId!, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reports'] });
      void queryClient.invalidateQueries({ queryKey: curriculumKeys.list() });
      if (syllabusId != null) {
        void queryClient.invalidateQueries({
          queryKey: curriculumKeys.detail(syllabusId),
        });
      }
    },
  });
}
