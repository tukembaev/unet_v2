import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, LoginFormValues } from "../model/schema";
import { useLogin } from "../model/queries";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "shared/ui";
import { FormField } from "shared/lib";
import { ScaleLoader } from "react-spinners";
import {
  Eye,
  EyeOff,
  HelpCircle,
  Download,
  QrCode,
  LogIn,
  Mail,
} from "lucide-react";
import { PinModal } from "./PinCodeModal";
import { ForgotPasswordForm } from "./ForgotPasswordForm";


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
    className="flex justify-center items-center min-h-screen  bg-cover ">
      <div className="bg-white p-2 rounded-3xl shadow-lg w-full max-w-md">
        <Card className="shadow-none border-none bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-[#4B84F4] text-center">
              {forgotPassword ? "Восстановление пароля" : "Вход в систему"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {!forgotPassword ? (
              <form
                onSubmit={form.handleSubmit(handleLogin)}
                className="space-y-4"
              >
                {/* Поле ИНН */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    ИНН
                  </label> 
                   <Input
                      className="bg-white text-black border border-gray-400 focus:outline-none w-full pr-10"
                      {...form.register("username")}
                      placeholder="Введите ИНН"

                    />
                </div>

                {/* Поле пароль */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Пароль
                  </label>
                  <div className="relative">

                    <Input
                      type={showPassword ? "text" : "password"}
                      className="bg-white text-black  border border-gray-400 focus:outline-none w-full pr-10"
                      {...form.register("password")}
                      placeholder="Введите пароль"

                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-[#4B84F4]"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Кнопка входа */}
                <Button
                  type="submit"
                  disabled={isPending || form.formState.isSubmitting}
                  className="w-full bg-[#4B84F4] text-white font-semibold rounded-md hover:bg-[#6b9cfd] transition flex items-center justify-center "
                >
                  {isPending || form.formState.isSubmitting ? (
                    <ScaleLoader height={10} color="#fff" />
                  ) : (
                    <>
                      <LogIn size={18} />
                      Войти
                    </>
                  )}
                </Button>

                {/* Забыли пароль */}
                <p
                  className="text-right text-sm text-[#4B84F4] cursor-pointer hover:underline m-0"
                  onClick={() => setForgotPassword(true)}
                >
                  Забыли пароль?
                </p>
                {/* Google */}
                <Button
                  type="button"
                  className="w-full text-black bg-white border border-gray-400 flex items-center justify-center gap-2  hover:bg-[#4B84F4] hover:text-white transition rounded-lg"
                >
                  <Mail size={18} />
                  Войти через Google
                </Button>

                {/* Подсказка */}
                <p className="text-center text-gray-600 text-sm mt-4">
                  Пароль по умолчанию — ваш ИНН (для сотрудников). <br />
                  Для студентов — s + ИНН.
                </p>

                <hr className="my-4" />

                <p className="text-center text-gray-600 text-sm mb-2">
                  Дополнительно от UNET
                </p>

                {/* Дополнительные кнопки */}
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="flex bg-white text-black justify-center items-center gap-2 border-gray-500 hover:bg-[#4B84F4] hover:text-white"
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
                      className="flex justify-center items-center w-full gap-2 bg-white text-black border-gray-500 hover:bg-[#4B84F4] hover:text-white"
                      onClick={() =>
                        (window.location.href = "https://qr.kstu.kg")
                      }
                    >
                      qr.kstu.kg
                      <QrCode size={18} />
                    </Button>

                    <Button
                      variant="outline"
                      className="flex justify-center items-center w-full gap-2 bg-white text-black border-gray-500 hover:bg-[#4B84F4] hover:text-white"
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