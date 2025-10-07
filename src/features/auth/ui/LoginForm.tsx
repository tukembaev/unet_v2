import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, LoginFormValues } from "../model/schema";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "shared/ui";
import { FormField } from "shared/lib";
import { useLogin } from "../model/queries";


export const LoginForm: React.FC = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutateAsync: login, isPending } = useLogin();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Вход в систему</CardTitle>
        <CardDescription>Введите ваши данные для авторизации</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit((values) => login(values))} // 🔥 используем login напрямую
          className="space-y-4"
        >
          <FormField
            form={form}
            name="username"
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

          <Button type="submit" disabled={isPending || form.formState.isSubmitting}>
            {isPending || form.formState.isSubmitting ? "Загрузка..." : "Войти"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
