import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "widgets/page-header/page-header";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "shared/ui";
import { Calendar, ChevronDown, Clock, Play, CheckCircle, XCircle, Eye } from "lucide-react";
import TaskMembersTable from "./TaskMembersTable";
import TaskSubtasksTable from "./TaskSubtasksTable";
import TaskDetailsSkeleton from "./TaskDetailsSkeleton";
import { useTaskDetails, useUpdateTaskStatus } from "../../model/queries";
import TaskDocumentsCard from "./TaskDocumentsCard";
import { CreateTaskDialog } from "../CreateTaskDialog";
import { AddTaskMembersDialog } from "../AddTaskMembersDialog";
import { formatDate } from "shared/lib";
import { TaskStatus } from "../../model/types";

// Временный ID текущего пользователя (в будущем получать из контекста/auth)
const CURRENT_USER_ID = "69298";

type UserRole = 'CREATOR' | 'RESPONSIBLE' | 'CO_EXECUTOR' | 'OBSERVER' | null;

const TaskDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const taskId = location.state?.taskId as string | undefined;
  
  const { data: task, isLoading } = useTaskDetails(taskId);
  const updateStatusMutation = useUpdateTaskStatus();
  const [isEarlyCompletion, setIsEarlyCompletion] = useState(false);

  // Определяем роль текущего пользователя в задаче
  const userRole = useMemo((): UserRole => {
    if (!task) return null;
    
    // Проверяем, является ли пользователь создателем
    if (task.creator_id === CURRENT_USER_ID) {
      return 'CREATOR';
    }
    
    // Проверяем роль среди участников
    const member = task.members.find(m => m.user_id === CURRENT_USER_ID);
    if (member) {
      if (member.role === 'RESPONSIBLE') return 'RESPONSIBLE';
      if (member.role === 'CO_EXECUTOR') return 'CO_EXECUTOR';
      if (member.role === 'OBSERVER') return 'OBSERVER';
    }
    
    return null;
  }, [task]);

  // Определяем доступные статусы в зависимости от роли
  const availableStatuses = useMemo((): TaskStatus[] => {
    if (!userRole) return [];
    
    switch (userRole) {
      case 'CREATOR':
        return ['COMPLETED', 'CANCELED'];
      case 'RESPONSIBLE':
      case 'CO_EXECUTOR':
        return ['IN_PROGRESS', 'REVIEW'];
      case 'OBSERVER':
        return [];
      default:
        return [];
    }
  }, [userRole]);

  // Проверяем, может ли пользователь менять статус
  const canChangeStatus = availableStatuses.length > 0;

  // Проверяем права на добавление подзадач, документов и участников
  const canAddSubtasks = userRole === 'CREATOR' || userRole === 'RESPONSIBLE' || userRole === 'CO_EXECUTOR';
  const canAddDocuments = userRole === 'CREATOR' || userRole === 'RESPONSIBLE' || userRole === 'CO_EXECUTOR';
  const canAddMembers = userRole === 'CREATOR' || userRole === 'RESPONSIBLE';

  // Determine if task can be completed early
  useEffect(() => {
    if (task?.deadline_at) {
      const deadline = new Date(task.deadline_at);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      deadline.setHours(0, 0, 0, 0);
      setIsEarlyCompletion(today < deadline);
    }
  }, [task]);

  if (isLoading || !task) {
    return <TaskDetailsSkeleton />;
  }

  const handleStatusChange = async (status: string) => {
    if (!taskId) return;
    
    try {
      await updateStatusMutation.mutateAsync({
        taskId,
        data: { status: status as any },
      });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const statusOptions = [
    { value: 'PENDING', label: 'Очередь', icon: Clock, color: 'bg-gray-600 hover:bg-gray-700 dark:bg-gray-400 dark:hover:bg-gray-500', iconColor: 'text-gray-600 dark:text-gray-400' },
    { value: 'IN_PROGRESS', label: 'В работе', icon: Play, color: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500', iconColor: 'text-blue-600 dark:text-blue-400' },
    { value: 'REVIEW', label: 'Контроль', icon: Eye, color: 'bg-orange-600 hover:bg-orange-700 dark:bg-orange-400 dark:hover:bg-orange-500', iconColor: 'text-orange-600 dark:text-orange-400' },
    { value: 'COMPLETED', label: isEarlyCompletion ? 'Досрочно завершить' : 'Готово', icon: CheckCircle, color: 'bg-green-600 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500', iconColor: 'text-green-600 dark:text-green-400' },
    { value: 'CANCELED', label: 'Отмена', icon: XCircle, color: 'bg-red-600 hover:bg-red-700 dark:bg-red-400 dark:hover:bg-red-500', iconColor: 'text-red-600 dark:text-red-400' },
  ];

  const currentStatus = statusOptions.find(opt => opt.value === task.status) || statusOptions[0];
  const CurrentIcon = currentStatus.icon;

  // Фильтруем опции статусов для отображения в dropdown
  const filteredStatusOptions = statusOptions.filter(opt => 
    availableStatuses.includes(opt.value as TaskStatus)
  );

  return (
    <>
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <PageHeader
          title={task.title}
        
        >
          {canChangeStatus ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className={`${currentStatus.color} text-white`}>
                  <CurrentIcon className="mr-2 h-4 w-4" />
                  {currentStatus.label}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {filteredStatusOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleStatusChange(option.value)}
                      disabled={updateStatusMutation.isPending}
                    >
                      <IconComponent className={`mr-2 h-4 w-4 ${option.iconColor}`} />
                      {option.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className={`${currentStatus.color} text-white`} disabled>
              <CurrentIcon className="mr-2 h-4 w-4" />
              {currentStatus.label}
            </Button>
          )}
        </PageHeader>

      {/* Top Info: Deadline and Created Date */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Крайний срок: {formatDate(task.deadline_at)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Поставлена: {formatDate(task.created_at)}</span>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold flex items-center gap-2">
          Описание задачи
        </h2>
        <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
          {task.description || "Описание отсутствует"}
        </p>
      </div>

        {/* Main Layout: Content on left, Documents on right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left side - Main content (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Members Table */}
            <TaskMembersTable members={task.members} taskId={task.id} canAddMembers={canAddMembers} />

            {/* Subtasks Table */}
            <TaskSubtasksTable 
              taskId={task.id}
              subtasks={task.subtasks}
              onSubtaskClick={(subtaskId) => navigate('/task-details', { state: { taskId: subtaskId } })}
              canAddSubtasks={canAddSubtasks}
            />
          </div>

          {/* Right side - Documents (1/3) */}
          <div className="lg:col-span-1"> 
            <TaskDocumentsCard canAddDocuments={canAddDocuments} />
          </div>
        </div>
      </div>

      <CreateTaskDialog />
      <AddTaskMembersDialog />
    </>
  );
};

export default TaskDetails;

