import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useChangePassword, usePatchCurrentUser } from "entities/user";
import type { CurrentUser } from "entities/user";
import { getHttpErrorMessage } from "shared/lib/http-error";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "shared/ui";
import { cn } from "shared/lib/utils";
import { toast } from "sonner";

const inputClassName = cn(
  "h-11 rounded-xl border-input bg-white px-3.5 py-2.5 text-[15px] font-normal leading-[1.4] text-foreground",
  "transition-[border-color,box-shadow] duration-150",
  "focus-visible:border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
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
  open: boolean;
  user: CurrentUser;
  loginUsername: string;
  loginPassword: string;
  onComplete: () => void;
};

export function AccountSafetyAfterLoginDialog({
  open,
  user,
  loginUsername,
  loginPassword,
  onComplete,
}: Props) {
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

  useEffect(() => {
    if (open) {
      form.reset({
        email: user.email ?? "",
        new_password: "",
        new_password_confirm: "",
      });
    }
  }, [open, user, form]);

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
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-h-[min(90vh,640px)] overflow-y-auto sm:max-w-[440px]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-left text-lg">
            Безопасный пароль и почта
          </DialogTitle>
          <DialogDescription className="text-left text-[13px] leading-relaxed">
            Пароль совпадает с ПИН — задайте другой. Укажите или проверьте
            электронную почту: она понадобится, чтобы сбросить пароль, если
            забудете его.
          </DialogDescription>
        </DialogHeader>

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
            <Label
              htmlFor="safety-new-pw"
              className="text-[13px] font-semibold"
            >
              Новый пароль
            </Label>
            <Input
              id="safety-new-pw"
              type="password"
              autoComplete="new-password"
              className={inputClassName}
              {...form.register("new_password")}
            />
            {form.formState.errors.new_password && (
              <p className="text-[13px] text-destructive">
                {form.formState.errors.new_password.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="safety-new-pw2"
              className="text-[13px] font-semibold"
            >
              Повторите пароль
            </Label>
            <Input
              id="safety-new-pw2"
              type="password"
              autoComplete="new-password"
              className={inputClassName}
              {...form.register("new_password_confirm")}
            />
            {form.formState.errors.new_password_confirm && (
              <p className="text-[13px] text-destructive">
                {form.formState.errors.new_password_confirm.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl font-semibold sm:w-auto"
            >
              Сохранить и продолжить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
