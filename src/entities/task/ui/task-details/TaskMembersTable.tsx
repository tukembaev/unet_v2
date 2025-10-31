import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableHead, TableRow, TableCell, Avatar, AvatarImage, AvatarFallback, Badge } from "shared/ui";
import { Users } from "lucide-react";
import { Member } from "../../model/types";

interface TaskMembersTableProps {
  members: Member[];
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
                  const user = member.member;
                  if (!user) return null;

                  return (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.imeag} alt={user.surname_name} />
                            <AvatarFallback>
                              {user.first_name[0]}{user.surname[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.surname_name}</span>
                            <span className="text-xs text-muted-foreground">
                              {user.position} {user.division ? `• ${user.division}` : ''}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(user.is_online)}>
                          {getMemberStatus(user.is_online)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{member.member_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{user.email || "-"}</span>
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

