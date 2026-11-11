import { useCallback, useState } from "react";
import { Calendar, KeyRound, Mail, Phone, Search, UserRound } from "lucide-react";
import { toast } from "sonner";

import { useEmployeeDetail, useEmployees, useResetPassword } from "../model/queries";
import type { Employee, EmployeeFilters, ID } from "../model/types";
import { UserPermissionsEditor } from "./UserPermissionsEditor";
import { getHttpErrorMessage } from "shared/lib/http-error";
import { cn } from "shared/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "shared/ui";

function initials(fullName?: string) {
  if (!fullName) return "UU";
  const parts = fullName.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "UU";
}

function employmentTypeLabel(type?: string | null): string {
  if (!type) return "—";
  const labels: Record<string, string> = {
    MAIN: "Основное",
    PART_TIME: "Совместительство",
  };
  return labels[type.toUpperCase()] ?? type;
}

function ProfileStatusBadge({
  isActive,
  activeLabel = "Активен",
  inactiveLabel = "Неактивен",
}: {
  isActive?: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        isActive
          ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          : "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-400"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isActive ? "bg-emerald-500" : "bg-rose-500"
        )}
        aria-hidden
      />
      {isActive ? activeLabel : inactiveLabel}
    </Badge>
  );
}

function ProfileDetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-3 py-2.5">
      <span className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        {label}
      </span>
      <div className="min-w-0 text-right text-sm font-medium">{children}</div>
    </div>
  );
}

function ItDepartmentTableSkeleton() {
  return (
    <>
      <div className="grid gap-2 md:hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-36" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-44" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-8 w-36" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function Pager({
  total,
  page,
  size,
  onChange,
}: {
  total: number;
  page: number;
  size: number;
  onChange: (p: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / size));
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Назад
      </Button>
      <div className="min-w-[72px] text-center text-sm tabular-nums text-muted-foreground">
        {page} / {pages}
      </div>
      <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>
        Далее
      </Button>
    </div>
  );
}

export default function ItDepartment() {
  const [filters, setFilters] = useState<EmployeeFilters>({ page: 1, size: 15, search: "" });
  const { data, isLoading, isFetching } = useEmployees(filters);
  const resetPassword = useResetPassword(filters);
  const [selectedUserId, setSelectedUserId] = useState<ID | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { data: detail, isLoading: isDetailLoading } = useEmployeeDetail(selectedUserId);

  const total = data?.total ?? 0;
  const employees = data?.items ?? [];

  const onSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((s) => ({ ...s, search: e.target.value, page: 1 }));
  }, []);

  const handleResetPassword = async (userId: string | number, fullName: string) => {
    try {
      await resetPassword.mutateAsync(userId);
      toast.success(`Пароль для «${fullName}» сброшен`);
    } catch (e) {
      toast.error("Не удалось сбросить пароль", {
        description: getHttpErrorMessage(e),
      });
    }
  };

  const openDetails = (employee: Employee) => {
    setSelectedUserId(employee.id);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="rounded-2xl border border-border/70 bg-gradient-to-b from-muted/30 to-background p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              IT Department
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Все сотрудники:{" "}
              <span className="font-medium tabular-nums text-foreground">
                {total}
              </span>
              {isFetching ? " · обновление…" : null}
            </p>
          </div>
          <div className="flex w-full items-center gap-2 rounded-xl border border-border/70 bg-background px-3 sm:w-auto">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              value={filters.search ?? ""}
              onChange={onSearch}
              placeholder="Поиск по ФИО / email / username"
              className="h-9 w-full border-0 px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none sm:w-72"
            />
          </div>
        </div>
      </div>

      {isLoading && employees.length === 0 ? (
        <ItDepartmentTableSkeleton />
      ) : (
        <>
          {/* Mobile cards */}
          <div className="grid gap-2 md:hidden">
            {employees.length ? (
              employees.map((e) => (
                <button
                  key={String(e.id)}
                  type="button"
                  className="rounded-2xl border border-border/70 bg-card p-3 text-left shadow-sm transition hover:bg-muted/20"
                  onClick={() => openDetails(e)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 border border-border/60">
                      <AvatarImage
                        src={e.avatar_url || undefined}
                        alt={e.full_name}
                      />
                      <AvatarFallback>{initials(e.full_name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="truncate text-sm font-medium">
                        {e.full_name || "—"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        @{e.username || "—"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {e.email || "—"}
                      </p>
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span
                          className={
                            e.is_active ? "text-xs text-emerald-600" : "text-xs text-rose-600"
                          }
                        >
                          {e.is_active ? "Активен" : "Неактивен"}
                        </span>
                        <Button
                          size="sm"
                          className="h-8 gap-1.5 rounded-xl px-2.5 text-xs"
                          onClick={(event) => {
                            event.stopPropagation();
                            void handleResetPassword(
                              e.id,
                              e.full_name || e.username
                            );
                          }}
                          disabled={resetPassword.isPending}
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                          Сброс
                        </Button>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 py-10 text-center text-sm text-muted-foreground">
                Нет сотрудников по заданному фильтру
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Сотрудник</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Контакты</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действие</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length ? (
                  employees.map((e) => (
                    <TableRow
                      key={String(e.id)}
                      className="cursor-pointer hover:bg-muted/20"
                      onClick={() => openDetails(e)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-border/60">
                            <AvatarImage
                              src={e.avatar_url || undefined}
                              alt={e.full_name}
                            />
                            <AvatarFallback>
                              {initials(e.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {e.full_name || "—"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {e.username || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="inline-flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />
                            {e.email || "—"}
                          </div>
                          <div className="inline-flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" />
                            {e.phone_number || "—"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            e.is_active ? "text-emerald-600" : "text-rose-600"
                          }
                        >
                          {e.is_active ? "Активен" : "Неактивен"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          className="gap-2 rounded-xl"
                          onClick={(event) => {
                            event.stopPropagation();
                            void handleResetPassword(
                              e.id,
                              e.full_name || e.username
                            );
                          }}
                          disabled={resetPassword.isPending}
                        >
                          <KeyRound className="h-4 w-4" />
                          Сбросить пароль
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-muted-foreground"
                    >
                      Нет сотрудников по заданному фильтру
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <div className="flex justify-center sm:justify-end">
        <Pager
          total={total}
          size={filters.size ?? 15}
          page={filters.page ?? 1}
          onChange={(p) => setFilters((s) => ({ ...s, page: p }))}
        />
      </div>

      <Dialog
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open);
          if (!open) setSelectedUserId(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:max-w-xl sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Профиль сотрудника
            </DialogTitle>
          </DialogHeader>

          {isDetailLoading || !detail ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-2xl bg-muted/30 p-3">
                <Avatar className="h-14 w-14 border border-border/60">
                  <AvatarImage
                    src={detail.avatar_url || undefined}
                    alt={detail.full_name}
                  />
                  <AvatarFallback>{initials(detail.full_name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    {detail.full_name || "—"}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    @{detail.username || "—"}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70 bg-muted/10">
                <ProfileDetailRow icon={Mail} label="Email">
                  <span className="truncate">{detail.email || "—"}</span>
                </ProfileDetailRow>
                <ProfileDetailRow icon={Phone} label="Телефон">
                  <span className="truncate">{detail.phone_number || "—"}</span>
                </ProfileDetailRow>
                <ProfileDetailRow icon={Calendar} label="Дата рождения">
                  {detail.birth_date || "—"}
                </ProfileDetailRow>
                <ProfileDetailRow icon={UserRound} label="Статус профиля">
                  <ProfileStatusBadge
                    isActive={detail.employee_profile?.is_active}
                  />
                </ProfileDetailRow>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Трудоустройства</p>
                {detail.employee_profile?.employments?.length ? (
                  <div className="space-y-2">
                    {detail.employee_profile.employments.map((employment) => (
                      <div
                        key={employment.id}
                        className="rounded-2xl border border-border/70 bg-muted/20 p-3 text-sm"
                      >
                        <div className="font-medium">
                          {employment.organization_name || "—"}
                        </div>
                        <div className="text-muted-foreground">
                          {employment.position || "—"}
                        </div>
                        <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
                          <div>
                            <b>Ставка:</b> {employment.rate ?? "—"}
                          </div>
                          <div>
                            <b>Тип:</b>{" "}
                            {employmentTypeLabel(employment.employment_type)}
                          </div>
                          <div>
                            <b>Начало:</b> {employment.start_date || "—"}
                          </div>
                          <div>
                            <b>Окончание:</b>{" "}
                            {employment.end_date || "по настоящее время"}
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <b>Статус:</b>
                            <ProfileStatusBadge
                              isActive={employment.is_active}
                              activeLabel="Активно"
                              inactiveLabel="Неактивно"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed p-3 text-sm text-muted-foreground">
                    Нет данных о трудоустройствах
                  </div>
                )}
              </div>

              {selectedUserId != null ? (
                <UserPermissionsEditor
                  userId={selectedUserId}
                  activePermissionSlugs={detail?.permissions ?? []}
                  isLoadingPermissions={isDetailLoading}
                  enabled={detailsOpen}
                />
              ) : null}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
