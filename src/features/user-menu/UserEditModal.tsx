
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
} from "shared/ui";
import { useForm, FormField, InferFormValues } from "shared/lib";
import { z } from "zod";
import { Settings } from "lucide-react";

// 🧱 Компонент модалки
// 💾 Схема для формы настроек
const settingsSchema = z.object({
  first_name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  surname: z.string().min(2, "Фамилия должна содержать минимум 2 символа"),
  email: z.string().email("Некорректный email"),
  number_phone: z.string().min(5, "Введите корректный номер телефона"),
  position: z.string().min(2, "Введите должность"),
});

type SettingsFormValues = InferFormValues<typeof settingsSchema>;

export function UserEditModal({
  user,
}: {
  user: SettingsFormValues;
}) {
  const form = useForm<SettingsFormValues>({
    schema: settingsSchema,
    defaultValues: user,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    console.log("✅ Сохранено:", data);
    // Тут можно добавить реальный запрос, например:
    // await api.updateUserSettings(data);
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="flex items-center gap-2 border w-full justify-center">
          <Settings className="w-4 h-4" />
          Настройки
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-3xl p-7 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Настройки профиля</DialogTitle>
          <DialogDescription>
            Измените личные данные и сохраните изменения.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 mt-2">
          <FormField form={form} name="first_name" label="Имя" required />
          <FormField form={form} name="surname" label="Фамилия" required />
          <FormField form={form} name="email" label="Email" type="email" required />
          <FormField form={form} name="number_phone" label="Телефон" required />
          <FormField form={form} name="position" label="Должность" required />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="submit">Сохранить</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
