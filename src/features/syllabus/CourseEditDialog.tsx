import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FormQuery,
  useFormClose,
  useStoredFormParam,
  useIsFormOpen,
} from "shared/lib";
import {
  Button,
  Field,
  FieldError,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "shared/ui/dialog";
import { curriculumKeys } from "entities/curriculum/model/queries";
import { useAllDiscipline } from "entities/education-management/model/queries";
import {
  deleteCourse,
  updateCourse,
  type DisciplineOption,
} from "entities/education-management/model/api";
import { SyllabusCourse } from "entities/education-management/model/types";
import { DisciplineCombobox } from "./ui/DisciplineCombobox";

const HOURS_PER_CREDIT = 30;
const CYCLE_OPTIONS = ["ОГЦ", "МЕН", "Проф", "ОН"];
const COURSE_TYPE_OPTIONS = ["Базовая часть", "Вузовский компонент", "Курс по выбору"];
const CONTROL_FORM_OPTIONS = ["Экзамен", "Зачет", "Курс/пр", "Курс/р"];
const CONTROL_TYPE_OPTIONS = ["ргр", "ргз", "Контр"] as const;
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

interface Props {
  course: SyllabusCourse | null;
}

export const CourseEditDialog = ({ course }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const open = useIsFormOpen(FormQuery.EDIT_COURSE);
  const isDialogOpen = open && !!course;
  const closeForm = useFormClose();
  const courseId = useStoredFormParam(FormQuery.EDIT_COURSE, "courseId");
  const queryClient = useQueryClient();
  const { data: disciplineOptionsData, isLoading: isLoadingDisciplines } =
    useAllDiscipline();
  const disciplineOptions: DisciplineOption[] = Array.isArray(disciplineOptionsData)
    ? disciplineOptionsData
    : [];

  const courseDisciplineId = course?.discipline != null ? String(course.discipline) : "";

  const availableOptions = useMemo(() => {
    const options = [...disciplineOptions];
    if (!course) return options;
    const exists = options.some((item) => String(item.value) === courseDisciplineId);
    if (!exists && courseDisciplineId) {
      options.unshift({
        value: Number(courseDisciplineId),
        label: course.name_subject,
        depart_id: course.department,
        dep: course.dep,
        cycle: course.cycle ?? undefined,
        course_type: course.course_type,
        control_form: course.control_form,
        control_type: course.control_type ?? undefined,
        credit: course.credit,
        lecture_hours: course.lecture_hours,
        practice_hours: course.practice_hours,
        lab_hours: course.lab_hours,
      });
    }
    return options;
  }, [disciplineOptions, course, courseDisciplineId]);

  const resolvedDisciplineId = useMemo(() => {
    if (courseDisciplineId) return courseDisciplineId;
    const byName = availableOptions.find(
      (item) => item.label?.trim().toLowerCase() === course?.name_subject?.trim().toLowerCase()
    );
    return byName ? String(byName.value) : "";
  }, [availableOptions, course?.name_subject, courseDisciplineId]);

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
      course_type: "Базовая часть",
      control_form: "Экзамен",
      control_type: CONTROL_TYPE_EMPTY,
      credit: 0,
      amount_hours: 0,
      lecture_hours: 0,
      practice_hours: 0,
      lab_hours: 0,
    },
  });

  useEffect(() => {
    if (!course || !isDialogOpen) return;
    reset({
      disciplineId: resolvedDisciplineId,
      cycle: course.cycle ?? "",
      course_type: course.course_type ?? "",
      control_form: course.control_form ?? "",
      control_type: course.control_type?.trim()
        ? course.control_type
        : CONTROL_TYPE_EMPTY,
      credit: course.credit ?? 0,
      amount_hours: course.amount_hours ?? 0,
      lecture_hours: course.lecture_hours ?? 0,
      practice_hours: course.practice_hours ?? 0,
      lab_hours: course.lab_hours ?? 0,
    });
  }, [course, isDialogOpen, reset, resolvedDisciplineId]);

  const creditValue = watch("credit");
  useEffect(() => {
    const parsed = Number(creditValue);
    const amount = Number.isFinite(parsed) ? parsed * HOURS_PER_CREDIT : 0;
    setValue("amount_hours", amount);
  }, [creditValue, setValue]);

  const handleDisciplineChange = (disciplineId: string) => {
    setValue("disciplineId", disciplineId, { shouldValidate: true });
    const selected = availableOptions.find((item) => String(item.value) === disciplineId);
    if (!selected) return;

    if (selected.cycle) setValue("cycle", selected.cycle);
    if (selected.course_type) {
      setValue("course_type", selected.course_type, { shouldValidate: true });
    }
    if (selected.control_form) setValue("control_form", selected.control_form);
    if (selected.control_type) {
      setValue("control_type", selected.control_type);
    } else {
      setValue("control_type", CONTROL_TYPE_EMPTY);
    }
    if (typeof selected.credit === "number") setValue("credit", selected.credit);
    if (typeof selected.lecture_hours === "number") setValue("lecture_hours", selected.lecture_hours);
    if (typeof selected.practice_hours === "number") setValue("practice_hours", selected.practice_hours);
    if (typeof selected.lab_hours === "number") setValue("lab_hours", selected.lab_hours);
  };

  const onSubmit = handleSubmit(async (values) => {
    const parsedCourseId = Number(courseId);
    if (!Number.isFinite(parsedCourseId) || !course) {
      toast.error("Не найден курс для редактирования");
      return;
    }

    const selected = availableOptions.find(
      (item) => String(item.value) === values.disciplineId
    );

    try {
      await updateCourse(parsedCourseId, {
        semester: course.semester,
        profile: course.profile ?? null,
        discipline: Number(values.disciplineId),
        department: selected?.depart_id ?? course.department,
        cipher_direction: selected?.cipher_direction,
        discipline_type: selected?.discipline_type,
        name_subject: selected?.label ?? course.name_subject,
        dep: selected?.dep ?? course.dep,
        cycle: selected?.cycle ?? (values.cycle || null),
        course_type: selected?.course_type ?? values.course_type,
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
        group: course.group ?? null,
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: curriculumKeys.courses() }),
        queryClient.invalidateQueries({ queryKey: ["syllabus-report"] }),
      ]);

      toast.success("Изменения сохранены");
      closeForm(FormQuery.EDIT_COURSE);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось сохранить изменения");
    }
  });

  const handleDelete = async () => {
    const parsedCourseId = Number(courseId);
    if (!Number.isFinite(parsedCourseId) || !course) {
      toast.error("Не найден курс для удаления");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCourse(parsedCourseId, {
        semester: course.semester,
        profile: course.profile ?? null,
        discipline: course.discipline,
        group: course.group ?? null,
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: curriculumKeys.courses() }),
        queryClient.invalidateQueries({ queryKey: ["syllabus-report"] }),
      ]);

      toast.success("Дисциплина удалена");
      setDeleteConfirmOpen(false);
      closeForm(FormQuery.EDIT_COURSE);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось удалить дисциплину");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={() => closeForm(FormQuery.EDIT_COURSE)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактирование дисциплины</DialogTitle>
          <DialogDescription>Измените параметры выбранного курса</DialogDescription>
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
                options={availableOptions}
                value={watch("disciplineId") ?? ""}
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
              <Input type="number" step="any" min="0" {...register("credit")} placeholder="0" />
              {errors.credit && <FieldError>{errors.credit.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Всего ауд.</FieldLabel>
              <Input
                type="number"
                step="any"
                min="0"
                {...register("amount_hours")}
                placeholder="0"
                readOnly
              />
              {errors.amount_hours && <FieldError>{errors.amount_hours.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Лекции</FieldLabel>
              <Input type="number" step="any" min="0" {...register("lecture_hours")} placeholder="0" />
              {errors.lecture_hours && <FieldError>{errors.lecture_hours.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Практика</FieldLabel>
              <Input type="number" step="any" min="0" {...register("practice_hours")} placeholder="0" />
              {errors.practice_hours && <FieldError>{errors.practice_hours.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Лаб.</FieldLabel>
              <Input type="number" step="any" min="0" {...register("lab_hours")} placeholder="0" />
              {errors.lab_hours && <FieldError>{errors.lab_hours.message}</FieldError>}
            </Field>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="destructive"
              onClick={() => setDeleteConfirmOpen(true)}
              disabled={isSubmitting || isDeleting}
            >
              {isDeleting ? "Удаление..." : "Удалить дисциплину"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => closeForm(FormQuery.EDIT_COURSE)}
              disabled={isSubmitting || isDeleting}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting || isDeleting}>
              {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </div>
        </form>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Удалить дисциплину?</DialogTitle>
            <DialogDescription>
              {course ? (
                <>Будет удалена дисциплина «{course.name_subject}». Это действие нельзя отменить.</>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={isDeleting}
            >
              Отмена
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleDelete()}
              disabled={isDeleting}
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CourseEditDialog;
