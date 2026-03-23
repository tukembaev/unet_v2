import { LoginForm } from "features/auth";
import { Card, CardContent } from "shared/ui";
import { cn } from "shared/lib/utils";

/** Shell страницы входа + карточка shadcn; токены — в `.login-scope` (globals.css). */
export const LoginPage = () => {
  return (
    <div
      className={cn(
        "login-scope relative flex min-h-screen items-center justify-center overflow-x-hidden",
        "px-[clamp(16px,4vw,32px)]",
        "font-['Nunito',system-ui,sans-serif] antialiased"
      )}
    >
      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat",
          "bg-[url('shared/assets/img/LayoutBackgroud.jpg')]"
        )}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.06]"
        style={{
          backgroundImage: [
            "radial-gradient(circle at 20% 30%, rgb(255 255 255) 0%, transparent 45%)",
            "radial-gradient(circle at 80% 70%, rgb(165 180 252) 0%, transparent 40%)",
          ].join(", "),
        }}
        aria-hidden
      />

      <div
        className={cn(
          "relative z-[2] grid w-full max-w-[1080px] items-center gap-[clamp(24px,5vw,48px)]",
          "grid-cols-1 max-[900px]:max-w-[440px]",
          "lg:grid-cols-[minmax(0,1fr)_minmax(320px,440px)]"
        )}
      >
        <aside className="max-[900px]:hidden">
          <div className="py-2 text-[rgba(255,255,255,0.92)]">
            <span
              className={cn(
                "mb-5 inline-flex items-center gap-2 rounded-full border border-white/20",
                "bg-white/10 px-3 py-1.5 text-[13px] font-semibold"
              )}
            >
              University Network
            </span>
            <h1
              className={cn(
                "mb-3 text-[clamp(28px,3.5vw,40px)] font-bold leading-[1.15] tracking-[-0.02em]"
              )}
            >
              Единый вход в{" "}
              <span className="text-indigo-200">академическую среду</span>
            </h1>
            <p className="max-w-[420px] text-base leading-[1.55] text-[rgba(226,232,240,0.88)]">
              Расписание, учебные планы, отчётность и сервисы кампуса — в одном
              защищённом аккаунте.
            </p>
          </div>
        </aside>

        <Card
          className={cn(
            "w-full overflow-hidden rounded-[20px] border border-white/50 bg-card/95 text-card-foreground",
            "shadow-[0_25px_50px_-12px_rgba(15,23,42,0.35),inset_0_0_0_1px_rgba(255,255,255,0.5)]",
            "backdrop-blur-[16px]"
          )}
        >
          <CardContent className="bg-card p-[clamp(24px,4vw,36px)]">
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
