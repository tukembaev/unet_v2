import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, LoginFormValues } from "../model/schema";
import { loginRequest } from "../model/api";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "shared/ui";
import { FormField } from "shared/lib";
import { toast } from "sonner";


export const LoginForm: React.FC = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const user = await loginRequest(values.email, values.password);

      toast.success(`Добро пожаловать, ${user.first_name} ${user.surname}!`, {
        description: "Вы успешно вошли в систему.",
      });
      form.reset();

    } catch (error: any) {
      toast.error("Ошибка входа", {
        description: error?.message || "Пожалуйста, попробуйте еще раз.",
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Вход в систему</CardTitle>
        <CardDescription>Введите ваши данные для авторизации</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            form={form}
            name="email"
            label="ИНН"
            placeholder="Введите ИНН"
            required
          />
          <FormField
            form={form}
            name="password"
            type="password"
            label="Пароль"
            placeholder="Введите пароль"
            required
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Загрузка..." : "Войти"}
          </Button>
        </form>
      </CardContent>


    </Card>
  );
};
