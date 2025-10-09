import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormField } from "shared/lib/form";
import { Button } from "shared/ui/button";
import { Card, CardContent } from "shared/ui/card";

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
    <Card className="w-full max-w-md border border-border">
      <CardContent className="p-6">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          {/* Поле ИНН */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              ИНН
            </label>
            <FormField
              form={form}
              name="inn"
              placeholder="Введите ИНН"

            />
          </div>

          {/* Кнопка отправки */}
          <Button type="submit" className="w-full bg-[#4b84f4]" disabled={isLoading}>
            {isLoading ? "Отправка..." : "Отправить"}
          </Button>

          {/* Кнопка назад */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setForgotPassword(false)}
            className="w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Назад
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
