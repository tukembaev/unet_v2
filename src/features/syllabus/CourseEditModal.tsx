import { z } from "zod";
import { SyllabusCourse } from "entities/education-management/model/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "shared/ui/dialog";
import { Button, Input, Field, FieldLabel, FieldError } from "shared/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  code: z.string().optional(),
  name_subject: z.string().min(1, "Обязательное поле"),
  dep: z.string().optional(),
  cycle: z.string().optional(),
  course_type: z.string().optional(),
  control_form: z.string().optional(),
  credit: z.coerce.number().min(0, "Минимум 0").optional(),
  amount_hours: z.coerce.number().min(0, "Минимум 0").optional(),
  lecture_hours: z.coerce.number().min(0, "Минимум 0").optional(),
  practice_hours: z.coerce.number().min(0, "Минимум 0").optional(),
  lab_hours: z.coerce.number().min(0, "Минимум 0").optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: SyllabusCourse | null;
}

export const CourseEditModal = ({ open, onOpenChange, course }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: course?.code ?? "",
      name_subject: course?.name_subject ?? "",
      dep: course?.dep ?? "",
      cycle: course?.cycle ?? "",
      course_type: course?.course_type ?? "",
      control_form: course?.control_form ?? "",
      credit: course?.credit ?? 0,
      amount_hours: course?.amount_hours ?? 0,
      lecture_hours: course?.lecture_hours ?? 0,
      practice_hours: course?.practice_hours ?? 0,
      lab_hours: course?.lab_hours ?? 0,
    },
  });

  const onSubmit = handleSubmit((values) => {
    console.log("Course submit (mock)", values);
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Редактирование дисциплины</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Код дисциплины</FieldLabel>
              <Input {...register("code")} placeholder="Введите код" />
              {errors.code && <FieldError>{errors.code.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Наименование предмета <span className="text-destructive">*</span></FieldLabel>
              <Input {...register("name_subject")} placeholder="Введите название" />
              {errors.name_subject && <FieldError>{errors.name_subject.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Кафедра</FieldLabel>
              <Input {...register("dep")} placeholder="Введите кафедру" />
              {errors.dep && <FieldError>{errors.dep.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Цикл</FieldLabel>
              <Input {...register("cycle")} placeholder="Например: ОГЦ, МЕН" />
              {errors.cycle && <FieldError>{errors.cycle.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Статус</FieldLabel>
              <Input {...register("course_type")} placeholder="Базовая часть / Вузовский компонент" />
              {errors.course_type && <FieldError>{errors.course_type.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Форма контроля</FieldLabel>
              <Input {...register("control_form")} placeholder="Экзамен / Зачет" />
              {errors.control_form && <FieldError>{errors.control_form.message}</FieldError>}
            </Field>
          </div>

          <div className="grid grid-cols-5 gap-4">
            <Field>
              <FieldLabel>Кредиты</FieldLabel>
              <Input type="number" {...register("credit")} placeholder="0" />
              {errors.credit && <FieldError>{errors.credit.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Всего ауд.</FieldLabel>
              <Input type="number" {...register("amount_hours")} placeholder="0" />
              {errors.amount_hours && <FieldError>{errors.amount_hours.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Лекции</FieldLabel>
              <Input type="number" {...register("lecture_hours")} placeholder="0" />
              {errors.lecture_hours && <FieldError>{errors.lecture_hours.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Практики</FieldLabel>
              <Input type="number" {...register("practice_hours")} placeholder="0" />
              {errors.practice_hours && <FieldError>{errors.practice_hours.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Лабы</FieldLabel>
              <Input type="number" {...register("lab_hours")} placeholder="0" />
              {errors.lab_hours && <FieldError>{errors.lab_hours.message}</FieldError>}
            </Field>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">Сохранить изменения</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseEditModal;


