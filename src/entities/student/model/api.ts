import { apiClient } from 'shared/config';
import type {
  EnrolledDisciplinesBySemester,
  StudentSubject,
  StudentTicket,
  SubjectStreamOption,
} from './types';

/** GET /students/subjects/ — дисциплины для регистрации */
export async function fetchStudentSubjects(): Promise<StudentSubject[]> {
  const { data } = await apiClient.get<StudentSubject[]>('students/subjects/');
  return Array.isArray(data) ? data : [];
}

/** GET /students/subjects/{id}/streams/ */
export async function fetchSubjectStreams(
  subjectId: number
): Promise<SubjectStreamOption[]> {
  const { data } = await apiClient.get<SubjectStreamOption[] | { results?: SubjectStreamOption[] }>(
    `students/subjects/${subjectId}/streams/`
  );
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

/** POST /streams/{id}/register/ */
export async function registerToStream(streamId: number): Promise<unknown> {
  const { data } = await apiClient.post(`streams/${streamId}/register/`);
  return data;
}

/** POST /student-discipline/ */
export async function registerToDiscipline(
  subject: number,
  stream: number
): Promise<unknown> {
  const { data } = await apiClient.post('student-discipline/', { subject, stream });
  return data;
}

/** GET /student-discipline/ — мои дисциплины */
export async function fetchEnrolledDisciplines(): Promise<EnrolledDisciplinesBySemester> {
  const { data } = await apiClient.get<EnrolledDisciplinesBySemester | EnrolledDisciplinesBySemester[]>(
    'student-discipline/'
  );
  if (Array.isArray(data)) {
    return { '1': data as never };
  }
  return data && typeof data === 'object' ? data : {};
}

/** GET /students/v2/stud-ticket/ */
export async function fetchStudentTicket(): Promise<StudentTicket> {
  const { data } = await apiClient.get<StudentTicket>('students/v2/stud-ticket/');
  return data ?? {};
}
