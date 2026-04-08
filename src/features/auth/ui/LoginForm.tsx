import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { BookOpen, Download, Eye, EyeOff, QrCode } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { getCurrentUser, type CurrentUser } from "entities/user";
import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Separator
} from "shared/ui";
import { getHttpErrorMessage } from "shared/lib/http-error";
import { cn } from "shared/lib/utils";
import { toast } from "sonner";
import { useLogin } from "../model/queries";
import { LoginFormValues, loginSchema } from "../model/schema";
import { AccountSafetyAfterLoginDialog } from "./AccountSafetyAfterLoginDialog";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { GoogleLoginButton } from "./GoogleLoginButton";

const inputClassName = cn(
  "h-12 rounded-xl border-input bg-white px-3.5 py-3 text-[15px] font-normal leading-[1.4] text-foreground",
  "transition-[border-color,box-shadow] duration-150",
  "placeholder:text-muted-foreground/80",
  "focus-visible:border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
  "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-65"
);

export const LoginForm = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { mutateAsync: login, isPending } = useLogin();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [postAuth, setPostAuth] = useState<{
    user: CurrentUser;
    loginUsername: string;
    loginPassword: string;
  } | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (values: LoginFormValues) => {
    try {
      await login(values);
      const user = await queryClient.fetchQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
      });
      const pinMatchesPassword =
        values.username.trim() === values.password.trim();
      if (pinMatchesPassword) {
        setPostAuth({
          user,
          loginUsername: values.username,
          loginPassword: values.password,
        });
      } else {
        navigate("/home");
      }
    } catch (err) {
      toast.error("Не удалось войти", {
        description: getHttpErrorMessage(
          err,
          "Проверьте ПИН и пароль и попробуйте снова."
        ),
      });
    }
  };

  if (forgotPassword) {
    return (
      <div className="mx-auto w-full max-w-[400px]">
        <ForgotPasswordForm setForgotPassword={setForgotPassword} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[400px] font-['Nunito',system-ui,sans-serif]">
      {postAuth && (
        <AccountSafetyAfterLoginDialog
          open
          user={postAuth.user}
          loginUsername={postAuth.loginUsername}
          loginPassword={postAuth.loginPassword}
          onComplete={() => {
            setPostAuth(null);
            navigate("/home");
          }}
        />
      )}
      <section className="w-full">
        <h2 className="mb-5 text-[22px] font-bold leading-[1.25] tracking-[-0.02em] text-foreground">
          Вход
        </h2>

        <form
          onSubmit={form.handleSubmit(handleLogin)}
          className="flex flex-col gap-1"
        >
          <div className="mb-1 flex flex-col gap-1.5">
            <Label
              htmlFor="login-pin"
              className="text-[13px] font-semibold text-muted-foreground"
            >
              ПИН
            </Label>
            <Input
              id="login-pin"
              autoComplete="username"
              className={inputClassName}
              {...form.register("username")}
            />
          </div>

          <div className="mb-1 flex flex-col gap-1.5">
            <Label
              htmlFor="login-password"
              className="text-[13px] font-semibold text-muted-foreground"
            >
              Пароль
            </Label>
            <div className="relative flex items-stretch">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className={cn(inputClassName, "pr-[52px]")}
                {...form.register("password")}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-[10px] text-muted-foreground"
                aria-label={
                  showPassword ? "Скрыть пароль" : "Показать пароль"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-2.5">
            <Button
              type="submit"
              disabled={isPending || form.formState.isSubmitting}
              className="h-auto min-h-[42px] w-full rounded-xl px-[18px] py-3 text-[15px] font-semibold shadow-sm"
            >

                Войти
            </Button>

            <Button
              type="button"
              variant="link"
              onClick={() => setForgotPassword(true)}
              className="h-auto self-end p-0 text-sm font-medium text-primary hover:text-primary/90"
            >
              Забыли пароль?
            </Button>
          </div>
        </form>

        <div className="my-[18px] mb-3 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="shrink-0 text-[13px] font-medium text-muted-foreground">
            или
          </span>
          <Separator className="flex-1" />
        </div>

        <div className="flex w-full flex-col gap-2.5 [&>*]:w-full">
          <GoogleLoginButton />
        </div>

        <Card className="mt-2.5 rounded-2xl border border-border/90 bg-gradient-to-b from-secondary to-muted/90 shadow-sm">
          <CardContent className="space-y-3 p-4 pb-[18px] pt-4">
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
              Материалы UNET
            </p>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="h-auto justify-between rounded-xl border-border py-3 pl-4 pr-4 text-left text-sm font-semibold shadow-sm transition-[border-color,box-shadow] hover:border-primary/35 hover:bg-background hover:shadow-md hover:[&_.unet-ico]:text-primary"
                asChild
              >
                <a
                  href="http://uadmin.kstu.kg/media/media/task_docs/UNET_user_guide.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Руководство</span>
                  <BookOpen
                    className="unet-ico ml-3 h-[22px] w-[22px] shrink-0 text-muted-foreground transition-colors"
                    strokeWidth={1.75}
                  />
                </a>
              </Button>

              <div className="mt-2 flex flex-wrap justify-center gap-2.5">
                <Button
                  variant="outline"
                  type="button"
                  className="unet-btn flex min-h-[48px] min-w-[calc(50%-6px)] flex-1 justify-between rounded-xl py-3 pl-3 pr-3 text-sm font-semibold shadow-sm transition-[border-color,box-shadow] hover:border-primary/35 hover:shadow-md hover:[&_.unet-ico]:text-primary"
                  onClick={() => {
                    window.location.href = "https://qr.kstu.kg";
                  }}
                >
                  <span className="truncate text-left">qr.kstu.kg</span>
                  <QrCode className="unet-ico ml-3 h-[22px] w-[22px] shrink-0 text-muted-foreground" />
                </Button>
                <Button
                  variant="outline"
                  className="unet-btn flex min-h-[48px] min-w-[calc(50%-6px)] flex-1 justify-between rounded-xl py-3 pl-3 pr-3 text-sm font-semibold shadow-sm transition-[border-color,box-shadow] hover:border-primary/35 hover:shadow-md hover:[&_.unet-ico]:text-primary"
                  asChild
                >
                  <a
                    href="http://uadmin.kstu.kg/media/media/task_docs/UNET_user_guide.pdf"
                    download
                  >
                    <span>Скачать</span>
                    <Download className="unet-ico ml-3 h-[22px] w-[22px] shrink-0 text-muted-foreground" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
