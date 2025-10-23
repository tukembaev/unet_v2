import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Download,
  Eye,
  EyeOff,
  HelpCircle,
  LogIn,
  Mail,
  QrCode,
} from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ScaleLoader } from "react-spinners";
import { HelloTextEffect } from "shared/components/animated-ui/HelloEffect";
import { FormField } from "shared/lib";
import { Button, Card, CardContent, CardHeader } from "shared/ui";
import { useLogin } from "../model/queries";
import { LoginFormValues, loginSchema } from "../model/schema";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { PinModal } from "./PinCodeModal";


export const LoginForm: React.FC = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })
  const { mutateAsync: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const handleLogin = async (values: LoginFormValues) => {
    try {
      await login(values);
      setShowPinModal(true)
    } catch (err) {
      console.error("Ошибка входа:", err);
    }
  };

  return (
    <div
    className="flex justify-center items-center min-h-screen bg-cover ">
      <div className="bg-card text-card-foreground p-2 rounded-3xl shadow w-full max-w-md border">
        <Card className="shadow-none border-none">
          <CardHeader className="flex flex-col justify-center items-center gap-1">
            <HelloTextEffect speed={0.4} />
            
            {/* Анимированный текст "to" */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 1.6,
                ease: "easeOut"
              }}
              className="text-center text-xl font-medium text-muted-foreground"
            >
              to
            </motion.div>

            {/* Анимированный текст "Unet V2" */}
            <motion.div
              initial={{ opacity: 0, y: 10 ,marginTop: -10}}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 1.9,
                ease: "easeOut"
              }}
              className="text-5xl animate-gradient bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-bold tracking-tight text-center font-bold text-primary"
            >
              Unet V2
            </motion.div>

            {/* <CardTitle className="text-2xl font-semibold text-primary text-center">
              {forgotPassword ? "Восстановление пароля" : "Вход в систему"}
            </CardTitle> */}
          </CardHeader>

          <CardContent>
            {!forgotPassword ? (
              <form
                onSubmit={form.handleSubmit(handleLogin)}
                className="space-y-4"
              >
                {/* Поле ИНН */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    ИНН
                  </label>
                  <FormField
                    form={form}
                    name="username"
                    placeholder="Введите ИНН"
                    
                  />
                </div>

                {/* Поле пароль */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Пароль
                  </label>
                  <div className="relative">
                    <FormField
                      form={form}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Введите пароль"
                      
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-primary"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Кнопка входа */}
                <Button
                  type="submit"
                  disabled={isPending || form.formState.isSubmitting}
                  className="w-full"
                >
                  {isPending || form.formState.isSubmitting ? (
                    <ScaleLoader height={10} color="currentColor" />
                  ) : (
                    <>
                      <LogIn size={18} />
                      Войти
                    </>
                  )}
                </Button>

                {/* Забыли пароль */}
                <p
                  className="text-right text-sm text-primary cursor-pointer hover:underline m-0"
                  onClick={() => setForgotPassword(true)}
                >
                  Забыли пароль?
                </p>
                {/* Google */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 rounded-lg"
                >
                  <Mail size={18} />
                  Войти через Google
                </Button>

                {/* Подсказка */}
                <p className="text-center text-muted-foreground text-sm mt-4">
                  Пароль по умолчанию — ваш ИНН (для сотрудников). <br />
                  Для студентов — s + ИНН.
                </p>

                <hr className="my-4" />

                <p className="text-center text-muted-foreground text-sm mb-2">
                  Дополнительно от UNET
                </p>

                {/* Дополнительные кнопки */}
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="flex justify-center items-center gap-2"
                    asChild
                  >
                    <a href="http://uadmin.kstu.kg/media/media/task_docs/UNET_user_guide.pdf">
                      Руководство пользователя
                      <HelpCircle size={18} />
                    </a>
                  </Button>
                  <div className="flex w-full justify-between gap-2">
                    <Button
                      variant="outline"
                      className="flex justify-center items-center w-full gap-2"
                      onClick={() =>
                        (window.location.href = "https://qr.kstu.kg")
                      }
                    >
                      qr.kstu.kg
                      <QrCode size={18} />
                    </Button>

                    <Button
                      variant="outline"
                      className="flex justify-center items-center w-full gap-2"
                    >
                      Скачать
                      <Download size={18} />
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <ForgotPasswordForm setForgotPassword={setForgotPassword} />
            )}
          </CardContent>
        </Card>
      </div>
      <PinModal open={showPinModal} onClose={() => setShowPinModal(false)}  />
    </div>
    
  );
};
