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
  
  export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';

  export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

  export type TaskMemberRole = 'RESPONSIBLE' | 'CO_EXECUTOR' | 'OBSERVER';

  export interface TaskMember {
    task_id: string;
    user_id: string;
    user_name: string;
    role: TaskMemberRole | string;
    avatar_url: string;
    is_online: boolean;
    email: string;
    assigned_at: string;
  }

  export interface TaskSubtask {
    id: string;
    parent_id: string;
    type: string;
    title: string;
    description: string;
    status: TaskStatus | string;
    priority: TaskPriority | string;
    creator_id: string;
    created_at: string;
    updated_at: string;
    deadline_at: string | null;
    members: TaskMember[];
    allow_change_deadline: boolean;
    check_after_finish: boolean;
    auto_complete_parent: boolean;
  }

  export interface TaskDetail {
    id: string;
    type: string;
    title: string;
    description: string;
    status: TaskStatus | string;
    priority: TaskPriority | string;
    creator_id: string;
    created_at: string;
    updated_at: string;
    deadline_at: string | null;
    allow_change_deadline: boolean;
    check_after_finish: boolean;
    auto_complete_parent: boolean;
    parent_task_id?: string;
    members: TaskMember[];
    subtasks: TaskSubtask[];
  }

  export interface EmployeeTask {
    id: string;
    title: string;
    created_at: string;
    deadline_at: string | null;
    responsible_user_id: string;
    responsible_username: string;
    members: Array<{
      user_id: string;
      user_name: string;
      role: string;
      avatar_url: string;
      is_online: boolean;
    }>;
  }

  export interface TaskCategory {
    OVERDUE: EmployeeTask[];
    TODAY: EmployeeTask[];
    WEEK: EmployeeTask[];
    MONTH: EmployeeTask[];
    LONGRANGE: EmployeeTask[];
    INDEFINITE: EmployeeTask[];
  }

  export interface TasksRoot {
    ALL: TaskCategory;
    ATTACHED: TaskDetail[];
    COMPLETED: TaskDetail[];
    DOING: TaskCategory;
    HELPING: TaskCategory;
    INSTRUCTED: TaskCategory;
    WATCHING: TaskCategory;
  }

  export interface EmployeeTasksResponse {
    ALL: TaskCategory;
    ATTACHED: TaskDetail[];
    COMPLETED: TaskDetail[];
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

  export interface TaskFile {
    id?: number;
    name?: string;
    url?: string;
    task_id?: string;
    [key: string]: any;
  }