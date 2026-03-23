import { Card, CardContent, CardHeader, CardTitle, Button, Table, TableHeader, TableBody, TableHead, TableRow, TableCell, Badge } from "shared/ui";
import { Plus, ClipboardList } from "lucide-react";
import { TaskSubtask } from "../../model/types";
import { EmptyState } from "shared/components/EmptyState";
import { useFormNavigation, formatDate } from "shared/lib";
import { FormQuery } from "shared/lib/form-navigation";

interface TaskSubtasksTableProps {
  subtasks: TaskSubtask[];
  taskId: string;
  onSubtaskClick?: (subtaskId: string) => void;
  canAddSubtasks: boolean;
}

const TaskSubtasksTable = ({ subtasks, taskId, onSubtaskClick, canAddSubtasks }: TaskSubtasksTableProps) => {
  const openForm = useFormNavigation();

  const handleAddSubtask = () => {
    // Открываем форму создания задачи, оставаясь на текущей странице (без изменения URL)
    openForm(FormQuery.CREATE_TASK, { task_id: taskId }, { syncUrl: false });
  };

  const handleRowClick = (subtaskId: string) => {
    onSubtaskClick?.(subtaskId);
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          Подзадачи
        </CardTitle>
        {canAddSubtasks && (
          <Button onClick={handleAddSubtask} size="sm" variant="outline">
            <Plus className="h-4 w-4" />
            Добавить подзадачу
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {subtasks.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Подзадачи отсутствуют"
            description="К этой задаче еще не добавлены подзадачи"
          />
        ) : (
          <div className="w-full overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Заголовок</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Ответственный</TableHead>
                  <TableHead>Поставлена</TableHead>
                  <TableHead>Крайний срок</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subtasks.map((subtask) => (
                  <TableRow 
                    key={subtask.id}
                    className={onSubtaskClick ? "cursor-pointer hover:bg-muted/50" : ""}
                    onClick={() => handleRowClick(subtask.id)}
                  >
                    <TableCell className="font-medium">
                      {subtask.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {subtask.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{subtask.members[0].user_name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatDate(subtask.created_at)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatDate(subtask.deadline_at)}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskSubtasksTable;

