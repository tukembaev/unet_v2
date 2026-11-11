import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchEnrolledDisciplines,
  fetchStudentSubjects,
  fetchStudentTicket,
  fetchSubjectStreams,
  registerToStream,
} from './api';

export const studentKeys = {
  all: ['student'] as const,
  subjects: () => [...studentKeys.all, 'subjects'] as const,
  streams: (subjectId: number) =>
    [...studentKeys.all, 'streams', subjectId] as const,
  enrolled: () => [...studentKeys.all, 'enrolled'] as const,
  ticket: () => [...studentKeys.all, 'ticket'] as const,
};

export function useStudentSubjectsQuery() {
  return useQuery({
    queryKey: studentKeys.subjects(),
    queryFn: fetchStudentSubjects,
    staleTime: 60_000,
  });
}

export function useSubjectStreamsQuery(subjectId: number | null) {
  return useQuery({
    queryKey: studentKeys.streams(subjectId ?? 0),
    queryFn: () => fetchSubjectStreams(subjectId!),
    enabled: subjectId != null && subjectId > 0,
  });
}

export function useEnrolledDisciplinesQuery() {
  return useQuery({
    queryKey: studentKeys.enrolled(),
    queryFn: fetchEnrolledDisciplines,
    staleTime: 60_000,
  });
}

export function useStudentTicketQuery() {
  return useQuery({
    queryKey: studentKeys.ticket(),
    queryFn: fetchStudentTicket,
    staleTime: 5 * 60_000,
  });
}

export function useRegisterToStreamMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (streamId: number) => registerToStream(streamId),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: studentKeys.subjects() }),
        qc.invalidateQueries({ queryKey: studentKeys.enrolled() }),
      ]);
    },
  });
}
