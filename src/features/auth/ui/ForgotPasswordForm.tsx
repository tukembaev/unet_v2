import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import {
  forgotPasswordRequest,
  resetPasswordByCode,
  verifyForgotPasswordCode,
} from "../model/api";
import { getHttpErrorMessage } from "shared/lib/http-error";
import { toast } from "sonner";
import { Button, Input, InputOTP, InputOTPGroup, InputOTPSlot, Label } from "shared/ui";

interface ForgotPasswordFormProps {
  setForgotPassword: (value: boolean) => void;
}

const usernameSchema = z
  .string()
  .min(3, "Введите ИНН или email")
  .refine((v) => /^\d{8,}$/.test(v) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
    message: "Введите корректный ИНН или email",
  });

const codeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Код должен содержать 6 цифр");

const passwordSchema = z
  .object({
    password: z.string().min(8, "Пароль должен быть не менее 8 символов"),
    confirmPassword: z.string().min(8, "Подтверждение должно быть не менее 8 символов"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type Step = "request" | "verify" | "reset";

export const ForgotPasswordForm = ({
  setForgotPassword,
}: ForgotPasswordFormProps) => {
  const [step, setStep] = useState<Step>("request");
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const onRequestCode = async () => {
    setErrorText(null);
    const parsed = usernameSchema.safeParse(username.trim());
    if (!parsed.success) {
      setErrorText(parsed.error.issues[0]?.message ?? "Проверьте введенные данные");
      return;
    }
    setIsLoading(true);
    try {
      await forgotPasswordRequest(parsed.data);
      setStep("verify");
      toast.success("Код отправлен", {
        description: "Проверьте почту и введите 6-значный код.",
      });
    } catch (error) {
      setErrorText(getHttpErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyCode = async () => {
    setErrorText(null);
    const parsed = codeSchema.safeParse(code.trim());
    if (!parsed.success) {
      setErrorText(parsed.error.issues[0]?.message ?? "Введите корректный код");
      return;
    }
    setIsLoading(true);
    try {
      await verifyForgotPasswordCode(parsed.data);
      setStep("reset");
      toast.success("Код подтвержден");
    } catch (error) {
      setErrorText(getHttpErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPassword = async () => {
    setErrorText(null);
    const parsed = passwordSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      setErrorText(parsed.error.issues[0]?.message ?? "Проверьте пароль");
      return;
    }
    setIsLoading(true);
    try {
      await resetPasswordByCode(code, parsed.data.password);
      toast.success("Пароль успешно обновлен");
      setForgotPassword(false);
    } catch (error) {
      setErrorText(getHttpErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-[400px] font-['Nunito',sans-serif]">
      <h2 className="mb-2 text-[22px] font-bold leading-[1.25] tracking-[-0.02em] text-foreground">
        Восстановление пароля
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        {step === "request" && "Введите ИНН или email для отправки кода."}
        {step === "verify" && "Введите 6-значный код из письма."}
        {step === "reset" && "Задайте новый пароль."}
      </p>

      <div className="mt-2 space-y-5">
        {step === "request" && (
          <div>
            <Label htmlFor="recover-username" className="mb-1.5 text-[13px] font-semibold text-muted-foreground">
              ИНН или email
            </Label>
            <Input
              id="recover-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите ИНН или email"
              autoComplete="username"
            />
          </div>
        )}

        {step === "verify" && (
          <div>
            <Label htmlFor="recover-code" className="mb-1.5 text-[13px] font-semibold text-muted-foreground">
              Код подтверждения
            </Label>
            <InputOTP
              value={code}
              onChange={(value) => setCode(value)}
              maxLength={6}
              pattern="^[0-9]*$"
              containerClassName="w-full justify-start"
            >
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} className="h-11 w-11 rounded-md border" />
                <InputOTPSlot index={1} className="h-11 w-11 rounded-md border" />
                <InputOTPSlot index={2} className="h-11 w-11 rounded-md border" />
                <InputOTPSlot index={3} className="h-11 w-11 rounded-md border" />
                <InputOTPSlot index={4} className="h-11 w-11 rounded-md border" />
                <InputOTPSlot index={5} className="h-11 w-11 rounded-md border" />
              </InputOTPGroup>
            </InputOTP>
            <p className="mt-2 text-xs text-muted-foreground">Введите 6 цифр из письма</p>
          </div>
        )}

        {step === "reset" && (
          <>
            <div>
              <Label htmlFor="recover-password" className="mb-1.5 text-[13px] font-semibold text-muted-foreground">
                Новый пароль
              </Label>
              <div className="relative">
                <Input
                  id="recover-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Введите новый пароль"
                  autoComplete="new-password"
                  className="h-12 rounded-xl pr-11"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-1.5 top-1/2 h-8 w-8 -translate-y-1/2 rounded-lg border-border/60 text-muted-foreground"
                  aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="recover-password2" className="mb-1.5 text-[13px] font-semibold text-muted-foreground">
                Подтвердите пароль
              </Label>
              <div className="relative">
                <Input
                  id="recover-password2"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Повторите пароль"
                  autoComplete="new-password"
                  className="h-12 rounded-xl pr-11"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-1.5 top-1/2 h-8 w-8 -translate-y-1/2 rounded-lg border-border/60 text-muted-foreground"
                  aria-label={showConfirmPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </>
        )}

        {errorText ? <p className="text-sm text-destructive">{errorText}</p> : null}

        <Button
          type="button"
          className="w-full rounded-xl py-3 font-semibold"
          disabled={isLoading}
          onClick={() => {
            if (step === "request") void onRequestCode();
            if (step === "verify") void onVerifyCode();
            if (step === "reset") void onResetPassword();
          }}
        >
          {isLoading
            ? "Обработка..."
            : step === "request"
              ? "Отправить код"
              : step === "verify"
                ? "Проверить код"
                : "Сохранить пароль"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (step === "verify") {
              setStep("request");
              setErrorText(null);
              return;
            }
            if (step === "reset") {
              setStep("verify");
              setErrorText(null);
              return;
            }
            setForgotPassword(false);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl"
        >
          <ArrowLeft size={18} />
          {step === "request" ? "Назад" : "К предыдущему шагу"}
        </Button>
      </div>
    </section>
  );
};
