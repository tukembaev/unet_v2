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
  BookMarked,
  PieChart as PieChartIcon,
  Briefcase,
  Building2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ROUTES } from "app/providers/routes";
import { UserEditModal } from "features/user-menu";
import { ProfileContextPicker } from "features/auth";
import { useCurrentUser } from "entities/user";
import { ThemeSelector } from "./ThemeSelector";
import { performLogout } from "shared/lib/auth-utils";
import {
  getActiveContext,
  getAppHomePath,
} from "shared/lib/auth-context";
import { logoutRequest } from "features/auth/model/api";

export function UserMenu() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useCurrentUser();
  const [contextPickerOpen, setContextPickerOpen] = useState(false);
  const context = getActiveContext();

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
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 12) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
    }
    return phone;
  };

  const getMainEmployment = () => {
    return user?.employee_profile?.employments?.find(
      (emp) => emp.employment_type === "MAIN" && emp.is_active
    );
  };

  const kpiValue = 0;
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
  const roleLabel =
    context === "student"
      ? "Студент"
      : mainEmployment?.position || "Сотрудник";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Открыть меню пользователя"
            className="group flex items-center gap-2 rounded-xl border border-transparent px-1.5 py-1 transition-colors hover:border-border/70 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-primary sm:gap-3 sm:px-2 sm:py-1.5"
          >
            <Avatar className="h-8 w-8 rounded-full ring-1 ring-border/60 sm:h-9 sm:w-9">
              <AvatarImage src={user.avatar_url || undefined} alt={fullName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user.first_name, user.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col text-left text-sm leading-tight">
              <span className="truncate font-semibold">{fullName}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-[min(100vw-1.5rem,320px)] rounded-3xl border border-border/70 bg-background/95 p-2.5 shadow-xl backdrop-blur"
        >
          <Card className="relative overflow-hidden rounded-[22px] border-none bg-card shadow-none">
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
                <AvatarImage
                  src={user.avatar_url || undefined}
                  alt={fullName}
                />
                <AvatarFallback>
                  {getInitials(user.first_name, user.last_name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 pr-1">
                <CardTitle className="truncate text-sm font-semibold">
                  {fullName}
                </CardTitle>
                <CardDescription className="truncate text-xs text-muted-foreground">
                  {roleLabel}
                </CardDescription>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                {user.is_active ? "online" : "offline"}
              </span>
            </CardHeader>

            <CardContent className="relative z-10 mt-2 flex flex-col gap-3 px-3 pb-3 pt-1">
              {context === "employee" && kpiValue > 0 && (
                <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/30 p-2.5">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${efficiencyColor}`}
                  >
                    <PieChartIcon className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-semibold leading-none">
                      {kpiValue}
                    </p>
                    <p className="text-xs text-muted-foreground">Баллы KPI</p>
                  </div>
                </div>
              )}

              {context === "employee" && (
                <a
                  href="https://ureport.kstu.kg/personalcard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/80 bg-muted/40 px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <BarChart2 className="h-4 w-4" />
                  Личная карточка
                </a>
              )}

              <div className="space-y-1 rounded-2xl border border-border/60 bg-muted/20 p-2.5">
                {user.phone_number && (
                  <div className="flex items-center gap-2.5 rounded-lg px-1 py-1.5">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formatPhoneNumber(user.phone_number)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2.5 rounded-lg px-1 py-1.5">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {context === "employee" && mainEmployment && (
                  <>
                    <div className="flex items-center gap-2.5 rounded-lg px-1 py-1.5">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{mainEmployment.position}</span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-lg px-1 py-1.5">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {mainEmployment.organization_name}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full justify-center gap-2 border-border/80 bg-muted/40"
                asChild
              >
                <a
                  href={ROUTES.LMS}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BookMarked className="h-4 w-4" />
                  Перейти в LMS
                </a>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full justify-center gap-2 border-border/80 bg-muted/40"
                onClick={() => setContextPickerOpen(true)}
              >
                <Users className="h-4 w-4" />
                Сменить профиль
              </Button>

              <div className="mt-1">
                <ThemeSelector />
              </div>

              <div className="mt-1 flex items-center justify-between gap-2">
                <UserEditModal
                  user={user}
                  position={roleLabel}
                />

                <Button
                  onClick={onLogout}
                  variant="secondary"
                  className="flex flex-1 items-center justify-center gap-2 border border-border/70 bg-muted/40 hover:bg-muted"
                >
                  <LogOut className="h-4 w-4" />
                  Выйти
                </Button>
              </div>
            </CardContent>
          </Card>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileContextPicker
        open={contextPickerOpen}
        onOpenChange={setContextPickerOpen}
        onComplete={async () => {
          await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
          navigate(getAppHomePath(), { replace: true });
        }}
      />
    </>
  );
}
