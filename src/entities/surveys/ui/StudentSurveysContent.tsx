import { useState } from 'react';
import { CheckCircle2, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { getHttpErrorMessage } from 'shared/lib';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Empty,
  EmptyDescription,
  EmptyTitle,
  Skeleton,
} from 'shared/ui';
import {
  useSubmitSurveyResponse,
  useSurvey,
  useSurveys,
} from '../model/queries';
import type { SurveyOut } from '../model/types';
import { SurveyHeader, SurveyTakeForm } from './SurveyTakeForm';

export function StudentSurveysContent() {
  const surveysQuery = useSurveys({ is_active: true, limit: 200 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());

  const detailQuery = useSurvey(selectedId);
  const submit = useSubmitSurveyResponse();

  const surveys = surveysQuery.data?.items ?? [];
  const selected: SurveyOut | null = detailQuery.data ?? null;

  const handleSubmit = async (answers: Parameters<typeof submit.mutateAsync>[0]['answers']) => {
    if (!selectedId) return;
    try {
      await submit.mutateAsync({ surveyId: selectedId, answers });
      setDoneIds((prev) => new Set(prev).add(selectedId));
      toast.success('Спасибо! Ваши ответы отправлены');
      setSelectedId(null);
    } catch (e) {
      const message = getHttpErrorMessage(e, 'Не удалось отправить ответы');
      toast.error(message);
      if (message.toLowerCase().includes('уже проходили')) {
        setDoneIds((prev) => new Set(prev).add(selectedId));
      }
      throw e;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Анкетирование</h1>
        <p className="text-sm text-muted-foreground">
          Доступные опросы для прохождения
        </p>
      </div>

      {surveysQuery.isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : surveysQuery.isError ? (
        <Empty className="border border-dashed py-10">
          <EmptyTitle>Не удалось загрузить анкеты</EmptyTitle>
          <EmptyDescription>
            {getHttpErrorMessage(surveysQuery.error, 'Попробуйте позже')}
          </EmptyDescription>
        </Empty>
      ) : surveys.length === 0 ? (
        <Empty className="border border-dashed py-10">
          <EmptyTitle>Нет доступных анкет</EmptyTitle>
          <EmptyDescription>
            Когда появятся активные опросы, они будут здесь.
          </EmptyDescription>
        </Empty>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {surveys.map((survey) => {
            const done =
              Boolean(survey.already_submitted) || doneIds.has(survey.id);
            return (
              <Card key={survey.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <ClipboardList className="h-5 w-5 text-muted-foreground" />
                      {survey.title}
                    </CardTitle>
                    <Badge variant="outline">
                      {survey.is_anonymous ? 'Анонимно' : 'По логину'}
                    </Badge>
                  </div>
                  {survey.description ? (
                    <p className="text-sm text-muted-foreground">
                      {survey.description}
                    </p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    Вопросов: {survey.questions.length}
                  </p>
                </CardHeader>
                <CardContent>
                  {done ? (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Вы уже проходили эту анкету
                    </p>
                  ) : (
                    <Button onClick={() => setSelectedId(survey.id)}>
                      Пройти анкету
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog
        open={Boolean(selectedId)}
        onOpenChange={(open) => !open && setSelectedId(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selected?.title ?? 'Анкета'}</DialogTitle>
          </DialogHeader>
          {detailQuery.isLoading || !selected ? (
            <div className="space-y-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : selected.already_submitted ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Вы уже проходили эту анкету
            </p>
          ) : (
            <div className="space-y-4">
              <SurveyHeader survey={selected} />
              <SurveyTakeForm
                survey={selected}
                submitting={submit.isPending}
                onSubmit={handleSubmit}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
