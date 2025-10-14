// it-department/ui/index.tsx

import * as React from "react";
import { useState, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "shared/ui/table";
import { Button } from "shared/ui/button";
import { Input } from "shared/ui/input";
import { cn } from "shared/lib";
import {
  useEmployees,
  useUpdateEmployee,
} from "../model/queries";
import { Employee, EmployeeFilters } from "../model/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "shared/ui/dialog"; 
import { PinModal } from "features/auth/ui/PinCodeModal";
import { toast } from "sonner";

// простая пагинация под серверную раздачу по 25
function Pager({
  total,
  page,
  onChange,
}: {
  total: number; // count
  page: number;
  onChange: (p: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / 25));
  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="outline" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Prev
      </Button>
      <div className="px-2 text-sm">{page} / {pages}</div>
      <Button variant="outline" disabled={page >= pages} onClick={() => onChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}

export default function ItDepartment() {
  const [filters, setFilters] = useState<EmployeeFilters>({ page: 1, search: "" });
  const { data, isLoading } = useEmployees(filters);
  const [showPinModal, setShowPinModal] = useState(false);
  // модал редактирования
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  // mutations
  const upd = useUpdateEmployee(filters);
  const total = data?.count ?? 0;
  const employees = data?.results ?? [];
  const onSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((s) => ({ ...s, search: e.target.value, page: 1 }));
  }, []);

  const openEdit = (emp: Employee) => {
    setEditTarget(emp);
    setFormPhone(emp.number_phone ?? "");
    setFormEmail(emp.email_person ?? "");
    setEditOpen(true);
  };

  const submitEdit = async () => {
    if (!editTarget) return;
    await upd.mutateAsync({ id: editTarget.id, payload: { number_phone: formPhone, email: formEmail } });
    setEditOpen(false);
    toast.success("Контакты обновлены");
  };




  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">IT департамент</h2>
          <p className="text-sm text-muted-foreground">
            Сейчас работают в системе {total} сотрудников
          </p>
        </div>
        <div className="flex items-center gap-2">
            
          <Input
            value={filters.search ?? ""}
            onChange={onSearch}
            placeholder="Поиск сотрудников"
            onKeyDown={(e) => {
              if (e.key === "Enter") setFilters((s) => ({ ...s, page: 1 }));
            }}
            className="w-64"
          />
          <Pager
            total={total}
            page={filters.page ?? 1}
            onChange={(p) => setFilters((s) => ({ ...s, page: p }))}
          />
        </div>
      </div>

      <div className={cn("rounded-md border bg-background")}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ФИО</TableHead>
              <TableHead>ИНН</TableHead>
              <TableHead>Номер телефона</TableHead>
              <TableHead>Почта</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}>Загрузка…</TableCell>
              </TableRow>
            ) : employees.length ? (
              employees.map((e : any) => (
                <TableRow key={e.id}>
                  <TableCell className="font-semibold">
                    {e.surname} {e.first_name}
                  </TableCell>
                  <TableCell>{e.inn ?? "-"}</TableCell>
                  <TableCell>{e.number_phone ?? "-"}</TableCell>
                  <TableCell>{e.email_person ?? "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => openEdit(e)}>
                        Изменить
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            Действия
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[520px]">
                          <DialogHeader>
                            <DialogTitle>Выберите действие для сотрудника</DialogTitle>
                          </DialogHeader>

                          <div className="grid grid-cols-2 gap-6">
                            <Button variant="secondary" onClick={() => { setEditOpen(true); setEditTarget(e); setFormPhone(e.number_phone ?? ""); setFormEmail(e.email_person ?? ""); }}>
                              Редактировать контакты
                            </Button>
                            <Button onClick={() => setShowPinModal(true)}>Сбросить пароль</Button>
                            <Button onClick={() => setShowPinModal(true)}>Сбросить ПИН</Button>
                            {e.is_active ? (
                              <Button variant="destructive" onClick={() => setShowPinModal(true)}>
                                Деактивировать
                              </Button>
                            ) : (
                              <Button onClick={() => setShowPinModal(true)}>Активировать</Button>
                            )}
                          </div>

                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="ghost">Закрыть</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>Нет данных</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Модал: редактирование контактов */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Изменить контакты</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Номер телефона"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
            />
            <Input
              placeholder="Почта"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Отмена</Button>
            </DialogClose>
            <Button onClick={submitEdit} disabled={upd.isPending}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        <PinModal open={showPinModal} onClose={() => setShowPinModal(false)}  />
    </div>
  );
}
