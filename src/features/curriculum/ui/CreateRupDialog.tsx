import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
  FieldLabel,
  FieldError,
  FieldGroup,
} from "shared/ui/field";
import { useForm, FormQuery, useIsFormOpen, useFormClose } from "shared/lib";
import { z } from "zod";
import {
  useCreateSyllabus,
  useSyllabusDirectionOptions,
} from "entities/curriculum/model/queries";
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

const createRupFormSchema = z
  .object({
    name_direction: z.string().min(1, "Выберите направление"),
    form_education: z.string().min(1, "Выберите форму обучения"),
    level_education: z.string().min(1, "Выберите уровень образования"),
    startYear: z
      .string()
      .min(4, "Год должен содержать 4 цифры")
      .max(4, "Год должен содержать 4 цифры")
      .regex(/^\d{4}$/, "Год должен содержать только цифры")
      .refine((val) => {
        const year = parseInt(val, 10);
        return year >= 2020 && year <= 2050;
      }, "Год должен быть в диапазоне 2020-2050"),
    endYear: z
      .string()
      .min(4, "Год должен содержать 4 цифры")
      .max(4, "Год должен содержать 4 цифры")
      .regex(/^\d{4}$/, "Год должен содержать только цифры")
      .refine((val) => {
        const year = parseInt(val, 10);
        return year >= 2020 && year <= 2050;
      }, "Год должен быть в диапазоне 2020-2050"),
  })
  .refine(
    (data) => {
      const startYear = parseInt(data.startYear, 10);
      const endYear = parseInt(data.endYear, 10);
      return endYear > startYear;
    },
    {
      message: "Год окончания должен быть больше года начала",
      path: ["endYear"],
    }
  );

type CreateRupFormData = z.infer<typeof createRupFormSchema>;

export function CreateRupDialog() {
  const open = useIsFormOpen(FormQuery.CREATE_RUP);
  const closeForm = useFormClose();
  const { data: directions = [], isLoading: isLoadingDirections } =
    useSyllabusDirectionOptions();

  const form = useForm<CreateRupFormData>({
    schema: createRupFormSchema,
    defaultValues: {
      name_direction: "",
      form_education: "",
      level_education: "",
      startYear: "",
      endYear: "",
    },
  });

  const { mutateAsync: submitSyllabus, isPending: isCreating } =
    useCreateSyllabus();

  const handleCancel = () => {
    form.reset();
    closeForm(FormQuery.CREATE_RUP);
  };

  const handleSubmit = async (data: CreateRupFormData) => {
    const name_direction = Number(data.name_direction);
    if (Number.isNaN(name_direction)) {
      toast.error("Некорректное направление");
      return;
    }

    try {
      await submitSyllabus({
        name_direction,
        start_year: data.startYear,
        end_year: data.endYear,
        form_education: data.form_education,
        level_education: data.level_education,
      });
      toast.success("Учебный план создан");
      form.reset();
      closeForm(FormQuery.CREATE_RUP);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Не удалось создать учебный план"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => closeForm(FormQuery.CREATE_RUP)}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать РУП</DialogTitle>
          <DialogDescription>
            Направление, форма и уровень обучения, период обучения
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Field className="flex flex-col">
              <FieldLabel>
                Направление
                <span className="text-red-500 ml-1">*</span>
              </FieldLabel>
              <Select
                value={form.watch("name_direction") || undefined}
                onValueChange={(v) => {
                  form.setValue("name_direction", v);
                }}
                disabled={isLoadingDirections}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите направление" />
                </SelectTrigger>
                <SelectContent>
                  {directions.map((d) => (
                    <SelectItem key={d.value} value={String(d.value)}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.name_direction && (
                <FieldError>
                  {form.formState.errors.name_direction.message}
                </FieldError>
              )}
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field className="flex flex-col">
                <FieldLabel>
                  Форма обучения
                  <span className="text-red-500 ml-1">*</span>
                </FieldLabel>
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
                  <FieldError>
                    {form.formState.errors.form_education.message}
                  </FieldError>
                )}
              </Field>

              <Field className="flex flex-col">
                <FieldLabel>
                  Уровень образования
                  <span className="text-red-500 ml-1">*</span>
                </FieldLabel>
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
                  <FieldError>
                    {form.formState.errors.level_education.message}
                  </FieldError>
                )}
              </Field>
            </div>

            <p className="text-sm text-muted-foreground pb-1">Год обучения</p>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>
                  Начало
                  <span className="text-red-500 ml-1">*</span>
                </FieldLabel>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="2020"
                  maxLength={4}
                  value={form.watch("startYear")}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    form.setValue("startYear", value);
                  }}
                />
                {form.formState.errors.startYear && (
                  <FieldError>
                    {form.formState.errors.startYear.message}
                  </FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>
                  Конец
                  <span className="text-red-500 ml-1">*</span>
                </FieldLabel>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="2024"
                  maxLength={4}
                  value={form.watch("endYear")}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    form.setValue("endYear", value);
                  }}
                />
                {form.formState.errors.endYear && (
                  <FieldError>
                    {form.formState.errors.endYear.message}
                  </FieldError>
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
              disabled={form.formState.isSubmitting || isCreating}
            >
              {form.formState.isSubmitting || isCreating
                ? "Создание..."
                : "Создать"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
