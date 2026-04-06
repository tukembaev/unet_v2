import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "shared/ui/dialog";
import {
  Button,
  Input,
  Field,
  FieldLabel,
  FieldError,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/ui";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  FormQuery,
  useIsFormOpen,
  useFormClose,
  useStoredFormParam,
} from "shared/lib";
import {
  createCourse,
  type DisciplineOption,
} from "entities/education-management/model/api";
import { useAllDiscipline } from "entities/education-management/model/queries";
import { curriculumKeys } from "entities/curriculum/model/queries";
import { DisciplineCombobox } from "./ui/DisciplineCombobox";

const HOURS_PER_CREDIT = 30;
const CYCLE_OPTIONS = ["ОГЦ", "МЕН", "Проф", "ОН"];
const COURSE_TYPE_OPTIONS = ["Базовая часть", "Вузовский компонент", "Курс по выбору"];
const CONTROL_FORM_OPTIONS = ["Экзамен", "Зачет", "Курс/пр", "Курс/р"];
const CONTROL_TYPE_OPTIONS = ["ргр", "ргз", "Контр"] as const;
/** Внутреннее значение «пусто» для Radix Select (на бэк уходит "") */
const CONTROL_TYPE_EMPTY = "__empty__";

const schema = z.object({
  disciplineId: z.string().min(1, "Обязательное поле"),
  cycle: z.string().optional(),
  course_type: z.string().min(1, "Обязательное поле"),
  control_form: z.string().optional(),
  control_type: z.string().optional(),
  credit: z.coerce.number().min(0, "Минимум 0"),
  amount_hours: z.coerce.number().min(0, "Минимум 0"),
  lecture_hours: z.coerce.number().min(0, "Минимум 0"),
  practice_hours: z.coerce.number().min(0, "Минимум 0"),
  lab_hours: z.coerce.number().min(0, "Минимум 0"),
});

type FormValues = z.infer<typeof schema>;

type CreateCourseDialogProps = {
  formType?: FormQuery;
  fixedCourseType?: string;
  dialogTitle?: string;
  dialogDescription?: string;
};

export const CreateCourseDialog = ({
  formType = FormQuery.CREATE_COURSE,
  fixedCourseType,
  dialogTitle = "Добавить предмет",
  dialogDescription = "Создайте новый предмет для выбранного семестра",
}: CreateCourseDialogProps = {}) => {
  const queryClient = useQueryClient();
  const open = useIsFormOpen(formType);
  const closeForm = useFormClose();
  const semesterIdStr = useStoredFormParam(formType, "semesterId");
  const groupStr = useStoredFormParam(formType, "group");
  const profileStr = useStoredFormParam(formType, "profile");
  const semesterId = Number(semesterIdStr ?? "");
  const groupFromParams = groupStr && groupStr !== "null" ? groupStr : null;
  const profileFromParams =
    profileStr && profileStr !== "null" && !Number.isNaN(Number(profileStr))
      ? Number(profileStr)
      : null;
  const { data: disciplineOptionsData, isLoading: isLoadingDisciplines } =
    useAllDiscipline();
  const disciplineOptions: DisciplineOption[] = Array.isArray(disciplineOptionsData)
    ? disciplineOptionsData
    : [];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      disciplineId: "",
      cycle: "",
      course_type: fixedCourseType ?? "Базовая часть",
      control_form: "Экзамен",
      control_type: CONTROL_TYPE_EMPTY,
      credit: 0,
      amount_hours: 0,
      lecture_hours: 0,
      practice_hours: 0,
      lab_hours: 0,
    },
  });

  const creditValue = watch("credit");

  useEffect(() => {
    const parsedCredit = Number(creditValue);
    const amountHours = Number.isFinite(parsedCredit)
      ? parsedCredit * HOURS_PER_CREDIT
      : 0;
    setValue("amount_hours", amountHours);
  }, [creditValue, setValue]);

  const handleDisciplineChange = (disciplineId: string) => {
    setValue("disciplineId", disciplineId, { shouldValidate: true });
    const selected = disciplineOptions.find((item) => String(item.value) === disciplineId);
    if (!selected) return;

    if (selected.cycle) {
      setValue("cycle", selected.cycle);
    }
    if (fixedCourseType) {
      setValue("course_type", fixedCourseType, { shouldValidate: true });
    } else if (selected.course_type) {
      setValue("course_type", selected.course_type, { shouldValidate: true });
    }
    if (selected.control_form) {
      setValue("control_form", selected.control_form);
    }
    if (selected.control_type) {
      setValue("control_type", selected.control_type);
    } else {
      setValue("control_type", CONTROL_TYPE_EMPTY);
    }
    if (typeof selected.credit === "number") {
      setValue("credit", selected.credit);
    }
    if (typeof selected.lecture_hours === "number") {
      setValue("lecture_hours", selected.lecture_hours);
    }
    if (typeof selected.practice_hours === "number") {
      setValue("practice_hours", selected.practice_hours);
    }
    if (typeof selected.lab_hours === "number") {
      setValue("lab_hours", selected.lab_hours);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!Number.isFinite(semesterId) || semesterId <= 0) {
      return;
    }

    const selected = disciplineOptions.find(
      (item) => String(item.value) === values.disciplineId
    );

    const courseType = fixedCourseType ?? selected?.course_type ?? values.course_type;
    const isElectiveCourse = courseType === "Курс по выбору";

    try {
      await createCourse({
        semester: semesterId,
        profile: profileFromParams,
        discipline: Number(values.disciplineId),
        department: selected?.depart_id,
        cipher_direction: selected?.cipher_direction,
        discipline_type: selected?.discipline_type,
        name_subject: selected?.label ?? "",
        dep: selected?.dep ?? "",
        cycle: selected?.cycle ?? (values.cycle || null),
        course_type: courseType,
        control_form: selected?.control_form ?? (values.control_form || ""),
        control_type:
          !values.control_type || values.control_type === CONTROL_TYPE_EMPTY
            ? ""
            : values.control_type,
        credit: values.credit,
        credit_part_time: selected?.credit_part_time,
        amount_hours: values.amount_hours,
        lecture_hours: values.lecture_hours,
        practice_hours: values.practice_hours,
        lab_hours: values.lab_hours,
        group: isElectiveCourse ? (groupFromParams ?? selected?.group ?? null) : null,
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: curriculumKeys.courses() }),
        queryClient.invalidateQueries({ queryKey: ["syllabus-report"] }),
      ]);

      toast.success("Предмет добавлен");
      reset();
      closeForm(formType);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось добавить предмет");
    }
  });

  const disciplineValue = watch("disciplineId");

  return (
    <Dialog open={open} onOpenChange={() => closeForm(formType)}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6">
          <input type="hidden" {...register("disciplineId")} />
          <input type="hidden" {...register("cycle")} />
          <input type="hidden" {...register("course_type")} />
          <input type="hidden" {...register("control_form")} />
          <input type="hidden" {...register("control_type")} />
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>
                Дисциплина <span className="text-destructive">*</span>
              </FieldLabel>
              <DisciplineCombobox
                options={disciplineOptions}
                value={disciplineValue}
                onValueChange={handleDisciplineChange}
                disabled={isLoadingDisciplines}
              />
              {errors.disciplineId && (
                <FieldError>{errors.disciplineId.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Цикл</FieldLabel>
              <Select
                value={watch("cycle") || undefined}
                onValueChange={(value) => setValue("cycle", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите цикл" />
                </SelectTrigger>
                <SelectContent>
                  {CYCLE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.cycle && <FieldError>{errors.cycle.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>
                Статус <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                value={watch("course_type") || undefined}
                onValueChange={(value) =>
                  setValue("course_type", value, { shouldValidate: true })
                }
                disabled={Boolean(fixedCourseType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  {COURSE_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.course_type && (
                <FieldError>{errors.course_type.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Форма контроля</FieldLabel>
              <Select
                value={watch("control_form") || undefined}
                onValueChange={(value) => setValue("control_form", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите форму контроля" />
                </SelectTrigger>
                <SelectContent>
                  {CONTROL_FORM_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.control_form && (
                <FieldError>{errors.control_form.message}</FieldError>
              )}
            </Field>

            <Field className="sm:col-span-2">
              <FieldLabel>Тип контроля</FieldLabel>
              <Select
                value={watch("control_type") || CONTROL_TYPE_EMPTY}
                onValueChange={(value) => setValue("control_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="ргр / ргз / Контр" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CONTROL_TYPE_EMPTY}>— не выбрано</SelectItem>
                  {CONTROL_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-5 gap-4">
            <Field>
              <FieldLabel>Кредит</FieldLabel>
              <Input type="number" {...register("credit")} placeholder="0" />
              {errors.credit && <FieldError>{errors.credit.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Всего ауд.</FieldLabel>
              <Input
                type="number"
                {...register("amount_hours")}
                placeholder="0"
                readOnly
              />
              {errors.amount_hours && (
                <FieldError>{errors.amount_hours.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Лекции</FieldLabel>
              <Input type="number" {...register("lecture_hours")} placeholder="0" />
              {errors.lecture_hours && (
                <FieldError>{errors.lecture_hours.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Практика</FieldLabel>
              <Input type="number" {...register("practice_hours")} placeholder="0" />
              {errors.practice_hours && (
                <FieldError>{errors.practice_hours.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Лаб.</FieldLabel>
              <Input type="number" {...register("lab_hours")} placeholder="0" />
              {errors.lab_hours && (
                <FieldError>{errors.lab_hours.message}</FieldError>
              )}
            </Field>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => closeForm(formType)}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Добавить предмет
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseDialog;

