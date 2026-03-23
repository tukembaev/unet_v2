import React, { useState, useMemo } from "react";
import { TaskCard } from "./TaskCard";
import { TaskCategory, EmployeeTask } from "../model/types";
import {
  Badge,
  Card,
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "shared/ui";
import { ListCheck, Clock, Calendar, Clock as ClockIcon, Play, Eye, CheckCircle, XCircle } from "lucide-react";

interface KanbanBoardProps {
  tasks: TaskCategory;
  isLoading?: boolean;
}

type SortMode = "newest" | "deadline";

const sectionConfig = [
  {
    key: "PENDING" as keyof TaskCategory,
    title: "Очередь",
    icon: ClockIcon,
    color: "text-gray-600 dark:text-gray-400",
  },
  {
    key: "IN_PROGRESS" as keyof TaskCategory,
    title: "В работе",
    icon: Play,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    key: "REVIEW" as keyof TaskCategory,
    title: "Контроль",
    icon: Eye,
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    key: "COMPLETED" as keyof TaskCategory,
    title: "Готово",
    icon: CheckCircle,
    color: "text-green-600 dark:text-green-400",
  },
  {
    key: "CANCELED" as keyof TaskCategory,
    title: "Отмена",
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
  },
];

const sortTasks = (tasks: EmployeeTask[], mode: SortMode): EmployeeTask[] => {
  if (!tasks || !Array.isArray(tasks)) {
    return [];
  }
  
  const tasksCopy = [...tasks];
  
  if (mode === "newest") {
    return tasksCopy.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } else {
    return tasksCopy.sort((a, b) => {
      if (!a.deadline_at && !b.deadline_at) return 0;
      if (!a.deadline_at) return 1;
      if (!b.deadline_at) return -1;
      return new Date(a.deadline_at).getTime() - new Date(b.deadline_at).getTime();
    });
  }
};

const KanbanBoardComponent: React.FC<KanbanBoardProps> = ({
  tasks,
  isLoading = false,
}) => {
  const [sortModes, setSortModes] = useState<Record<keyof TaskCategory, SortMode>>({
    PENDING: "newest",
    IN_PROGRESS: "newest",
    REVIEW: "newest",
    COMPLETED: "newest",
    CANCELED: "newest",
  });

  const toggleSortMode = (key: keyof TaskCategory) => {
    setSortModes(prev => ({
      ...prev,
      [key]: prev[key] === "newest" ? "deadline" : "newest",
    }));
  };

  // Сортируем все задачи заранее, вне цикла map
  const sortedTasksBySection = useMemo(() => {
    return {
      PENDING: sortTasks(tasks?.PENDING || [], sortModes.PENDING),
      IN_PROGRESS: sortTasks(tasks?.IN_PROGRESS || [], sortModes.IN_PROGRESS),
      REVIEW: sortTasks(tasks?.REVIEW || [], sortModes.REVIEW),
      COMPLETED: sortTasks(tasks?.COMPLETED || [], sortModes.COMPLETED),
      CANCELED: sortTasks(tasks?.CANCELED || [], sortModes.CANCELED),
    };
  }, [tasks, sortModes]);

  if (isLoading) {
    return <KanbanSkeleton />;
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="container mx-auto flex gap-6 min-w-max">
        {sectionConfig.map((section) => {
          const sortedTasks = sortedTasksBySection[section.key];
          const taskCount = sortedTasks.length;
          const currentSortMode = sortModes[section.key];

          return (
            <div key={section.key} className="w-80 flex-shrink-0">
              <div className="space-y-4">
                {/* Section Header */}
                <div className="flex items-center gap-2 px-1">
                  <div className="flex items-center gap-2">
                    {React.createElement(section.icon, { className: `h-5 w-5 ${section.color}` })}
                    <h2 className={`font-semibold text-base ${section.color}`}>
                      {section.title}
                    </h2>
                  </div>
                  <Badge variant="outline">{taskCount}</Badge>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 ml-auto"
                          onClick={() => toggleSortMode(section.key)}
                        >
                          {currentSortMode === "newest" ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <Calendar className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {currentSortMode === "newest"
                            ? "Сортировка: новые сверху. Нажмите для сортировки по дедлайну"
                            : "Сортировка: по дедлайну. Нажмите для сортировки по дате создания"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Tasks List */}
                <div className="space-y-3">
                  {sortedTasks.length > 0 ? (
                    sortedTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  ) : (
                    <Empty className="border border-dashed max-h-[159px]">
                      <EmptyHeader className="gap-1.5">
                        <EmptyMedia variant="icon" className="mb-0 size-8 [&_svg]:size-4">
                          <ListCheck size={12} />
                        </EmptyMedia>
                        <EmptyTitle className="text-sm font-semibold">Нет задач</EmptyTitle>
                        <EmptyDescription className="text-xs">
                          {section.key === "PENDING" && "Нет задач в очереди"}
                          {section.key === "IN_PROGRESS" && "Нет задач в работе"}
                          {section.key === "REVIEW" && "Нет задач на контроле"}
                          {section.key === "COMPLETED" && "Нет завершенных задач"}
                          {section.key === "CANCELED" && "Нет отмененных задач"}
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const KanbanBoard = React.memo(KanbanBoardComponent);

// Skeleton Loader Component
const KanbanSkeleton: React.FC = () => {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-6 min-w-max">
        {sectionConfig.map((section) => (
          <div key={section.key} className="w-80 flex-shrink-0">
            <div className="space-y-4">
              {/* Section Header Skeleton */}
              <div className="flex items-center gap-2 px-1">
                <div className="h-5 bg-muted rounded w-24 animate-pulse"></div>
                <div className="h-5 bg-muted rounded w-8 animate-pulse"></div>
                <div className="h-7 w-7 bg-muted rounded animate-pulse ml-auto"></div>
              </div>

              {/* Task Cards Skeleton */}
              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                      </div>
                      <div className="h-3 bg-muted rounded w-full animate-pulse"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-muted rounded-full animate-pulse"></div>
                        <div className="h-5 bg-muted rounded w-16 animate-pulse"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          <div className="h-6 w-6 bg-muted rounded-full animate-pulse"></div>
                          <div className="h-6 w-6 bg-muted rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 bg-muted rounded-full animate-pulse"></div>
                          <div className="flex gap-2">
                            <div className="h-3 w-3 bg-muted rounded animate-pulse"></div>
                            <div className="h-3 w-3 bg-muted rounded animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
