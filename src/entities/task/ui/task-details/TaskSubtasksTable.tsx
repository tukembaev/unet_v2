import { Card, CardContent, CardHeader, CardTitle, Button, Table, TableHeader, TableBody, TableHead, TableRow, TableCell, Badge } from "shared/ui";
import { Plus, ClipboardList } from "lucide-react";
import { TaskSubtask } from "../../model/types";

interface TaskSubtasksTableProps {
  subtasks: TaskSubtask[];
  onSubtaskClick?: (subtaskId: number) => void;
}

const TaskSubtasksTable = ({ subtasks, onSubtaskClick }: TaskSubtasksTableProps) => {
  const handleAddSubtask = () => {
    // TODO: Implement add subtask logic
    console.log('Add subtask');
  };

  const handleRowClick = (subtaskId: number) => {
    onSubtaskClick?.(subtaskId);
  };

  const getResponsibleMembers = (subtask: TaskSubtask) => {
    const responsible = subtask.members_subtask
      .filter(m => m.member_type === "Ответственный")
      .map(m => m.member?.surname_name || "")
      .filter(Boolean);
    return responsible.join(", ") || "-";
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          Подзадачи
        </CardTitle>
        <Button onClick={handleAddSubtask} size="sm" variant="outline">
          <Plus className="h-4 w-4" />
          Добавить подзадачу
        </Button>
      </CardHeader>
      <CardContent>
        {subtasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Подзадачи отсутствуют
          </p>
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
                      {subtask.subtask_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {subtask.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{getResponsibleMembers(subtask)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{subtask.create_date}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{subtask.deadline_date}</span>
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

