import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TaskCard } from "./TaskCard";
import { TaskCategory, EmployeeTask, TaskStatus } from "../model/types";
import { TaskRole, TaskFilters } from "./TaskFilter";
import { useCurrentUser } from "entities/user";
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
  filters?: TaskFilters;
  searchQuery?: string;
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

// Определяем роль пользователя в задаче
const getUserRoleInTask = (task: EmployeeTask, userId?: string): TaskRole | null => {
  if (!userId) return null;

  // Проверяем, является ли пользователь ответственным
  if (task.responsible_user_id === userId) {
    return 'RESPONSIBLE';
  }

  // Проверяем роль в members
  const member = task.members?.find(m => m.user_id === userId);
  if (member) {
    if (member.role === 'CO_EXECUTOR') return 'EXECUTOR';
    if (member.role === 'OBSERVER') return 'OBSERVER';
    if (member.role === 'RESPONSIBLE') return 'RESPONSIBLE';
  }

  // Если пользователь не найден ни как ответственный, ни в members - он создатель
  return 'CREATOR';
};

// Фильтруем задачи по роли пользователя
const filterTasksByRole = (tasks: EmployeeTask[], roles: TaskRole[], userId?: string): EmployeeTask[] => {
  if (!roles || roles.length === 0 || !userId) return tasks;
  
  return tasks.filter(task => {
    const userRole = getUserRoleInTask(task, userId);
    return userRole && roles.includes(userRole);
  });
};

// Фильтруем задачи по поисковому запросу
const filterTasksBySearch = (tasks: EmployeeTask[], searchQuery: string): EmployeeTask[] => {
  if (!searchQuery || searchQuery.trim() === '') return tasks;
  
  const query = searchQuery.toLowerCase().trim();
  
  return tasks.filter(task => {
    // Поиск по названию задачи
    const titleMatch = task.title.toLowerCase().includes(query);
    
    // Поиск по имени ответственного
    const responsibleMatch = task.responsible_username?.toLowerCase().includes(query);
    
    // Поиск по именам участников
    const membersMatch = task.members?.some(member => 
      member.user_name.toLowerCase().includes(query)
    );
    
    return titleMatch || responsibleMatch || membersMatch;
  });
};

const KanbanBoardComponent: React.FC<KanbanBoardProps> = ({
  tasks,
  isLoading = false,
  filters,
  searchQuery = '',
}) => {
  const { data: currentUser } = useCurrentUser();
  const currentUserId = currentUser?.id;

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

  // Фильтруем и сортируем задачи
  const filteredAndSortedTasks = useMemo(() => {
    const result: TaskCategory = {
      PENDING: [],
      IN_PROGRESS: [],
      REVIEW: [],
      COMPLETED: [],
      CANCELED: [],
    };

    // Показываем все статусы
    const statusesToShow: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELED'];

    statusesToShow.forEach(status => {
      let statusTasks = tasks?.[status] || [];
      
      // Фильтруем по поисковому запросу
      if (searchQuery) {
        statusTasks = filterTasksBySearch(statusTasks, searchQuery);
      }
      
      // Фильтруем по роли
      if (filters?.roles && filters.roles.length > 0) {
        statusTasks = filterTasksByRole(statusTasks, filters.roles, currentUserId);
      }
      
      // Сортируем
      result[status] = sortTasks(statusTasks, sortModes[status]);
    });

    return result;
  }, [tasks, filters, sortModes, currentUserId, searchQuery]);

  if (isLoading) {
    return <KanbanSkeleton />;
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="container mx-auto flex gap-6 min-w-max">
        {sectionConfig.map((section, columnIndex) => {
          const sortedTasks = filteredAndSortedTasks[section.key];
          const taskCount = sortedTasks.length;
          const currentSortMode = sortModes[section.key];

          return (
            <motion.div
              key={section.key}
              className="w-80 flex-shrink-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: columnIndex * 0.05,
                ease: "easeOut"
              }}
            >
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
                  <AnimatePresence mode="popLayout">
                    {sortedTasks.length > 0 ? (
                      sortedTasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                          transition={{
                            duration: 0.25,
                            delay: index * 0.03,
                            ease: "easeOut",
                            layout: { duration: 0.3, ease: "easeInOut" }
                          }}
                        >
                          <TaskCard task={task} currentUserId={currentUserId} />
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
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
