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
