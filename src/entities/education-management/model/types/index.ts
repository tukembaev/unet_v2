export interface FamilyDirectionItem {
  id: number
  cipher: string
  kind: number
  direction_name: string
}

export interface FamilyDirection {
  id: number
  code: string | null
  title: string
  direction: FamilyDirectionItem[]
}

export type Direction = {
  id: number;
  code: string | null;
  title: string;
};

export type Discipline = {
  id: number;
  kind: number;
  level_education: "bachelor" | "master" | "specialist";
  level_edu: string;
  form_edu: string;
  form_education: "full_time" | "part_time" | "distance";
  year: string;
  label: string;
  creator_name: string;
};
export type SelectOptions = {
  value: number;
  label: string;
};

export type WorkPlanItem = {
  id: number;
  number: number;
  name_subject: string;
  stream_type: string;
  teacher: number;
  teacher_name: string;
  status: string;
  students_count: number;
  capacity: number;
};
export interface TeacherHours {
  [teacherName: string]: {
    aud: number
    out: number
  }
}

export interface Subject {
  name: string
  credit: number
  semester: string
  direction: string
  streams: string[]
  students_count: number
  contract_stud: number
  budget_stud: number
  lecture: number
  practice: number
  lab: number
  consult_control: number
  rgr_rgz: number
  cw_cp: number
  vkr: number
  phd: number
  seminar: number
  aspirant: number
  doct_consult: number
  visit: number
  practice_supervise: number
  oop: number
  gak: number
  teachers_hours: TeacherHours
  total: number
}

export interface WorkLoad {
  subjects: Subject[]
  teachers: string[]
}
export interface Syllabus {
  id: number
  cipher: string
  direction: string
  duration: number
  years: string
  semesters: number
  profile_id: number
  profile: string
  subjects: number
}

export interface Reports {
  id: number
  institute: string
  syllabuses: Syllabus[]
}