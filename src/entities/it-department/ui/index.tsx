import { useCallback, useState } from "react";
import { KeyRound, Mail, Phone, Search } from "lucide-react";
import { toast } from "sonner";

import { useEmployeeDetail, useEmployees, useResetPassword } from "../model/queries";
import type { Employee, EmployeeFilters, ID } from "../model/types";
import { getHttpErrorMessage } from "shared/lib/http-error";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
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

function ItDepartmentTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
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
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-36" /></TableCell>
              <TableCell><Skeleton className="h-4 w-44" /></TableCell>
              <TableCell><Skeleton className="ml-auto h-8 w-36" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
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
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/70 bg-gradient-to-b from-muted/30 to-background p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">IT Department</h2>
            <p className="text-sm text-muted-foreground">
              Все сотрудники: <span className="font-medium text-foreground tabular-nums">{total}</span>
              {isFetching ? " · обновление…" : null}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-background px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={filters.search ?? ""}
              onChange={onSearch}
              placeholder="Поиск по ФИО / email / username"
              className="w-72 border-0 px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
            />
          </div>
        </div>
      </div>

      {isLoading && employees.length === 0 ? (
        <ItDepartmentTableSkeleton />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
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
                          <AvatarImage src={e.avatar_url || undefined} alt={e.full_name} />
                          <AvatarFallback>{initials(e.full_name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{e.full_name || "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{e.username || "—"}</TableCell>
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
                      <span className={e.is_active ? "text-emerald-600" : "text-rose-600"}>
                        {e.is_active ? "Активен" : "Неактивен"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={(event) => {
                          event.stopPropagation();
                          void handleResetPassword(e.id, e.full_name || e.username);
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
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Нет сотрудников по заданному фильтру
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex justify-end">
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
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Профиль сотрудника</DialogTitle>
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
              <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                <Avatar className="h-14 w-14 border border-border/60">
                  <AvatarImage src={detail.avatar_url || undefined} alt={detail.full_name} />
                  <AvatarFallback>{initials(detail.full_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{detail.full_name || "—"}</p>
                  <p className="text-sm text-muted-foreground">@{detail.username || "—"}</p>
                </div>
              </div>

              <div className="grid gap-2 text-sm">
                <div className="rounded-md border p-2"><b>Email:</b> {detail.email || "—"}</div>
                <div className="rounded-md border p-2"><b>Телефон:</b> {detail.phone_number || "—"}</div>
                <div className="rounded-md border p-2"><b>Дата рождения:</b> {detail.birth_date || "—"}</div>
                <div className="rounded-md border p-2">
                  <b>Статус профиля:</b> {detail.employee_profile?.is_active ? "Активен" : "Неактивен"}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Трудоустройства</p>
                {detail.employee_profile?.employments?.length ? (
                  <div className="space-y-2">
                    {detail.employee_profile.employments.map((employment) => (
                      <div key={employment.id} className="rounded-lg border border-border/70 bg-muted/20 p-3 text-sm">
                        <div className="font-medium">{employment.organization_name || "—"}</div>
                        <div className="text-muted-foreground">{employment.position || "—"}</div>
                        <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
                          <div><b>Ставка:</b> {employment.rate ?? "—"}</div>
                          <div><b>Тип:</b> {employment.employment_type || "—"}</div>
                          <div><b>Начало:</b> {employment.start_date || "—"}</div>
                          <div><b>Окончание:</b> {employment.end_date || "по настоящее время"}</div>
                          <div>
                            <b>Статус:</b> {employment.is_active ? "Активно" : "Неактивно"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                    Нет данных о трудоустройствах
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
