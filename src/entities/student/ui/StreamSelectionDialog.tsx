import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  useRegisterToStreamMutation,
  useSubjectStreamsQuery,
} from '../model/queries';
import type { SubjectStreamOption } from '../model/types';
import { getHttpErrorMessage } from 'shared/lib/http-error';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from 'shared/ui';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectId: number | null;
  subjectName: string;
};

function groupByType(streams: SubjectStreamOption[]) {
  return {
    lecture: streams.filter((s) => s.stream_type?.includes('Лекц')),
    practice: streams.filter((s) => s.stream_type?.includes('Практ')),
    lab: streams.filter((s) => s.stream_type?.includes('Лабор')),
  };
}

function StreamSelectField({
  label,
  streams,
  value,
  onChange,
}: {
  label: string;
  streams: SubjectStreamOption[];
  value?: string;
  onChange: (id: string) => void;
}) {
  if (!streams.length) return null;
  const safeValue =
    value && streams.some((s) => String(s.id) === value) ? value : undefined;
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={safeValue} onValueChange={onChange}>
        <SelectTrigger className="rounded-xl">
          <SelectValue placeholder="Выберите поток" />
        </SelectTrigger>
        <SelectContent
          position="popper"
          className="z-[60]"
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          {streams.map((s) => (
            <SelectItem key={s.id} value={String(s.id)}>
              №{s.number}
              {s.teacher_name ? ` — ${s.teacher_name}` : ''}
              {s.is_registered ? ' (зарегистрирован)' : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function StreamSelectionDialog({
  open,
  onOpenChange,
  subjectId,
  subjectName,
}: Props) {
  const { data: streams = [], isLoading, isError, error } = useSubjectStreamsQuery(
    open ? subjectId : null
  );
  const registerMut = useRegisterToStreamMutation();
  const [selected, setSelected] = useState<{
    lecture?: string;
    practice?: string;
    lab?: string;
  }>({});

  const grouped = useMemo(() => groupByType(streams), [streams]);

  useEffect(() => {
    if (!open) {
      setSelected({});
      return;
    }
    const next: typeof selected = {};
    for (const s of streams) {
      if (!s.is_registered) continue;
      if (s.stream_type?.includes('Лекц')) next.lecture = String(s.id);
      else if (s.stream_type?.includes('Практ')) next.practice = String(s.id);
      else if (s.stream_type?.includes('Лабор')) next.lab = String(s.id);
    }
    setSelected(next);
  }, [open, streams]);

  useEffect(() => {
    if (open && isError) {
      toast.error('Не удалось загрузить потоки', {
        description: getHttpErrorMessage(error),
      });
    }
  }, [open, isError, error]);

  const idsToRegister = [selected.lecture, selected.practice, selected.lab]
    .filter(Boolean)
    .map((id) => Number(id));

  const requiredOk =
    (grouped.lecture.length === 0 || selected.lecture) &&
    (grouped.practice.length === 0 || selected.practice) &&
    (grouped.lab.length === 0 || selected.lab);

  const handleConfirm = async () => {
    if (!idsToRegister.length) {
      toast.message('Выберите хотя бы один поток');
      return;
    }
    try {
      for (const id of idsToRegister) {
        const already = streams.find((s) => s.id === id)?.is_registered;
        if (already) continue;
        await registerMut.mutateAsync(id);
      }
      toast.success('Регистрация прошла успешно');
      onOpenChange(false);
    } catch (e) {
      toast.error('Не удалось зарегистрироваться', {
        description: getHttpErrorMessage(e),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-md"
        onCloseAutoFocus={(event) => event.preventDefault()}
        onInteractOutside={(event) => {
          const target = event.target as HTMLElement | null;
          if (target?.closest('[data-radix-select-content]')) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Выбор потоков</DialogTitle>
          <DialogDescription className="text-sm">
            {subjectName || 'Дисциплина'}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-3 py-2">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ) : !streams.length ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Потоки не найдены
          </p>
        ) : (
          <div className="space-y-3">
            <StreamSelectField
              label="Лекционный поток"
              streams={grouped.lecture}
              value={selected.lecture}
              onChange={(v) => setSelected((s) => ({ ...s, lecture: v }))}
            />
            <StreamSelectField
              label="Практический поток"
              streams={grouped.practice}
              value={selected.practice}
              onChange={(v) => setSelected((s) => ({ ...s, practice: v }))}
            />
            <StreamSelectField
              label="Лабораторный поток"
              streams={grouped.lab}
              value={selected.lab}
              onChange={(v) => setSelected((s) => ({ ...s, lab: v }))}
            />
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Отмена
          </Button>
          <Button
            type="button"
            className="rounded-xl"
            disabled={!requiredOk || registerMut.isPending || !streams.length}
            onClick={() => void handleConfirm()}
          >
            {registerMut.isPending ? 'Сохранение…' : 'Подтвердить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
