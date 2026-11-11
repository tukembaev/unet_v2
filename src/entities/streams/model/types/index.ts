export interface Flow {
  id: number;
  name: string;
  department: string;
  syllabusId: string;
}

export interface FlowSelectOption {
  value: number;
  label: string;
}

export interface EducationSelectOption {
  value: string;
  label: string;
}

export interface FlowSemesterOption {
  id: number;
  name_semester: string;
}

export interface FlowSubject {
  id: number;
  code: string | null;
  name_subject: string;
  semester: string | number;
  direction: string;
  profile_name?: string | null;
}

export interface FlowSubjectsParams {
  syllabus?: number;
  semester?: number;
  page?: number;
  search?: string;
}

export interface FlowSubjectsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FlowSubject[];
  page: number;
}

export interface FlowInfo {
  id: number;
  number: string;
  name_subject: string;
  stream_type: string;
  status: string;
  capacity: number;
  students_count?: number | null;
  teacher_name?: string | null;
  teacher?: number | null;
  department_id: number;
}

export interface StreamsEmployee {
  employee_id: number;
  is_active: boolean;
  label: string;
  value: number;
}
