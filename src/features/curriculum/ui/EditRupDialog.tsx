import { useEffect } from "react";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/ui";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "shared/ui/field";
import {
  FormQuery,
  useForm,
  useFormClose,
  useIsFormOpen,
  useStoredFormParam,
} from "shared/lib";
import {
  curriculumKeys,
  fetchSyllabusById,
  updateSyllabusById,
} from "entities/curriculum/model";
import { toast } from "sonner";

const FORM_EDUCATION_OPTIONS = [
  { value: "full_time", label: "Очная" },
  { value: "part_time", label: "Заочная" },
] as const;

const LEVEL_EDUCATION_OPTIONS = [
  { value: "bachelor", label: "Бакалавр" },
  { value: "master", label: "Магистр" },
  { value: "phd", label: "PhD" },
  { value: "specialist", label: "Специалист" },
] as const;

function normalizeOptionValue(
  rawValue: string | null | undefined,
  options: readonly { value: string; label: string }[]
): string {
  const normalized = (rawValue ?? "").trim().toLowerCase();
  if (!normalized) return "";
  const byValue = options.find((o) => o.value.toLowerCase() === normalized);
  if (byValue) return byValue.value;
  const byLabel = options.find((o) => o.label.toLowerCase() === normalized);
  return byLabel ? byLabel.value : "";
}

function optionLabelByValue(
  value: string,
  options: readonly { value: string; label: string }[]
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

const editRupSchema = z
  .object({
    form_education: z.string().min(1, "Укажите форму обучения"),
    level_education: z.string().min(1, "Укажите уровень образования"),
    start_year: z
      .string()
      .min(4, "Год должен содержать 4 цифры")
      .max(4, "Год должен содержать 4 цифры")
      .regex(/^\d{4}$/, "Год должен содержать только цифры"),
    end_year: z
      .string()
      .min(4, "Год должен содержать 4 цифры")
      .max(4, "Год должен содержать 4 цифры")
      .regex(/^\d{4}$/, "Год должен содержать только цифры"),
  })
  .refine(
    (data) => Number(data.end_year) > Number(data.start_year),
    {
      message: "Год окончания должен быть больше года начала",
      path: ["end_year"],
    }
  );

type EditRupFormData = z.infer<typeof editRupSchema>;

export function EditRupDialog() {
  const open = useIsFormOpen(FormQuery.EDIT_RUP);
  const closeForm = useFormClose();
  const queryClient = useQueryClient();
  const rupId = Number(useStoredFormParam(FormQuery.EDIT_RUP, "rupId") ?? "");

  const form = useForm<EditRupFormData>({
    schema: editRupSchema,
    defaultValues: {
      form_education: "",
      level_education: "",
      start_year: "",
      end_year: "",
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: [...curriculumKeys.list(), "detail", rupId],
    queryFn: () => fetchSyllabusById(rupId),
    enabled: open && Number.isFinite(rupId) && rupId > 0,
  });

  useEffect(() => {
    if (!data) return;
    form.reset({
      form_education: normalizeOptionValue(data.form_education, FORM_EDUCATION_OPTIONS),
      level_education: normalizeOptionValue(data.level_education, LEVEL_EDUCATION_OPTIONS),
      start_year: data.start_year ?? "",
      end_year: data.end_year ?? "",
    });
  }, [data, form]);

  const { mutateAsync: submitUpdate, isPending } = useMutation({
    mutationFn: (values: EditRupFormData) =>
      updateSyllabusById(rupId, {
        name_direction: data?.name_direction,
        form_education: optionLabelByValue(values.form_education, FORM_EDUCATION_OPTIONS),
        level_education: optionLabelByValue(values.level_education, LEVEL_EDUCATION_OPTIONS),
        creator_id: data?.creator_id ?? null,
        start_year: values.start_year,
        end_year: values.end_year,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: curriculumKeys.list() });
      void queryClient.invalidateQueries({
        queryKey: [...curriculumKeys.list(), "detail", rupId],
      });
    },
  });

  const handleCancel = () => {
    form.reset();
    closeForm(FormQuery.EDIT_RUP);
  };

  const handleSubmit = async (values: EditRupFormData) => {
    try {
      await submitUpdate(values);
      toast.success("РУП обновлен");
      closeForm(FormQuery.EDIT_RUP);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Не удалось обновить РУП");
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => closeForm(FormQuery.EDIT_RUP)}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать РУП</DialogTitle>
          <DialogDescription>
            Можно изменить все поля, кроме ID и названия направления.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Направление</FieldLabel>
              <Input value={data?.direction ?? ""} readOnly disabled />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Форма обучения</FieldLabel>
                <Select
                  value={form.watch("form_education") || undefined}
                  onValueChange={(v) => form.setValue("form_education", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите форму обучения" />
                  </SelectTrigger>
                  <SelectContent>
                    {FORM_EDUCATION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.form_education && (
                  <FieldError>{form.formState.errors.form_education.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>Уровень образования</FieldLabel>
                <Select
                  value={form.watch("level_education") || undefined}
                  onValueChange={(v) => form.setValue("level_education", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите уровень" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVEL_EDUCATION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.level_education && (
                  <FieldError>{form.formState.errors.level_education.message}</FieldError>
                )}
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Год начала</FieldLabel>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="2021"
                  maxLength={4}
                  value={form.watch("start_year")}
                  onChange={(e) =>
                    form.setValue("start_year", e.target.value.replace(/\D/g, ""))
                  }
                />
                {form.formState.errors.start_year && (
                  <FieldError>{form.formState.errors.start_year.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>Год окончания</FieldLabel>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="2022"
                  maxLength={4}
                  value={form.watch("end_year")}
                  onChange={(e) =>
                    form.setValue("end_year", e.target.value.replace(/\D/g, ""))
                  }
                />
                {form.formState.errors.end_year && (
                  <FieldError>{form.formState.errors.end_year.message}</FieldError>
                )}
              </Field>
            </div>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isPending || isLoading || form.formState.isSubmitting}
            >
              {isPending || form.formState.isSubmitting
                ? "Сохранение..."
                : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
