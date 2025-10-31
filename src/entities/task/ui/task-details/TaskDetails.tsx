import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "widgets/page-header/page-header";
import { Button } from "shared/ui";
import { Calendar, CheckCircle2 } from "lucide-react";
import TaskMembersTable from "./TaskMembersTable";
import TaskSubtasksTable from "./TaskSubtasksTable";
import TaskDocumentsCard from "./TaskDocumentsCard";
import TaskDetailsSkeleton from "./TaskDetailsSkeleton";
import { cn } from "shared/lib";
import { useTaskDetails } from "../../model/queries";

const TaskDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const taskId = location.state?.taskId as number | undefined;
  
  const { data: task, isLoading } = useTaskDetails(taskId);
  const [isEarlyCompletion, setIsEarlyCompletion] = useState(false);

  // Determine if task can be completed early
  useEffect(() => {
    if (task?.deadline_date) {
      const deadline = new Date(task.deadline_date.split('.').reverse().join('-'));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      deadline.setHours(0, 0, 0, 0);
      setIsEarlyCompletion(today < deadline);
    }
  }, [task]);

  if (isLoading || !task) {
    return <TaskDetailsSkeleton />;
  }

  const handleCompleteTask = () => {
    // TODO: Implement task completion logic
    console.log('Complete task:', task.id, isEarlyCompletion ? 'early' : 'normal');
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <PageHeader
        title={task.task_name}
        description={task.status}
      >
        <Button
          onClick={handleCompleteTask}
          variant={isEarlyCompletion ? "secondary" : "default"}
          className={cn(
            !isEarlyCompletion && "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
          )}
        >
          <CheckCircle2 className="h-4 w-4" />
          {isEarlyCompletion ? "Досрочно завершить" : "Завершить"}
        </Button>
      </PageHeader>

      {/* Top Info: Deadline and Created Date */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Крайний срок: {task.deadline_date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Поставлена: {task.create_date}</span>
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
          <TaskMembersTable members={task.members} />

          {/* Subtasks Table */}
          <TaskSubtasksTable 
            subtasks={task.subtasks}
            onSubtaskClick={(subtaskId) => navigate('/task-details', { state: { taskId: subtaskId } })}
          />
        </div>

        {/* Right side - Documents (1/3) */}
        <div className="lg:col-span-1">
          <TaskDocumentsCard files={task.files} />
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;

