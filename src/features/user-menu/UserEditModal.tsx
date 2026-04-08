
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "shared/ui";
import { useForm, FormField, InferFormValues } from "shared/lib";
import { z } from "zod";
import { Settings, Camera } from "lucide-react";
import { useState, useRef } from "react";

const settingsSchema = z.object({
  first_name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  surname: z.string().min(2, "Фамилия должна содержать минимум 2 символа"),
  email: z.string().email("Некорректный email"),
  number_phone: z.string().min(5, "Введите корректный номер телефона"),
  position: z.string().min(2, "Введите должность"),
  avatar: z.string().optional(),
});

type SettingsFormValues = InferFormValues<typeof settingsSchema>;

export function UserEditModal({
  user,
}: {
  user: SettingsFormValues;
}) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<SettingsFormValues>({
    schema: settingsSchema,
    defaultValues: user,
  });

  const initials = `${user.first_name?.[0] || ""}${user.surname?.[0] || ""}`.toUpperCase();
  
  const avatarPreview = avatarFile
    ? URL.createObjectURL(avatarFile)
    : user.avatar;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      setAvatarFile(file);
    }
  };

  const onSubmit = form.handleSubmit(async (data) => {
    console.log("✅ Сохранено:", data);
    if (avatarFile) {
      console.log("📸 Новый аватар:", avatarFile);
    }
    // Тут можно добавить реальный запрос, например:
    // await api.updateUserSettings(data, avatarFile);
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="flex items-center gap-2 border w-full justify-center">
          <Settings className="w-4 h-4" />
          Настройки
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-3xl p-7 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Настройки профиля</DialogTitle>
          <DialogDescription>
            Измените личные данные и сохраните изменения.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 mt-2">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleAvatarClick}
              className="group relative size-20 shrink-0 cursor-pointer rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <Avatar className="size-20">
                <AvatarImage
                  src={avatarPreview}
                  alt={`${user.first_name} ${user.surname}`}
                  className="object-cover"
                />
                <AvatarFallback className="text-xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="size-6 text-white" />
              </div>
            </button>
            <div className="space-y-1">
              <p className="text-sm font-medium">Фото профиля</p>
              <p className="text-xs text-muted-foreground">
                Нажмите на аватар для загрузки
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG или GIF. Макс 2MB.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField form={form} name="first_name" label="Имя" required />
            <FormField form={form} name="surname" label="Фамилия" required />
          </div>

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
