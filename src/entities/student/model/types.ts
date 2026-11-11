export interface SubjectStreamRef {
  stream_id?: number;
  number?: number | string | null;
  teacher_name?: string | null;
}

export interface StudentSubject {
  id: number;
  semester?: string | null;
  name_subject: string;
  credit?: number | null;
  control_form?: string | null;
  active?: boolean;
  lab?: SubjectStreamRef | null;
  lecture?: SubjectStreamRef | null;
  practice?: SubjectStreamRef | null;
  stream?: number | null;
}

export interface SubjectStreamOption {
  id: number;
  number: number;
  name_subject?: string;
  semester?: string;
  stream_type: string;
  status?: string;
  students_count?: number;
  capacity?: number;
  teacher_name?: string | null;
  is_registered?: boolean;
  schedules?: Array<{
    id: number;
    weekday_title?: string;
    week_type_title?: string;
    weeks?: string;
    audit?: string;
    time?: string;
  }>;
}

/** GET /student-discipline/ — дисциплины по семестрам */
export interface EnrolledDiscipline {
  id: number;
  subject?: number;
  name_subject: string;
  course_type?: string | null;
  credit?: number | string | null;
  number?: number | string | null;
  lecturer?: string | null;
}

export type EnrolledDisciplinesBySemester = Record<string, EnrolledDiscipline[]>;

export interface StudentTicket {
  code_stud?: string;
  photo?: string | null;
  gender?: string;
  surname?: string;
  first_name?: string;
  last_name?: string;
  faculty?: string;
  abbreviation_faculty?: string;
  group?: string;
  cource?: string;
  course?: string;
  year_study?: string;
}
