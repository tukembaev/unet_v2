import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import PageHeader from "widgets/page-header/page-header";
import { 
  Button, 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label
} from "shared/ui";
import { Calendar, ChevronDown, Clock, Play, CheckCircle, XCircle, Eye, AlertCircle } from "lucide-react";
import TaskMembersTable from "./TaskMembersTable";
import TaskSubtasksTable from "./TaskSubtasksTable";
import TaskDetailsSkeleton from "./TaskDetailsSkeleton";
import { useTaskDetails, useUpdateTaskStatus } from "../../model/queries";
import TaskDocumentsCard from "./TaskDocumentsCard";

import { AddTaskMembersDialog } from "../AddTaskMembersDialog";
import { formatDate } from "shared/lib";
import { TaskStatus } from "../../model/types";
import { useCurrentUser } from "../../../user/model/queries";
import { CreateTaskDialog } from "features/create-task";

type UserRole = 'CREATOR' | 'RESPONSIBLE' | 'CO_EXECUTOR' | 'OBSERVER' | null;

const TaskDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const taskId = location.state?.taskId as string | undefined;
  
  const { data: task, isLoading } = useTaskDetails(taskId);
  const { data: currentUser } = useCurrentUser();
  const updateStatusMutation = useUpdateTaskStatus();

  // Состояния для управления диалогом отмены
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");


  // Определяем роль текущего пользователя в задаче
  const userRole = useMemo((): UserRole => {
    if (!task || !currentUser) return null;
    
    // Проверяем, является ли пользователь создателем
    if (task.creator_id === currentUser.id) {
      return 'CREATOR';
    }
    
    // Проверяем роль среди участников
    const member = task.members.find(m => m.user_id === currentUser.id);
    if (member) {
      if (member.role === 'RESPONSIBLE') return 'RESPONSIBLE';
      if (member.role === 'CO_EXECUTOR') return 'CO_EXECUTOR';
      if (member.role === 'OBSERVER') return 'OBSERVER';
    }
    
    return null;
  }, [task, currentUser]);

  // Определяем доступные статусы в зависимости от роли
  const availableStatuses = useMemo((): TaskStatus[] => {
    if (!userRole) return [];
    
    switch (userRole) {
      case 'CREATOR':
        return ['COMPLETED', 'CANCELED'];
      case 'RESPONSIBLE':
        return ['IN_PROGRESS', 'REVIEW', 'COMPLETED','CANCELED'];
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



  if (isLoading || !task) {
    return <TaskDetailsSkeleton />;
  }

  const handleStatusChange = async (status: string) => {
    if (!taskId) return;
    
    // Если выбран статус "Отмена", показываем диалог для ввода причины
    if (status === 'CANCELED') {
      setIsCancelDialogOpen(true);
      return;
    }
    
    try {
      await updateStatusMutation.mutateAsync({
        taskId,
        data: { status: status as any },
      });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleCancelConfirm = async () => {
    if (!taskId || !cancelReason.trim()) return;
    
    try {
      await updateStatusMutation.mutateAsync({
        taskId,
        data: { 
          status: 'CANCELED' as TaskStatus,
          cancel_reason: cancelReason.trim()
        },
      });
      setIsCancelDialogOpen(false);
      setCancelReason("");
    } catch (error) {
      console.error('Failed to cancel task:', error);
    }
  };

  const handleCancelDialogClose = () => {
    setIsCancelDialogOpen(false);
    setCancelReason("");
  };

  const statusOptions = [
    { value: 'PENDING', label: 'Очередь', icon: Clock, color: 'bg-gray-600 hover:bg-gray-700 dark:bg-gray-400 dark:hover:bg-gray-500', iconColor: 'text-gray-600 dark:text-gray-400' },
    { value: 'IN_PROGRESS', label: 'В работе', icon: Play, color: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500', iconColor: 'text-blue-600 dark:text-blue-400' },
    { value: 'REVIEW', label: 'Контроль', icon: Eye, color: 'bg-orange-600 hover:bg-orange-700 dark:bg-orange-400 dark:hover:bg-orange-500', iconColor: 'text-orange-600 dark:text-orange-400' },
    { value: 'COMPLETED', label: 'Готово', icon: CheckCircle, color: 'bg-green-600 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500', iconColor: 'text-green-600 dark:text-green-400' },
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
      <motion.div 
        className="container mx-auto p-4 md:p-6 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
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
         {task.status === 'CANCELED' && task.cancel_reason && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
            <span className="text-red-800 dark:text-red-200 text-sm">
              Отменена: {task.cancel_reason}
            </span>
          </div>
        )}
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
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            {/* Members Table */}
            <TaskMembersTable members={task.members} taskId={task.id} canAddMembers={canAddMembers} />

            {/* Subtasks Table */}
            <TaskSubtasksTable 
              taskId={task.id}
              subtasks={task.subtasks}
              onSubtaskClick={(subtaskId) => navigate('/task-details', { state: { taskId: subtaskId } })}
              canAddSubtasks={canAddSubtasks}
            />
          </motion.div>

          {/* Right side - Documents (1/3) */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          > 
            <TaskDocumentsCard canAddDocuments={canAddDocuments} />
          </motion.div>
        </div>
      </motion.div>

      <CreateTaskDialog />
      <AddTaskMembersDialog />
      
      {/* Dialog для ввода причины отмены */}
      <Dialog open={isCancelDialogOpen} onOpenChange={handleCancelDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Причина отмены задачи</DialogTitle>
            <DialogDescription>
              Укажите причину отмены задачи. Это поможет другим участникам понять, почему задача была отменена.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">Причина отмены</Label>
              <Input
                id="cancel-reason"
                placeholder="Например: Документ отозван заказчиком"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && cancelReason.trim()) {
                    handleCancelConfirm();
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelDialogClose}
              disabled={updateStatusMutation.isPending}
            >
              Отмена
            </Button>
            <Button
              onClick={handleCancelConfirm}
              disabled={!cancelReason.trim() || updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? 'Отмена...' : 'Подтвердить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskDetails;

