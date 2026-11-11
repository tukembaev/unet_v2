import { ROUTES } from 'app/providers/routes';
import { SupportFaq, SupportForm } from 'features/support';
import { ArrowLeft, MessageSquareText } from 'lucide-react';
import { Link } from 'react-router-dom';
import kstuLogo from 'shared/assets/img/kstu.png';
import { cn } from 'shared/lib/utils';
import { AppLogo, Button, Card, CardContent } from 'shared/ui';

export default function SupportPage() {
  return (
    <div
      className={cn(
        'login-scope relative min-h-screen overflow-x-hidden',
        'px-[clamp(16px,4vw,32px)] py-[clamp(24px,5vw,48px)]',
        "font-['Nunito',system-ui,sans-serif] antialiased"
      )}
    >
      <div
        className={cn(
          'pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat',
          "bg-[url('shared/assets/img/LayoutBackgroud.jpg')]"
        )}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.06]"
        style={{
          backgroundImage: [
            'radial-gradient(circle at 20% 30%, rgb(255 255 255) 0%, transparent 45%)',
            'radial-gradient(circle at 80% 70%, rgb(165 180 252) 0%, transparent 40%)',
          ].join(', '),
        }}
        aria-hidden
      />

      <div className="relative z-[2] mx-auto w-full max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <AppLogo size="md" />
            <div className="hidden h-10 w-px bg-border/60 sm:block" aria-hidden />
            <img
              src={kstuLogo}
              alt="КГТУ им. И. Раззакова"
              className="hidden h-10 w-auto object-contain sm:block"
              decoding="async"
            />
          </div>
          <Button variant="outline" className="rounded-xl" asChild>
            <Link to={ROUTES.AUTH}>
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
              На страницу входа
            </Link>
          </Button>
        </div>

        <Card className="overflow-hidden rounded-[20px] border border-white/50 bg-card/95 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.35)] backdrop-blur-[16px]">
          <CardContent className="space-y-8 p-[clamp(20px,4vw,36px)]">
            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageSquareText className="h-5 w-5" aria-hidden />
              </div>
              <div className="space-y-1">
                <h1 className="text-[clamp(24px,3vw,32px)] font-bold tracking-tight">
                  Обращения
                </h1>
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Вопросы по приложению, учёбе, LMS и сервисам университета.
                  Страница доступна без входа: сначала FAQ, если ответа нет —
                  отправьте обращение.
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-start">
              <SupportFaq />
              <SupportForm />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
