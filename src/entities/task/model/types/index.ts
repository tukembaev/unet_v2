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
    ATTACHED: TaskCategory;
    COMPLETED: TaskCategory;
    DOING: TaskCategory;
    HELPING: TaskCategory;
    INSTRUCTED: TaskCategory;
    WATCHING: TaskCategory;
  }
