import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getHttpErrorMessage } from 'shared/lib';
import type { DepartmentDisciplineRow, SelectOptions } from '../model/types';
import {
  useCreateDepartmentDiscipline,
  useDeleteDepartmentDiscipline,
  usePrerequisiteOptions,
  useUpdateDepartmentDiscipline,
} from '../model/queries';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  FieldError,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'shared/ui';
import { OptionMultiSelect } from './OptionMultiSelect';

/** Stable fallback so query `data ?? x` does not produce a new `[]` every render. */
const EMPTY_SELECT_OPTIONS: SelectOptions[] = [];

const LEVEL_EDUCATIONS = [
  { value: 1, label: 'Бакалавр', eng: 'bachelor' },
  { value: 2, label: 'Магистр', eng: 'master' },
  { value: 3, label: 'PhD', eng: 'phd' },
  { value: 4, label: 'Специалист', eng: 'specialist' },
] as const;

const schema = z.object({
  title: z.string().min(1, 'Укажите наименование'),
  credit: z
    .preprocess((v) => {
      if (v === '' || v === null || v === undefined) return undefined;
      const n = typeof v === 'number' ? v : Number(v);
      return Number.isNaN(n) ? undefined : n;
    }, z.number().min(0).optional())
    .refine((v) => v !== undefined, 'Укажите кредиты')
    .transform((v) => v as number),
  credit_part_time: z.preprocess((v) => {
    if (v === '' || v === null || v === undefined) return undefined;
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isNaN(n) ? undefined : n;
  }, z.number().min(0).optional()),
  level_education: z.string().min(1, 'Выберите уровень'),
  prerequisiteIds: z.array(z.number()),
  title_ky: z.string().optional(),
  title_en: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function matchIdsByNames(
  names: string[] | null | undefined,
  options: { value: number; label: string }[]
): number[] {
  if (!names?.length) return [];
  const ids: number[] = [];
  for (const n of names) {
    const found = options.find(
      (o) => o.label.trim().toLowerCase() === n.trim().toLowerCase()
    );
    if (found) ids.push(found.value);
  }
  return ids;
}

const defaultEmpty: Partial<FormValues> = {
  title: '',
  credit_part_time: undefined,
  level_education: '',
  prerequisiteIds: [],
  title_ky: '',
  title_en: '',
};

function rowToFormValues(
  row: DepartmentDisciplineRow,
  prereqOptions: { value: number; label: string }[]
): FormValues {
  const fromPrereq =
    row.prerequisites?.length && prereqOptions.length
      ? row.prerequisites
      : matchIdsByNames(row.prerequisites_names, prereqOptions);

  return {
    title: row.title ?? '',
    credit: row.credit ?? 0,
    credit_part_time: row.credit_part_time ?? undefined,
    level_education: row.level_education ?? '',
    prerequisiteIds: fromPrereq,
    title_ky: row.title_ky ?? '',
    title_en: row.title_en ?? '',
  };
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  discipline: DepartmentDisciplineRow | null;
};

export function DepartmentDisciplineDialog({ open, onOpenChange, mode, discipline }: Props) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const { data: prereqData, isLoading: prereqLoading } = usePrerequisiteOptions();
  const prereqOptions = prereqData ?? EMPTY_SELECT_OPTIONS;
  const createMut = useCreateDepartmentDiscipline();
  const updateMut = useUpdateDepartmentDiscipline();
  const deleteMut = useDeleteDepartmentDiscipline();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultEmpty,
  });

  useEffect(() => {
    if (!open) setDeleteConfirmOpen(false);
  }, [open]);

  /** Create: reset only when `open` / `mode` change — avoids loops if deps flicker. */
  useEffect(() => {
    if (!open || mode !== 'create') return;
    reset(defaultEmpty);
  }, [open, mode, reset]);

  useEffect(() => {
    if (!open || mode !== 'edit' || !discipline) return;
    reset(rowToFormValues(discipline, prereqOptions));
  }, [open, mode, discipline, prereqOptions, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      title: values.title.trim(),
      title_en: values.title_en?.trim() || undefined,
      title_ky: values.title_ky?.trim() || undefined,
      credit: values.credit,
      credit_part_time:
        values.credit_part_time != null && !Number.isNaN(values.credit_part_time)
          ? values.credit_part_time
          : undefined,
      level_education: values.level_education,
      prerequisites: values.prerequisiteIds,
    };

    try {
      if (mode === 'edit' && discipline) {
        await updateMut.mutateAsync({ id: discipline.id, payload });
        toast.success('Дисциплина обновлена');
      } else {
        await createMut.mutateAsync(payload);
        toast.success('Дисциплина создана');
      }
      onOpenChange(false);
      reset(defaultEmpty);
    } catch (e) {
      toast.error(getHttpErrorMessage(e, 'Не удалось сохранить'));
    }
  });

  const busy = isSubmitting || createMut.isPending || updateMut.isPending;

  const handleDelete = async () => {
    if (!discipline) return;
    try {
      await deleteMut.mutateAsync(discipline.id);
      toast.success('Дисциплина удалена');
      setDeleteConfirmOpen(false);
      onOpenChange(false);
      reset(defaultEmpty);
    } catch (e) {
      toast.error(getHttpErrorMessage(e, 'Не удалось удалить дисциплину'));
    }
  };

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Редактировать дисциплину' : 'Создать дисциплину'}
          </DialogTitle>
          <DialogDescription>
            Заполните поля и сохраните. Кредиты и уровень обязательны.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field>
            <FieldLabel>Наименование</FieldLabel>
            <Input placeholder="Наименование дисциплины" {...register('title')} />
            {errors.title && <FieldError>{errors.title.message}</FieldError>}
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Кредиты</FieldLabel>
              <Input
                type="number"
                step="any"
                placeholder="Введите кредиты"
                {...register('credit')}
              />
              {errors.credit && <FieldError>{errors.credit.message}</FieldError>}
            </Field>
            <Field>
              <FieldLabel>Кредиты (заочно)</FieldLabel>
              <Input
                type="number"
                step="any"
                min={0}
                placeholder="—"
                {...register('credit_part_time')}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel>Уровень образования</FieldLabel>
            <Controller
              name="level_education"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите уровень" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVEL_EDUCATIONS.map((lvl) => (
                      <SelectItem key={lvl.eng} value={lvl.eng}>
                        {lvl.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.level_education && (
              <FieldError>{errors.level_education.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Пререквизиты</FieldLabel>
            <Controller
              name="prerequisiteIds"
              control={control}
              render={({ field }) => (
                <OptionMultiSelect
                  options={prereqOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Выберите пререквизиты"
                  disabled={prereqLoading}
                />
              )}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>На кыргызском</FieldLabel>
              <Input placeholder="Аталышы" {...register('title_ky')} />
            </Field>
            <Field>
              <FieldLabel>На английском</FieldLabel>
              <Input placeholder="Title in English" {...register('title_en')} />
            </Field>
          </div>

          <DialogFooter className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            <div className="order-2 sm:order-1">
              {mode === 'edit' && discipline ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto"
                  disabled={busy || deleteMut.isPending}
                  onClick={() => setDeleteConfirmOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить дисциплину
                </Button>
              ) : null}
            </div>
            <div className="order-1 flex w-full gap-2 sm:order-2 sm:w-auto sm:justify-end">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button type="submit" disabled={busy}>
                {mode === 'edit' ? 'Сохранить' : 'Создать'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Удалить дисциплину?</DialogTitle>
          <DialogDescription>
            {discipline ? (
              <>
                Будет удалена дисциплина «{discipline.title}». Это действие нельзя отменить.
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
            Отмена
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={deleteMut.isPending}
            onClick={() => void handleDelete()}
          >
            Удалить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
