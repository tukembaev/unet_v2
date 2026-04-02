// Типы для отчетов по задачам

export interface UserTaskStats {
  user_id: string;
  user_name: string;
  total_assigned: number;
  completed: number;
  in_progress: number;
  avg_completion_time: number; // в часах
  avatar_url?: string;
} 
export interface PerformanceStats {
  total_created: number;
  total_completed: number;
  avg_completion_time: number;
  completion_rate: number; // процент
}

// Параметры для запросов (даты в RFC3339 формате: 2026-03-16T00:00:00Z)
export interface DateRangeParams {
  start_date?: string; // RFC3339 format: 2026-03-16T00:00:00Z
  end_date?: string;   // RFC3339 format: 2026-03-23T23:59:59Z
}

// Ответы от API
export interface UsersReportResponse {
  users: UserTaskStats[];
  total: number;
}

export interface PerformanceReportResponse {
  stats: PerformanceStats;
}

// Новые типы для отчета по задачам
export type TaskRole = 'RESPONSIBLE' | 'EXECUTOR' | 'OBSERVER' | 'CREATOR';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'PAUSED' | 'REVIEW' | 'COMPLETED' | 'CANCELED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TaskType = 'EPIC' | 'TASK' | 'SUBTASK';

export interface TaskMember {
  task_id: string;
  user_id: string;
  user_name: string;
  role: TaskRole;
  avatar_url?: string;
  is_online: boolean;
  email: string;
  assigned_at: string;
}

export interface TaskFile {
  id: string;
  name: string;
  url: string;
  size: number;
  uploaded_at: string;
}

export interface ReportTask {
  id: string;
  parent_id?: string;
  type: TaskType;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  creator_id: string;
  created_at: string;
  updated_at: string;
  deadline_at?: string;
  allow_change_deadline: boolean;
  check_after_finish: boolean;
  auto_complete_parent: boolean;
  members: TaskMember[];
  subtasks: ReportTask[];
  files: TaskFile[];
}

export interface TasksReportFilters {
  role?: TaskRole;
  status?: TaskStatus;
}

export interface TasksReportParams extends DateRangeParams {
  role?: TaskRole;
  status?: TaskStatus;
}

export interface TasksReportResponse {
  period: {
    start_date: string;
    end_date: string;
  };
  filters?: TasksReportFilters;
  tasks: ReportTask[];
  total: number;
  updated_at: string;
}
