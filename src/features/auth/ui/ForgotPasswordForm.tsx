import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormField } from "shared/lib/form";
import { AppLogo, Button, Label } from "shared/ui";

interface ForgotPasswordFormProps {
  setForgotPassword: (value: boolean) => void;
}

// ✅ схема валидации
const formSchema = z.object({
  inn: z
    .string()
    .min(8, { message: "ИНН должен содержать минимум 8 символов" })
    .regex(/^\d+$/, { message: "ИНН должен содержать только цифры" }),
});

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  setForgotPassword,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inn: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      console.log("Отправляем запрос для ИНН:", values.inn);
      // 🔹 Здесь добавь свой API-запрос
    } catch (error) {
      console.error("Ошибка при восстановлении пароля:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-[400px] font-['Nunito',sans-serif]">
        <div className="mb-6 flex justify-center">
          <AppLogo size="lg" className="max-h-14" />
        </div>
        <h2 className="mb-5 text-[22px] font-bold leading-[1.25] tracking-[-0.02em] text-foreground">
          Восстановление пароля
        </h2>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-2 space-y-5"
        >
          <div>
            <Label htmlFor="recover-inn" className="mb-1.5 text-[13px] font-semibold text-muted-foreground">
              ИНН
            </Label>
            <FormField
              form={form}
              name="inn"
              placeholder="Введите ИНН"
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl py-3 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Отправка..." : "Отправить"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setForgotPassword(false)}
            className="flex w-full items-center justify-center gap-2 rounded-xl"
          >
            <ArrowLeft size={18} />
            Назад
          </Button>
        </form>
    </section>
  );
};
