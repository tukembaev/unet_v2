
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Camera, KeyRound, Settings, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "shared/ui";
import { getHttpErrorMessage } from "shared/lib/http-error";
import { toast } from "sonner";
import {
  useChangePassword,
  usePatchCurrentUser,
  useUploadCurrentUserAvatar,
  type CurrentUser,
} from "entities/user";

const profileSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  middle_name: z.string().optional(),
  email: z.string().email("Некорректный email").or(z.literal("")),
  phone_number: z.string().optional(),
  birth_date: z.string().optional(),
});

const passwordSchema = z
  .object({
    current_password: z.string(),
    new_password: z.string(),
    new_password_repeat: z.string(),
  })
  .superRefine((v, ctx) => {
    const hasAny = Boolean(
      v.current_password.trim() || v.new_password.trim() || v.new_password_repeat.trim()
    );
    if (!hasAny) return;
    if (!v.current_password.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Введите текущий пароль",
        path: ["current_password"],
      });
    }
    if (!v.new_password.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Введите новый пароль",
        path: ["new_password"],
      });
    } else if (v.new_password.trim().length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Минимум 8 символов",
        path: ["new_password"],
      });
    }
    if (v.new_password !== v.new_password_repeat) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Пароли не совпадают",
        path: ["new_password_repeat"],
      });
    }
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

function firstErrorMessage(errors: Record<string, unknown>): string {
  const first = Object.values(errors)[0];
  if (!first || typeof first !== "object") return "Проверьте корректность полей.";
  const message = (first as { message?: unknown }).message;
  if (typeof message === "string" && message.trim()) return message;
  return "Проверьте корректность полей.";
}

type Props = {
  user: CurrentUser;
  position: string;
};

export function UserEditModal({ user, position }: Props) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const patchUser = usePatchCurrentUser();
  const changePassword = useChangePassword();
  const uploadAvatar = useUploadCurrentUserAvatar();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      middle_name: user.middle_name ?? "",
      email: user.email ?? "",
      phone_number: user.phone_number ?? "",
      birth_date: user.birth_date ?? "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_repeat: "",
    },
  });

  useEffect(() => {
    profileForm.reset({
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      middle_name: user.middle_name ?? "",
      email: user.email ?? "",
      phone_number: user.phone_number ?? "",
      birth_date: user.birth_date ?? "",
    });
    setAvatarFile(null);
    setAvatarPreview(null);
  }, [user, profileForm]);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const initials = `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase();

  const onAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Нужен файл изображения");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Максимальный размер фото 5MB");
      return;
    }
    setAvatarFile(file);
  };

  const saveAvatar = async () => {
    if (!avatarFile) {
      toast.info("Сначала выберите фото");
      return;
    }
    try {
      await uploadAvatar.mutateAsync(avatarFile);
      toast.success("Фото профиля обновлено");
      setAvatarFile(null);
    } catch (err) {
      toast.error("Не удалось обновить фото", {
        description: getHttpErrorMessage(err, "Проверьте формат файла или попробуйте позже."),
      });
    }
  };

  const onSaveProfile = profileForm.handleSubmit(
    async (values) => {
      const payload: Partial<ProfileFormValues> = {};
      const keys: (keyof ProfileFormValues)[] = [
        "first_name",
        "last_name",
        "middle_name",
        "email",
        "phone_number",
        "birth_date",
      ];
      keys.forEach((key) => {
        const next = (values[key] ?? "").trim();
        const prev = String((user as unknown as Record<string, unknown>)[key] ?? "").trim();
        if (next && next !== prev) payload[key] = next;
      });

      if (!Object.keys(payload).length && !avatarFile) {
        toast.info("Нет изменений для сохранения");
        return;
      }
      try {
        if (Object.keys(payload).length) {
          await patchUser.mutateAsync(payload);
        }
        if (avatarFile) {
          await uploadAvatar.mutateAsync(avatarFile);
          setAvatarFile(null);
        }
        toast.success("Профиль обновлен");
      } catch (err) {
        toast.error("Не удалось сохранить профиль", {
          description: getHttpErrorMessage(err, "Проверьте данные и попробуйте снова."),
        });
      }
    },
    (errors) => {
      toast.error("Ошибка валидации профиля", {
        description: firstErrorMessage(errors as Record<string, unknown>),
      });
    }
  );

  const onSavePassword = passwordForm.handleSubmit(
    async (values) => {
      const hasAny = Boolean(
        values.current_password.trim() ||
          values.new_password.trim() ||
          values.new_password_repeat.trim()
      );
      if (!hasAny) {
        toast.info("Введите пароли для изменения");
        return;
      }
      try {
        await changePassword.mutateAsync({
          current_password: values.current_password,
          new_password: values.new_password,
        });
        passwordForm.reset({
          current_password: "",
          new_password: "",
          new_password_repeat: "",
        });
        toast.success("Пароль изменен");
      } catch (err) {
        toast.error("Не удалось изменить пароль", {
          description: getHttpErrorMessage(err, "Проверьте текущий пароль."),
        });
      }
    },
    (errors) => {
      toast.error("Ошибка валидации пароля", {
        description: firstErrorMessage(errors as Record<string, unknown>),
      });
    }
  );

  const busy = patchUser.isPending || changePassword.isPending || uploadAvatar.isPending;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="flex w-full items-center justify-center gap-2 border">
          <Settings className="h-4 w-4" />
          Настройки
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-3xl p-6 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Настройки профиля</DialogTitle>
          <DialogDescription>
            Все поля необязательные. Должность редактировать нельзя.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="gap-2">
              <UserRound className="h-4 w-4" />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="password" className="gap-2">
              <KeyRound className="h-4 w-4" />
              Пароль
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-5 pt-4">
            <div className="rounded-2xl border p-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative h-20 w-20 rounded-full p-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 via-sky-400 to-cyan-400" />
                  <Avatar className="relative h-full w-full border-2 border-background">
                    <AvatarImage src={avatarPreview ?? user.avatar_url ?? undefined} />
                    <AvatarFallback>{initials || "UU"}</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 opacity-0 transition group-hover:opacity-100">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Фото профиля</p>
                  <p className="text-xs text-muted-foreground">
                    JPG/PNG/WebP, до 5MB. Нажмите на аватар для выбора.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={saveAvatar} disabled={busy}>
                      Сохранить фото
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={onAvatarChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={onSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="first_name">Имя</Label>
                  <Input id="first_name" {...profileForm.register("first_name")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last_name">Фамилия</Label>
                  <Input id="last_name" {...profileForm.register("last_name")} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="middle_name">Отчество</Label>
                <Input id="middle_name" {...profileForm.register("middle_name")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...profileForm.register("email")} />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="phone_number">Телефон</Label>
                  <Input id="phone_number" {...profileForm.register("phone_number")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="birth_date">Дата рождения</Label>
                  <Input id="birth_date" type="date" {...profileForm.register("birth_date")} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="position">Должность</Label>
                <Input id="position" value={position} disabled readOnly />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                Сохранить профиль
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="password" className="pt-4">
            <form onSubmit={onSavePassword} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="current_password">Текущий пароль</Label>
                <Input id="current_password" type="password" {...passwordForm.register("current_password")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new_password">Новый пароль</Label>
                <Input id="new_password" type="password" {...passwordForm.register("new_password")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new_password_repeat">Повторите новый пароль</Label>
                <Input
                  id="new_password_repeat"
                  type="password"
                  {...passwordForm.register("new_password_repeat")}
                />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                Изменить пароль
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
