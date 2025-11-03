export interface User {
    id: number;
    user: number;
    first_name: string;
    surname: string;
    surname_name: string;
    short_name: string;
    number_phone: string | null;
    imeag: string;
    email: string | null;
    division: string | null;
    position: string | null;
    is_online: boolean;
  }
  
  export type MemberType = "Ответственный" | "Соисполнитель" | "Наблюдатель";
  
  export interface Member {
    id: number;
    member: User | null;
    member_type: MemberType;
  }
  
  export interface Task {
    id: number;
    task_name: string;
    creator: User;
    status: string;
    attached_document: string;
    create_date: string;
    deadline_date: string | null;
    members: Member[];
  }
  
  export interface TaskCategory {
    OVERDUE: Task[];
    TODAY: Task[];
    WEEK: Task[];
    MONTH: Task[];
    LONGRANGE: Task[];
    INDEFINITE: Task[];
  }
  
  export interface TasksRoot {
    ALL: TaskCategory;
    ATTACHED: Task[];
    COMPLETED: Task[];
    DOING: TaskCategory;
    HELPING: TaskCategory;
    INSTRUCTED: TaskCategory;
    WATCHING: TaskCategory;
  }

  export interface EmployeeTasksResponse {
    ALL: TaskCategory;
    ATTACHED: Task[];
    COMPLETED: Task[];
    DOING: TaskCategory;
    HELPING: TaskCategory;
    INSTRUCTED: TaskCategory;
    WATCHING: TaskCategory;
  }

  export interface Resource {
    id?: number;
    name?: string;
    [key: string]: any;
  }

  export interface File {
    id?: number;
    name?: string;
    url?: string;
    [key: string]: any;
  }

  export interface TaskSubtaskMember {
    id: number;
    member: User | null;
    member_type: MemberType;
  }

  export interface TaskSubtask {
    id: number;
    creator: User;
    members_subtask: TaskSubtaskMember[];
    resources: Resource[];
    subtask_name: string;
    create_date: string;
    status: string;
    edit_status_date: string | null;
    deadline_date: string;
    rejection_reason: string | null;
    report: string | null;
    report_file: string | null;
    description: string;
  }

  export interface TaskDetail {
    id: number;
    creator: User;
    accounting: any | null;
    members: Member[];
    subtasks: TaskSubtask[];
    resources: Resource[];
    files: File[];
    deadline_date: string;
    task_name: string;
    create_date: string;
    status: string;
    edit_status_date: string | null;
    attached_document: string;
    report: string | null;
    report_file: string | null;
    description: string;
    is_critical: boolean;
    allow_change_deadline: boolean;
    skip_dayoffs: boolean;
    check_after_finish: boolean;
    determ_by_subtasks: boolean;
    report_after_finish: boolean;
    stage: any | null;
  }