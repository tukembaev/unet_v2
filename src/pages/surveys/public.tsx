import { PublicSurveyContent } from 'entities/surveys';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from 'app/providers/routes';
import { cn } from 'shared/lib/utils';
import { AppLogo } from 'shared/ui';

export default function PublicSurveyPage() {
  const { token } = useParams();
  return (
    <div
      className={cn(
        'relative min-h-screen px-[clamp(16px,4vw,32px)] py-[clamp(24px,5vw,48px)]',
        "font-['Nunito',system-ui,sans-serif] antialiased"
      )}
    >
      <div className="relative z-[2] mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link to={ROUTES.AUTH} className="flex items-center gap-3">
            <AppLogo size="md" />
            <span className="font-semibold">UNET — Анкетирование</span>
          </Link>
        </div>
        {token ? (
          <PublicSurveyContent token={token} />
        ) : (
          <p className="text-sm text-muted-foreground">Ссылка недействительна</p>
        )}
      </div>
    </div>
  );
}
