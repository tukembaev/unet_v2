export interface Flow {
  id: number;
  name: string;
  department: string;
  syllabusId: string;
}

export interface FlowInfo {
  id: number;
  number: string;
  name_subject: string;
  stream_type: string;
  status: string;
  capacity: number;
  teacher_name?: string | null;
  teacher?: number | null;
  department_id: number;
}

export interface StreamsEmployee {
  employee_id : number;
  is_active : boolean;
  label : string;
  value : number;
}

