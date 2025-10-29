import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  Avatar,
  AvatarFallback,
} from "shared/ui";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "shared/ui";
import { Button } from "shared/ui/button";
import {
  Phone,
  Mail,
  LogOut,
  BarChart2,
  PieChart as PieChartIcon,
} from "lucide-react";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserEditModal } from "features/user-menu";





// ⚙️ Главное меню пользователя
export function UserMenu() {
  const navigate = useNavigate();
  const [user] = useState({
    first_name: "Иван",
    surname: "Иванов",
    position: "Frontend Developer",
    division: "IT-отдел",
    email: "ivan@example.com",
    number_phone: "+996 555 123 456",
    imeag: "https://i.pinimg.com/736x/c5/bc/11/c5bc1152a080c8e02fc2b62ff0a416b1.jpg",
    background: "/bg.jpg",
    kpi: 87,
  });

  const onLogout = () => {
    navigate("/");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("pin");
  };

  const {
    first_name,
    surname,
    position,
    email,
    number_phone,
    imeag,
    division,
    kpi,
  } = user;

  const kpiValue = Number(kpi ?? 0);
  const efficiencyColor =
    kpiValue <= 40
      ? "bg-red-100 text-red-600"
      : kpiValue <= 80
      ? "bg-yellow-100 text-yellow-600"
      : "bg-green-100 text-green-600";

  const getInitials = (name?: string) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "UU";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Открыть меню пользователя"
          className="flex items-center gap-3 rounded-md px-2 py-1 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <Avatar className="h-9 w-9 rounded-full">
            <AvatarImage src={imeag} alt={first_name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(first_name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col text-left text-sm leading-tight">
            <span className="truncate font-medium">{first_name}</span>
            <span className="truncate text-xs text-muted-foreground">{email}</span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 p-2 rounded-3xl shadow-none">
        <Card className="relative overflow-hidden border-none shadow-none">
          <CardHeader className="relative z-10 border rounded-3xl flex justify-between flex-row items-center gap-2 pb-2 pt-2 px-3">
            <Avatar className="h-9 w-9 rounded-full">
              <AvatarImage src={imeag} alt={first_name} />
              <AvatarFallback>{getInitials(first_name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 px-2">
              <CardTitle className="text-sm font-semibold">
                {first_name} {surname}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {position}
              </CardDescription>
            </div>
            <span className="text-xs text-emerald-500 font-medium">online</span>
          </CardHeader>

          <CardContent className="relative z-10 flex flex-col border rounded-3xl mt-2 gap-3 px-3 py-3">
            <div className="flex items-center gap-3 border p-2 rounded-3xl">
              <div className={`w-12 h-12 flex items-center justify-center rounded-full ${efficiencyColor}`}>
                <PieChartIcon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold leading-none">{kpiValue}</p>
                <p className="text-xs text-muted-foreground">Баллы KPI</p>
              </div>
            </div>

            <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
              <BarChart2 className="w-4 h-4" />
              Личная карточка
            </Button>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 py-1 px-1">
                <Phone className="w-4 h-4 text-slate-500" />
                <span className="text-sm">{number_phone}</span>
              </div>
              <div className="flex items-center gap-2 py-1 px-1">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="text-sm">{email}</span>
              </div>
            </div>

            {/* Кнопка "Настройки" открывает модалку */}
            <div className="flex items-center justify-between gap-2 mt-2">
            <UserEditModal user={user} />

            <Button
              onClick={onLogout}
              variant="secondary"
              className="flex items-center gap-2 w-full justify-center"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-2">
              {division}
            </p>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
