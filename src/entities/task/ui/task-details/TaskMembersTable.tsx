import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableHead, TableRow, TableCell, Avatar, AvatarImage, AvatarFallback, Badge, Button } from "shared/ui";
import { Plus, Users } from "lucide-react";
import { TaskMember } from "../../model/types";
import { EmptyState } from "shared/components/EmptyState";
import { useFormNavigation, FormQuery } from "shared/lib";

interface TaskMembersTableProps {
  members: TaskMember[];
  taskId: string;
  canAddMembers: boolean;
}

const TaskMembersTable = ({ members, taskId, canAddMembers }: TaskMembersTableProps) => {
  const openForm = useFormNavigation();

  const getMemberStatus = (isOnline: boolean) => {
    return isOnline ? "Онлайн" : "Офлайн";
  };

  const getStatusBadgeVariant = (isOnline: boolean) => {
    return isOnline ? "default" : "secondary";
  };

  const handleAddMember = () => {
    openForm(FormQuery.ADD_TASK_MEMBERS, { task_id: taskId }, { syncUrl: false });
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 ">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Участники
        </CardTitle>
        {canAddMembers && (
          <Button size="sm" variant="outline" onClick={handleAddMember}>
            <Plus className="h-4 w-4" />
            Добавить участника
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Участники отсутствуют"
            description="К этой задаче еще не добавлены участники"
          />
        ) : (
          <div className="w-full overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Сотрудник</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead>Электронный адрес</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => {
                  return (
                    <TableRow key={member.user_id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar_url} alt={member.user_name} />
                            <AvatarFallback>
                              {member.user_name
                                .split(' ')
                                .filter(Boolean)
                                .map(n => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{member.user_name}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(member.is_online)}>
                          {getMemberStatus(member.is_online)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{member.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{member.email || "-"}</span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskMembersTable;

