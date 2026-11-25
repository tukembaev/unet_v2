import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

import { useChangePassword, usePatchCurrentUser } from "entities/user";
import type { CurrentUser } from "entities/user";
import { getHttpErrorMessage } from "shared/lib/http-error";
import { Button, Input, Label } from "shared/ui";
import { cn } from "shared/lib/utils";
import { toast } from "sonner";

const inputClassName = cn(
  "h-12 rounded-xl border-input bg-white px-3.5 py-3 text-[15px] font-normal leading-[1.4] text-foreground",
  "transition-[border-color,box-shadow] duration-150",
  "placeholder:text-muted-foreground/80",
  "focus-visible:border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
  "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-65"
);

function buildSchema(username: string) {
  return z
    .object({
      email: z.string().min(1, "Укажите почту").email("Некорректный email"),
      new_password: z
        .string()
        .min(8, "Не менее 8 символов")
        .refine((v) => v !== username, {
          message: "Пароль не должен совпадать с ПИН",
        }),
      new_password_confirm: z.string().min(1, "Повторите пароль"),
    })
    .superRefine((data, ctx) => {
      if (data.new_password !== data.new_password_confirm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Пароли не совпадают",
          path: ["new_password_confirm"],
        });
      }
    });
}

type Props = {
  user: CurrentUser;
  loginUsername: string;
  loginPassword: string;
  onComplete: () => void;
};

export function AccountSafetyAfterLoginForm({
  user,
  loginUsername,
  loginPassword,
  onComplete,
}: Props) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const patchUser = usePatchCurrentUser();
  const changePwd = useChangePassword();

  const schema = buildSchema(loginUsername.trim());
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: user.email ?? "",
      new_password: "",
      new_password_confirm: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await patchUser.mutateAsync({
        email: values.email.trim(),
      });
      await changePwd.mutateAsync({
        current_password: loginPassword,
        new_password: values.new_password,
      });
      toast.success("Данные учётной записи сохранены");
      onComplete();
    } catch (err) {
      toast.error("Не удалось сохранить", {
        description: getHttpErrorMessage(
          err,
          "Проверьте поля или попробуйте позже."
        ),
      });
    }
  });

  const busy = patchUser.isPending || changePwd.isPending;

  return (
    <section className="w-full">
      <h2 className="mb-2 text-[22px] font-bold leading-[1.25] tracking-[-0.02em] text-foreground">
        Безопасный пароль и почта
      </h2>
      <p className="mb-5 text-[13px] leading-relaxed text-muted-foreground">
        Пароль совпадает с ПИН — задайте другой. Укажите или проверьте
        электронную почту: она понадобится, чтобы сбросить пароль, если
        забудете его.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="safety-email" className="text-[13px] font-semibold">
            Электронная почта
          </Label>
          <Input
            id="safety-email"
            type="email"
            autoComplete="email"
            className={inputClassName}
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-[13px] text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-amber-200/80 bg-amber-50 px-3 py-2 text-[13px] text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
          Использовать ПИН как пароль небезопасно — придумайте отдельный
          пароль.
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="safety-new-pw" className="text-[13px] font-semibold">
            Новый пароль
          </Label>
          <div className="relative">
            <Input
              id="safety-new-pw"
              type={showNewPassword ? "text" : "password"}
              autoComplete="new-password"
              className={cn(inputClassName, "pr-11")}
              {...form.register("new_password")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showNewPassword ? "Скрыть пароль" : "Показать пароль"}
              onClick={() => setShowNewPassword((prev) => !prev)}
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden />
              ) : (
                <Eye className="h-4 w-4" aria-hidden />
              )}
            </button>
          </div>
          {form.formState.errors.new_password && (
            <p className="text-[13px] text-destructive">
              {form.formState.errors.new_password.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="safety-new-pw2" className="text-[13px] font-semibold">
            Повторите пароль
          </Label>
          <div className="relative">
            <Input
              id="safety-new-pw2"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              className={cn(inputClassName, "pr-11")}
              {...form.register("new_password_confirm")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={
                showConfirmPassword ? "Скрыть пароль" : "Показать пароль"
              }
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden />
              ) : (
                <Eye className="h-4 w-4" aria-hidden />
              )}
            </button>
          </div>
          {form.formState.errors.new_password_confirm && (
            <p className="text-[13px] text-destructive">
              {form.formState.errors.new_password_confirm.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={busy}
          className="mt-1 h-auto min-h-[42px] w-full rounded-xl px-[18px] py-3 text-[15px] font-semibold shadow-sm"
        >
          Сохранить и продолжить
        </Button>
      </form>
    </section>
  );
}
