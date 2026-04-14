import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  Avatar,
  AvatarFallback,
  AvatarImage,
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
import { useNavigate } from "react-router-dom";
import { UserEditModal } from "features/user-menu";
import { useCurrentUser } from "entities/user";
import { ThemeSelector } from "./ThemeSelector";
import { performLogout } from "shared/lib/auth-utils";
import { logoutRequest } from "features/auth/model/api";





// ⚙️ Главное меню пользователя
export function UserMenu() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useCurrentUser();
  const onLogout = async () => {
    try {
      await logoutRequest();
    } finally {
      performLogout();
      navigate("/", { replace: true });
    }
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
          className="group flex items-center gap-3 rounded-xl border border-transparent px-2 py-1.5 transition-colors hover:border-border/70 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <Avatar className="h-9 w-9 rounded-full ring-1 ring-border/60">
            <AvatarImage src={user.avatar_url || undefined} alt={fullName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.first_name, user.last_name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col text-left text-sm leading-tight">
            <span className="truncate font-semibold">{fullName}</span>
            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[320px] rounded-3xl border border-border/70 bg-background/95 p-2.5 shadow-xl backdrop-blur"
      >
        <Card className="relative overflow-hidden rounded-[22px] border-none shadow-none bg-card">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-40"
            style={{
              background:
                "radial-gradient(65% 90% at 50% 10%, rgb(59 130 246 / 0.35) 0%, transparent 80%)",
            }}
            aria-hidden
          />
          <CardHeader className="relative z-10 flex flex-row items-center gap-3 rounded-2xl border border-border/60 bg-muted/40 px-3 py-2.5">
            <Avatar className="h-10 w-10 rounded-full ring-1 ring-border/80">
              <AvatarImage src={user.avatar_url || undefined} alt={fullName} />
              <AvatarFallback>{getInitials(user.first_name, user.last_name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 pr-1">
              <CardTitle className="truncate text-sm font-semibold">
                {fullName}
              </CardTitle>
              <CardDescription className="truncate text-xs text-muted-foreground">
                {mainEmployment?.position || "Сотрудник"}
              </CardDescription>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {user.is_active ? "online" : "offline"}
            </span>
          </CardHeader>

          <CardContent className="relative z-10 mt-2 flex flex-col gap-3 px-3 pb-3 pt-1">
            {kpiValue > 0 && (
              <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/30 p-2.5">
                <div className={`w-12 h-12 flex items-center justify-center rounded-full ${efficiencyColor}`}>
                  <PieChartIcon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-semibold leading-none">{kpiValue}</p>
                  <p className="text-xs text-muted-foreground">Баллы KPI</p>
                </div>
              </div>
            )}

            <a
              href="https://ureport.kstu.kg/personalcard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/80 bg-muted/40 px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <BarChart2 className="w-4 h-4" />
              Личная карточка
            </a>

            <div className="space-y-1 rounded-2xl border border-border/60 bg-muted/20 p-2.5">
              {user.phone_number && (
                <div className="flex items-center gap-2.5 rounded-lg px-1 py-1.5">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatPhoneNumber(user.phone_number)}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5 rounded-lg px-1 py-1.5">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              {mainEmployment && (
                <>
                  <div className="flex items-center gap-2.5 rounded-lg px-1 py-1.5">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{mainEmployment.position}</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg px-1 py-1.5">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{mainEmployment.organization_name}</span>
                  </div>
                </>
              )}
            </div>

            {/* Theme Selector - удлиненная кнопка */}
            <div className="mt-1">
              <ThemeSelector />
            </div>

            {/* Кнопки "Настройки" и "Выйти" */}
            <div className="mt-1 flex items-center justify-between gap-2">
              <UserEditModal
                user={user}
                position={mainEmployment?.position || "Сотрудник"}
              />

              <Button
                onClick={onLogout}
                variant="secondary"
                className="flex flex-1 items-center justify-center gap-2 border border-border/70 bg-muted/40 hover:bg-muted"
              >
                <LogOut className="w-4 h-4" />
                Выйти
              </Button>
            </div>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
