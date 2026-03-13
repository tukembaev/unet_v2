import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "widgets/page-header/page-header";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "shared/ui";
import { Calendar, ChevronDown } from "lucide-react";
import TaskMembersTable from "./TaskMembersTable";
import TaskSubtasksTable from "./TaskSubtasksTable";
import TaskDetailsSkeleton from "./TaskDetailsSkeleton";
import { useTaskDetails, useUpdateTaskStatus } from "../../model/queries";
import TaskDocumentsCard from "./TaskDocumentsCard";
import { CreateTaskDialog } from "../CreateTaskDialog";
import { AddTaskMembersDialog } from "../AddTaskMembersDialog";
import { formatDate } from "shared/lib";

const TaskDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const taskId = location.state?.taskId as string | undefined;
  
  const { data: task, isLoading } = useTaskDetails(taskId);
  const updateStatusMutation = useUpdateTaskStatus();
  const [isEarlyCompletion, setIsEarlyCompletion] = useState(false);

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
    { value: 'PENDING', label: 'В ожидании' },
    { value: 'IN_PROGRESS', label: 'В работе' },
    { value: 'PAUSED', label: 'Приостановлена' },
    { value: 'REVIEW', label: 'На проверке' },
    { value: 'COMPLETED', label: isEarlyCompletion ? 'Досрочно завершить' : 'Завершить' },
    { value: 'CANCELED', label: 'Отменить' },
  ];

  return (
    <>
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <PageHeader
          title={task.title}
          description={task.status}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                Изменить статус
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {statusOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  disabled={updateStatusMutation.isPending}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
            <TaskMembersTable members={task.members} taskId={task.id} />

            {/* Subtasks Table */}
            <TaskSubtasksTable 
              taskId={task.id}
              subtasks={task.subtasks}
              onSubtaskClick={(subtaskId) => navigate('/task-details', { state: { taskId: subtaskId } })}
            />
          </div>

          {/* Right side - Documents (1/3) */}
          <div className="lg:col-span-1"> 
            <TaskDocumentsCard />
          </div>
        </div>
      </div>

      <CreateTaskDialog />
      <AddTaskMembersDialog />
    </>
  );
};

export default TaskDetails;

