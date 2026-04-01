import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  Avatar,
  AvatarFallback,
  Skeleton,
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
  Briefcase,
  Building2,
} from "lucide-react";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";
import { UserEditModal } from "features/user-menu";
import { useCurrentUser } from "entities/user";
import { ThemeSelector } from "./ThemeSelector";
import { performLogout } from "shared/lib/auth-utils";





// ⚙️ Главное меню пользователя
export function UserMenu() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useCurrentUser();
  console.log(user)
  const onLogout = () => {
    performLogout();
    navigate("/", { replace: true });
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "UU";
    const initials = [firstName?.[0], lastName?.[0]].filter(Boolean).join("");
    return initials.toUpperCase() || "UU";
  };

  const formatPhoneNumber = (phone?: string) => {
    if (!phone) return "";
    // Форматируем номер телефона в формат +996 XXX XXX XXX
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 12) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
    }
    return phone;
  };

  const getMainEmployment = () => {
    return user?.employee_profile?.employments?.find(emp => emp.employment_type === "MAIN" && emp.is_active);
  };

  const kpiValue = 0; // KPI пока не приходит из API
  const efficiencyColor =
    kpiValue <= 40
      ? "bg-red-100 text-red-600"
      : kpiValue <= 80
      ? "bg-yellow-100 text-yellow-600"
      : "bg-green-100 text-green-600";

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 px-2 py-1">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="hidden md:flex flex-col gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const mainEmployment = getMainEmployment();
  const fullName = `${user.first_name} ${user.last_name}`.trim();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Открыть меню пользователя"
          className="flex items-center gap-3 rounded-md px-2 py-1 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <Avatar className="h-9 w-9 rounded-full">
            <AvatarImage src={user.avatar_url || undefined} alt={fullName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.first_name, user.last_name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col text-left text-sm leading-tight">
            <span className="truncate font-medium">{fullName}</span>
            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 p-2 rounded-3xl shadow-none bg-background">
        <Card className="relative overflow-hidden border-none shadow-none bg-card">
          <CardHeader className="relative z-10 border rounded-3xl flex justify-between flex-row items-center gap-2 pb-2 pt-2 px-3 bg-muted/50">
            <Avatar className="h-9 w-9 rounded-full">
              <AvatarImage src={user.avatar_url || undefined} alt={fullName} />
              <AvatarFallback>{getInitials(user.first_name, user.last_name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 px-2">
              <CardTitle className="text-sm font-semibold">
                {fullName}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {mainEmployment?.position || "Сотрудник"}
              </CardDescription>
            </div>
            <span className="text-xs text-emerald-500 font-medium">
              {user.is_active ? "online" : "offline"}
            </span>
          </CardHeader>

          <CardContent className="relative z-10 flex flex-col rounded-3xl mt-2 gap-3 px-3 py-3 bg-card">
            {kpiValue > 0 && (
              <div className="flex items-center gap-3 border p-2 rounded-3xl">
                <div className={`w-12 h-12 flex items-center justify-center rounded-full ${efficiencyColor}`}>
                  <PieChartIcon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-semibold leading-none">{kpiValue}</p>
                  <p className="text-xs text-muted-foreground">Баллы KPI</p>
                </div>
              </div>
            )}

            <Button variant="secondary" onClick={() => navigate('profile-card')} className="w-full flex items-center justify-center gap-2">
              <BarChart2 className="w-4 h-4" />
              Личная карточка
            </Button>

            <div className="flex flex-col gap-2">
              {user.phone_number && (
                <div className="flex items-center gap-2 py-1 px-1">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span className="text-sm">{formatPhoneNumber(user.phone_number)}</span>
                </div>
              )}
              <div className="flex items-center gap-2 py-1 px-1">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="text-sm">{user.email}</span>
              </div>
              {mainEmployment && (
                <>
                  <div className="flex items-center gap-2 py-1 px-1">
                    <Briefcase className="w-4 h-4 text-slate-500" />
                    <span className="text-sm">{mainEmployment.position}</span>
                  </div>
                  <div className="flex items-center gap-2 py-1 px-1">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span className="text-sm">{mainEmployment.organization_name}</span>
                  </div>
                </>
              )}
            </div>

            {/* Theme Selector - удлиненная кнопка */}
            <div className="mt-2">
              <ThemeSelector />
            </div>

            {/* Кнопки "Настройки" и "Выйти" */}
            <div className="flex items-center justify-between gap-2 mt-2">
              <UserEditModal 
                user={{
                  first_name: user.first_name,
                  surname: user.last_name,
                  email: user.email,
                  number_phone: user.phone_number || "",
                  position: mainEmployment?.position || "",
                }} 
              />

              <Button
                onClick={onLogout}
                variant="secondary"
                className="flex items-center gap-2 flex-1 justify-center"
              >
                <LogOut className="w-4 h-4" />
                Выйти
              </Button>
            </div>

            {user.username && (
              <p className="text-center text-xs text-muted-foreground mt-2">
                @{user.username}
              </p>
            )}
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
