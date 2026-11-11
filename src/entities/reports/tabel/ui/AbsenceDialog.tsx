import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from 'shared/ui';
import {
  useAbsence,
  useAbsenceTypes,
  useCreateAbsence,
  useDeleteAbsence,
  useUpdateAbsence,
} from '../model/queries';
import { cellDisplayText, toIsoDate, type TabelCellTarget } from '../model/types';

type AbsenceDialogProps = {
  target: TabelCellTarget | null;
  onClose: () => void;
};

export function AbsenceDialog({ target, onClose }: AbsenceDialogProps) {
  const open = target != null;
  const isEdit = target?.mode === 'edit';
  const isView = target?.mode === 'view';
  const absenceId = isEdit ? target?.cell.absence_id ?? null : null;

  const typesQuery = useAbsenceTypes(open && !isView);
  const absenceQuery = useAbsence(absenceId);
  const createAbsence = useCreateAbsence();
  const updateAbsence = useUpdateAbsence();
  const deleteAbsence = useDeleteAbsence();

  const [absenceType, setAbsenceType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [comment, setComment] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!target) return;
    const iso = toIsoDate(target.cell.date_day);
    setAbsenceType(
      target.cell.absence_type_id != null ? String(target.cell.absence_type_id) : ''
    );
    setDateFrom(iso);
    setDateTo(iso);
    setComment('');
    setConfirmDelete(false);
    setFormError(null);
  }, [target]);

  useEffect(() => {
    if (!absenceQuery.data) return;
    setAbsenceType(String(absenceQuery.data.absence_type));
    setDateFrom(absenceQuery.data.date_from);
    setDateTo(absenceQuery.data.date_to);
    setComment(absenceQuery.data.comment);
  }, [absenceQuery.data]);

  const types = typesQuery.data ?? [];
  const knownType = types.some((item) => String(item.id) === absenceType);
  const busy =
    createAbsence.isPending ||
    updateAbsence.isPending ||
    deleteAbsence.isPending ||
    (isEdit && absenceQuery.isLoading);

  const submit = async () => {
    if (!target || isView) return;
    if (!absenceType) {
      setFormError('Выберите вид пропуска');
      return;
    }
    if (!dateFrom || !dateTo) {
      setFormError('Укажите даты');
      return;
    }
    if (dateTo < dateFrom) {
      setFormError('Дата окончания раньше начала');
      return;
    }
    setFormError(null);
    const payload = {
      employee: target.employeeId,
      absence_type: Number(absenceType),
      date_from: dateFrom,
      date_to: dateTo,
      comment: comment.trim(),
    };
    try {
      if (isEdit && target.cell.absence_id != null) {
        await updateAbsence.mutateAsync({ id: target.cell.absence_id, payload });
      } else {
        await createAbsence.mutateAsync(payload);
      }
      onClose();
    } catch {
      /* сообщение уже в toast мутации */
    }
  };

  const remove = async () => {
    if (target?.cell.absence_id == null) return;
    try {
      await deleteAbsence.mutateAsync(target.cell.absence_id);
      onClose();
    } catch {
      /* сообщение уже в toast мутации */
    }
  };

  const title = isView
    ? 'Отметка'
    : isEdit
      ? 'Пропуск'
      : 'Поставить пропуск';

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {target
              ? `${target.employeeName}${target.cell.date_day ? ` · ${target.cell.date_day}` : ''}`
              : null}
          </DialogDescription>
        </DialogHeader>

        {isView && target ? (
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">День</dt>
              <dd>{target.cell.day_of_week || '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Отметка</dt>
              <dd>{cellDisplayText(target.cell)}</dd>
            </div>
            {target.cell.status_info ? (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Статус</dt>
                <dd>{target.cell.status_info}</dd>
              </div>
            ) : null}
            {target.cell.auditorium ? (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Аудитория</dt>
                <dd className="text-right">{target.cell.auditorium}</dd>
              </div>
            ) : null}
          </dl>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Вид пропуска</Label>
              <Select
                value={absenceType || undefined}
                onValueChange={setAbsenceType}
                disabled={typesQuery.isLoading || busy}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      typesQuery.isLoading ? 'Загрузка…' : 'Выберите вид'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {!knownType && absenceQuery.data ? (
                    <SelectItem value={String(absenceQuery.data.absence_type)}>
                      {absenceQuery.data.absence_type_title || absenceQuery.data.short_code}
                    </SelectItem>
                  ) : null}
                  {types.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.short_code ? `${item.short_code} — ${item.title}` : item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="absence-from">С</Label>
                <Input
                  id="absence-from"
                  type="date"
                  value={dateFrom}
                  onChange={(event) => setDateFrom(event.target.value)}
                  disabled={busy}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="absence-to">По</Label>
                <Input
                  id="absence-to"
                  type="date"
                  value={dateTo}
                  onChange={(event) => setDateTo(event.target.value)}
                  disabled={busy}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="absence-comment">Комментарий</Label>
              <Textarea
                id="absence-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                disabled={busy}
                rows={3}
              />
            </div>
            {isEdit ? (
              <p className="text-xs text-muted-foreground">
                Удаление снимает весь период пропуска, а не один день внутри него.
              </p>
            ) : null}
            {formError ? (
              <p className="text-sm text-destructive">{formError}</p>
            ) : null}
          </div>
        )}

        <DialogFooter className="gap-2 sm:justify-between">
          {isEdit ? (
            confirmDelete ? (
              <Button
                type="button"
                variant="destructive"
                onClick={() => void remove()}
                disabled={busy}
              >
                Удалить весь период
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmDelete(true)}
                disabled={busy}
              >
                Удалить
              </Button>
            )
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={busy}>
              Закрыть
            </Button>
            {!isView ? (
              <Button type="button" onClick={() => void submit()} disabled={busy}>
                Сохранить
              </Button>
            ) : null}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
