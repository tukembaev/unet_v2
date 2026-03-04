import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableHead, TableRow, TableCell, Avatar, AvatarImage, AvatarFallback, Badge } from "shared/ui";
import { Users } from "lucide-react";
import { TaskMember } from "../../model/types";

interface TaskMembersTableProps {
  members: TaskMember[];
}

const TaskMembersTable = ({ members }: TaskMembersTableProps) => {
  const getMemberStatus = (isOnline: boolean) => {
    return isOnline ? "Онлайн" : "Офлайн";
  };

  const getStatusBadgeVariant = (isOnline: boolean) => {
    return isOnline ? "default" : "secondary";
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Участники
        </CardTitle>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Участники отсутствуют
          </p>
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

