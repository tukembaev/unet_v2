import { useMemo } from 'react';
import {
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Skeleton,
} from 'shared/ui';
import {
  useDepartmentEmployees,
  useSurveyResponses,
} from '../model/queries';
import type { SurveyOut } from '../model/types';

type Props = {
  survey: SurveyOut | null;
  onOpenChange: (open: boolean) => void;
};

export function SurveyResultsDialog({ survey, onOpenChange }: Props) {
  const responsesQuery = useSurveyResponses(survey?.id ?? null, Boolean(survey));
  const employeesQuery = useDepartmentEmployees(survey?.department_id ?? null);

  const employeeMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const e of employeesQuery.data ?? []) map.set(e.id, e.label);
    return map;
  }, [employeesQuery.data]);

  const responses = responsesQuery.data ?? [];

  const summary = useMemo(() => {
    if (!survey) return [];
    return [...survey.questions]
      .sort((a, b) => a.order - b.order)
      .map((question) => {
        const counts = new Map<string, number>();
        const texts: string[] = [];
        const teachers = new Map<string, number>();

        for (const response of responses) {
          for (const answer of response.answers) {
            if (answer.question_id !== question.id) continue;
            if (answer.selected_option_id) {
              counts.set(
                answer.selected_option_id,
                (counts.get(answer.selected_option_id) ?? 0) + 1
              );
            }
            for (const id of answer.selected_option_ids ?? []) {
              counts.set(id, (counts.get(id) ?? 0) + 1);
            }
            if (answer.text_answer?.trim()) texts.push(answer.text_answer.trim());
            if (answer.teacher_id) {
              teachers.set(
                answer.teacher_id,
                (teachers.get(answer.teacher_id) ?? 0) + 1
              );
            }
          }
        }

        return { question, counts, texts, teachers };
      });
  }, [survey, responses]);

  return (
    <Dialog
      open={Boolean(survey)}
      onOpenChange={(open) => !open && onOpenChange(false)}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Результаты анкетирования</DialogTitle>
          <DialogDescription>
            {survey?.title} · Прохождений: {responses.length}
          </DialogDescription>
        </DialogHeader>

        {responsesQuery.isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : responsesQuery.isError ? (
          <p className="text-sm text-destructive">
            Не удалось загрузить результаты
          </p>
        ) : !survey ? null : responses.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Пока нет ни одного прохождения.
          </p>
        ) : (
          <div className="space-y-4">
            {summary.map(({ question, counts, texts, teachers }) => (
              <div key={question.id} className="space-y-2 rounded-md border p-3">
                <p className="font-medium">{question.text}</p>

                {question.options.length > 0 ? (
                  <div className="space-y-1">
                    {[...question.options]
                      .sort((a, b) => a.order - b.order)
                      .map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{option.text}</span>
                          <Badge variant="secondary">
                            {counts.get(option.id) ?? 0}
                          </Badge>
                        </div>
                      ))}
                  </div>
                ) : null}

                {teachers.size > 0 ? (
                  <div className="space-y-1">
                    {[...teachers.entries()].map(([teacherId, count]) => (
                      <div
                        key={teacherId}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>
                          {employeeMap.get(teacherId) ?? teacherId}
                        </span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                ) : null}

                {texts.length > 0 ? (
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {texts.map((text, i) => (
                      <li key={i}>{text}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}

            <div className="space-y-2">
              <p className="font-medium">Все прохождения</p>
              {responses.map((response) => (
                <div
                  key={response.id}
                  className="rounded-md border bg-muted/20 p-3 text-sm"
                >
                  <p className="text-muted-foreground">
                    {response.submitted_at
                      ? new Date(response.submitted_at).toLocaleString()
                      : '—'}
                    {response.student_id
                      ? ` · Студент: ${response.student_id}`
                      : ' · Анонимно'}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {response.answers.map((answer, i) => {
                      const question = survey.questions.find(
                        (q) => q.id === answer.question_id
                      );
                      const optionLabels = [
                        answer.selected_option_id,
                        ...(answer.selected_option_ids ?? []),
                      ]
                        .filter(Boolean)
                        .map(
                          (id) =>
                            question?.options.find((o) => o.id === id)
                              ?.text ?? id
                        );
                      const value =
                        answer.text_answer ??
                        (answer.teacher_id
                          ? (employeeMap.get(answer.teacher_id) ??
                            answer.teacher_id)
                          : optionLabels.join(', '));
                      return (
                        <li key={i}>
                          <span className="text-muted-foreground">
                            {question?.text ?? answer.question_id}:
                          </span>{' '}
                          {value || '—'}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
