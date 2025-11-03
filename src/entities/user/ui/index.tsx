import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "shared/ui/card";
import { Button } from "shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "shared/ui/avatar";
// import { Separator } from "shared/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "shared/ui/tabs";
import {
  Mail,
  Phone,
  Briefcase,
  Building2,
  FileText,
  UserRound,
} from "lucide-react";
import { cn } from "shared/lib/utils";
import { IUser } from "../model/types";

interface UserCardProps {
  user: IUser;
  className?: string;
}

export const UserCard = ({ user, className }: UserCardProps) => {
  const fullName = `${user.first_name} ${user.surname ?? ""} ${
    user.last_name ?? ""
  }`.trim();

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <Card
      className={cn(
        "w-full border shadow-sm rounded-2xl p-6 flex flex-col gap-6",
        className
      )}
    >
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Фото пользователя */}
        <Avatar className="h-28 w-28">
          <AvatarImage
            src={
              user.image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                fullName
              )}&background=E5E7EB&color=374151`
            }
            alt={fullName}
          />
          <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
        </Avatar>

        {/* Основная информация */}
        <div className="flex-1 space-y-1">
          <CardTitle className="text-2xl font-semibold leading-tight">
            {fullName || "Без имени"}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {user.position || "Должность не указана"}
          </CardDescription>
          <CardDescription className="text-sm text-muted-foreground">
            {user.department || "Подразделение не указано"}
          </CardDescription>
        </div>

        {/* Кнопки */}
        <div className="flex gap-2 mt-3 md:mt-0">
          <Button variant="secondary" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Личный листок
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <UserRound className="w-4 h-4" />
            Формировать резюме
          </Button>
        </div>
      </CardHeader>

      {/* <Separator /> */}

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <span>{user.email || "Не указан"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span>{user.phone || "Не указан"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Briefcase className="w-4 h-4 text-muted-foreground" />
          <span>{user.position || "Не указано"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          <span>{user.department || "Не указано"}</span>
        </div>
      </CardContent>

      {/* Табы для доп. данных */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-2 w-full rounded-2xl">
          <TabsTrigger value="personal" className="text-sm">
            Персональные данные
          </TabsTrigger>
          <TabsTrigger value="science" className="text-sm">
            Научная деятельность
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-4 text-sm text-muted-foreground">
          Здесь будет информация о персональных данных пользователя.
        </TabsContent>

        <TabsContent value="science" className="mt-4 text-sm text-muted-foreground">
          Здесь будет информация о научной и исследовательской активности.
        </TabsContent>
      </Tabs>
    </Card>
  );
};
