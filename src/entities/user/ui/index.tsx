import React from "react";
import { Card, CardHeader, CardContent, CardFooter, Badge, Button } from "shared/ui";
import { Mail, Phone, Briefcase, Building2, User2, GraduationCap, FileText, Settings } from "lucide-react";
import type { IUser } from "../model/types";
import { cn } from "shared/lib";

interface Props {
  user: IUser;
}

export const UserCard: React.FC<Props> = ({ user }) => {
  const isStudent = user.role === "student";
  const isTeacher = user.role === "teacher";
  const isEmployee = user.role === "employee";

  return (
    <Card className="rounded-2xl border bg-card text-card-foreground shadow-md overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6">
        <div className="flex items-center gap-4">
          <img
            src={user.image}
            alt={user.first_name}
            className="w-24 h-24 rounded-xl object-cover "
          />
          <div>
            <h2 className="text-xl font-semibold">{`${user.first_name} ${user.last_name}`}</h2>
            <Badge
              variant="secondary"
              className={cn(
                "capitalize mt-1",
                isStudent && "bg-emerald-600 text-white",
                isTeacher && "bg-blue-600 text-white",
                isEmployee && "bg-slate-600 text-white"
              )}
            >
              {isStudent
                ? "Студент"
                : isTeacher
                ? "Преподаватель"
                : "Сотрудник"}
            </Badge>
            <p className="text-sm text-muted-foreground mt-1">{user.position}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings size={16} /> Редактировать
          </Button>
          <Button variant="default" className="flex items-center gap-2">
            <FileText size={16} /> Скачать профиль
          </Button>
        </div>
      </CardHeader>

      <div className="w-full h-px bg-border" />


      <CardContent className="p-6 grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <Mail size={18} className="text-muted-foreground" />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={18} className="text-muted-foreground" />
          <span>{user.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase size={18} className="text-muted-foreground" />
          <span>{user.position || "—"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 size={18} className="text-muted-foreground" />
          <span>{user.department || "—"}</span>
        </div>
      </CardContent>

      <div className="w-full h-px bg-border" />


      <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 p-6">
        {isStudent && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Успеваемость</h3>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">Средний балл: 89%</Badge>
              <Badge variant="secondary">Активных курсов: 6</Badge>
            </div>
          </div>
        )}

        {isTeacher && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Научная деятельность</h3>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <span>🧾 5 опубликованных статей</span>
              <span>📘 Руководитель 2 дипломных проектов</span>
            </div>
          </div>
        )}

        {isEmployee && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Документы</h3>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <span>📄 Паспортные данные заполнены</span>
              <span>🩺 Медосмотр пройден (2025)</span>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
