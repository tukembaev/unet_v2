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
  useSyllabusTemplatesByDirection,
} from "entities/curriculum/model/queries";
import { toast } from "sonner";

/** Как в legacy StudyPlanForm: name_direction, template, start_year, end_year */
const createRupFormSchema = z
  .object({
    name_direction: z.string().min(1, "Выберите направление"),
    template: z.string().min(1, "Выберите шаблон"),
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
      template: "",
      startYear: "",
      endYear: "",
    },
  });

  const directionStr = form.watch("name_direction");
  const directionId =
    directionStr && !Number.isNaN(Number(directionStr))
      ? Number(directionStr)
      : undefined;

  const { data: templates = [], isLoading: isLoadingTemplates } =
    useSyllabusTemplatesByDirection(directionId);

  const { mutateAsync: submitSyllabus, isPending: isCreating } =
    useCreateSyllabus();

  const handleCancel = () => {
    form.reset();
    closeForm(FormQuery.CREATE_RUP);
  };

  const handleSubmit = async (data: CreateRupFormData) => {
    const name_direction = Number(data.name_direction);
    const template = Number(data.template);
    if (Number.isNaN(name_direction) || Number.isNaN(template)) {
      toast.error("Некорректные направление или шаблон");
      return;
    }

    try {
      await submitSyllabus({
        name_direction,
        template,
        start_year: data.startYear,
        end_year: data.endYear,
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
            Направление, шаблон и период обучения — как в прежней форме
            создания плана
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
                  form.setValue("template", "");
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

            <Field className="flex flex-col">
              <FieldLabel>
                Шаблон
                <span className="text-red-500 ml-1">*</span>
              </FieldLabel>
              <Select
                value={form.watch("template") || undefined}
                onValueChange={(v) => form.setValue("template", v)}
                disabled={
                  !directionId || isLoadingTemplates || templates.length === 0
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !directionId
                        ? "Сначала выберите направление"
                        : isLoadingTemplates
                          ? "Загрузка шаблонов…"
                          : templates.length === 0
                            ? "Нет шаблонов для направления"
                            : "Выберите шаблон"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.template && (
                <FieldError>
                  {form.formState.errors.template.message}
                </FieldError>
              )}
            </Field>

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
