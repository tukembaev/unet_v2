import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Введите ИНН"),
  password: z.string().min(1, "Введите пароль"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
