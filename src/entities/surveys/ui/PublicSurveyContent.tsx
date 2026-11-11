import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { ROUTES } from 'app/providers/routes';
import { getActiveContext } from 'shared/lib/auth-context';
import { getHttpErrorMessage } from 'shared/lib';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from 'shared/ui';
import { usePublicSurvey, useSubmitPublicResponse } from '../model/queries';
import { SurveyHeader, SurveyTakeForm } from './SurveyTakeForm';

export function PublicSurveyContent({ token }: { token: string }) {
  const surveyQuery = usePublicSurvey(token);
  const submit = useSubmitPublicResponse();
  const [done, setDone] = useState(false);

  const survey = surveyQuery.data;
  const isLoggedIn = Boolean(getActiveContext() || localStorage.getItem('user'));
  const needsLogin = Boolean(survey && !survey.is_anonymous && !isLoggedIn);

  if (surveyQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (surveyQuery.isError || !survey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Анкета не найдена</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {getHttpErrorMessage(
              surveyQuery.error,
              'Ссылка недействительна или анкета была удалена.'
            )}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!survey.is_active) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{survey.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Анкета неактивна.</p>
        </CardContent>
      </Card>
    );
  }

  if (done || survey.already_submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          <p className="font-medium">Спасибо! Ваши ответы отправлены</p>
          <p className="text-sm text-muted-foreground">
            {survey.already_submitted && !done
              ? 'Вы уже проходили эту анкету.'
              : 'Анкетирование завершено.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (needsLogin) {
    return (
      <div className="space-y-4">
        <SurveyHeader survey={survey} />
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <LogIn className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium">Нужна авторизация</p>
            <p className="max-w-md text-sm text-muted-foreground">
              Эта анкета неанонимная. Войдите в UNET, затем снова откройте эту
              ссылку.
            </p>
            <Button asChild>
              <Link to={ROUTES.AUTH}>Войти</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SurveyHeader survey={survey} />
      <SurveyTakeForm
        survey={survey}
        submitting={submit.isPending}
        onSubmit={async (answers) => {
          try {
            await submit.mutateAsync({ token, answers });
            setDone(true);
            toast.success('Спасибо! Ваши ответы отправлены');
          } catch (e) {
            const message = getHttpErrorMessage(
              e,
              'Не удалось отправить ответы'
            );
            toast.error(message);
            if (message.toLowerCase().includes('уже проходили')) {
              setDone(true);
            }
            throw e;
          }
        }}
      />
    </div>
  );
}
