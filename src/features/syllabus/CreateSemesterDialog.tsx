import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "shared/ui/dialog";
import { Button, Input, Field, FieldLabel, FieldError, FieldDescription } from "shared/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name_semester: z.string().min(1, "Обязательное поле"),
  count_credit: z.coerce.number().min(0, "Минимум 0"),
  amount_hours: z.coerce.number().min(0, "Минимум 0"),
  lecture_hours: z.coerce.number().min(0, "Минимум 0"),
  practice_hours: z.coerce.number().min(0, "Минимум 0"),
  lab_hours: z.coerce.number().min(0, "Минимум 0"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateSemesterDialog = ({ open, onOpenChange }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name_semester: "",
      count_credit: 0,
      amount_hours: 0,
      lecture_hours: 0,
      practice_hours: 0,
      lab_hours: 0,
    },
  });

  const onSubmit = handleSubmit((values) => {
    console.log("Create semester (mock)", values);
    reset();
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Создать новый семестр</DialogTitle>
          <DialogDescription>
            Добавьте новый семестр к учебному плану
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6">
          <Field>
            <FieldLabel>Номер семестра <span className="text-destructive">*</span></FieldLabel>
            <Input {...register("name_semester")} placeholder="Например: 1, 2, 3..." />
            <FieldDescription>Укажите номер семестра</FieldDescription>
            {errors.name_semester && <FieldError>{errors.name_semester.message}</FieldError>}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Общее количество кредитов</FieldLabel>
              <Input type="number" {...register("count_credit")} placeholder="0" />
              {errors.count_credit && <FieldError>{errors.count_credit.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Всего аудиторных часов</FieldLabel>
              <Input type="number" {...register("amount_hours")} placeholder="0" />
              {errors.amount_hours && <FieldError>{errors.amount_hours.message}</FieldError>}
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field>
              <FieldLabel>Лекционные часы</FieldLabel>
              <Input type="number" {...register("lecture_hours")} placeholder="0" />
              {errors.lecture_hours && <FieldError>{errors.lecture_hours.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Практические часы</FieldLabel>
              <Input type="number" {...register("practice_hours")} placeholder="0" />
              {errors.practice_hours && <FieldError>{errors.practice_hours.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Лабораторные часы</FieldLabel>
              <Input type="number" {...register("lab_hours")} placeholder="0" />
              {errors.lab_hours && <FieldError>{errors.lab_hours.message}</FieldError>}
            </Field>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">Создать семестр</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSemesterDialog;


