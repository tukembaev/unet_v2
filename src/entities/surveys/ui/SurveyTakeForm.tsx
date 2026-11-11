import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from 'shared/ui';
import { useDepartmentEmployees } from '../model/queries';
import type {
  EmployeeOption,
  SurveyAnswerPayload,
  SurveyOut,
} from '../model/types';

type AnswerState = {
  teacher_id?: string;
  selected_option_id?: string;
  selected_option_ids?: string[];
  text_answer?: string;
};

type Props = {
  survey: SurveyOut;
  onSubmit: (answers: SurveyAnswerPayload[]) => Promise<void>;
  submitting?: boolean;
  employeesOverride?: EmployeeOption[];
};

export function SurveyTakeForm({
  survey,
  onSubmit,
  submitting,
  employeesOverride,
}: Props) {
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const sortedQuestions = useMemo(
    () => [...survey.questions].sort((a, b) => a.order - b.order),
    [survey.questions]
  );

  const hasTeacherChoice = sortedQuestions.some(
    (q) => q.type === 'teacher_choice'
  );
  const employeesQuery = useDepartmentEmployees(
    hasTeacherChoice ? survey.department_id : null
  );
  const employees = employeesOverride ?? employeesQuery.data ?? [];

  const setAnswer = (questionId: string, patch: AnswerState) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], ...patch },
    }));
  };

  const toggleMultiple = (
    questionId: string,
    optionId: string,
    checked: boolean
  ) => {
    setAnswers((prev) => {
      const current = prev[questionId]?.selected_option_ids ?? [];
      const next = checked
        ? [...current, optionId]
        : current.filter((id) => id !== optionId);
      return {
        ...prev,
        [questionId]: { ...prev[questionId], selected_option_ids: next },
      };
    });
  };

  const handleSubmit = async () => {
    const payload: SurveyAnswerPayload[] = [];

    for (const question of sortedQuestions) {
      const answer = answers[question.id] ?? {};

      if (question.type === 'teacher_choice') {
        if (!answer.teacher_id) {
          if (question.is_required) {
            toast.error(`Ответьте на вопрос: ${question.text}`);
            return;
          }
          continue;
        }
        payload.push({
          question_id: question.id,
          teacher_id: answer.teacher_id,
        });
        continue;
      }

      if (
        question.type === 'single_choice' ||
        question.type === 'rating'
      ) {
        if (!answer.selected_option_id) {
          if (question.is_required) {
            toast.error(`Ответьте на вопрос: ${question.text}`);
            return;
          }
          continue;
        }
        payload.push({
          question_id: question.id,
          selected_option_id: answer.selected_option_id,
        });
        continue;
      }

      if (question.type === 'multiple_choice') {
        const ids = answer.selected_option_ids ?? [];
        if (ids.length === 0) {
          if (question.is_required) {
            toast.error(`Ответьте на вопрос: ${question.text}`);
            return;
          }
          continue;
        }
        payload.push({
          question_id: question.id,
          selected_option_ids: ids,
        });
        continue;
      }

      // text
      const text = answer.text_answer?.trim() ?? '';
      if (!text) {
        if (question.is_required) {
          toast.error(`Ответьте на вопрос: ${question.text}`);
          return;
        }
        continue;
      }
      payload.push({ question_id: question.id, text_answer: text });
    }

    await onSubmit(payload);
  };

  return (
    <div className="space-y-4">
      {sortedQuestions.map((question, index) => (
        <Card key={question.id}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {index + 1}. {question.text}
              {question.is_required ? (
                <span className="text-destructive"> *</span>
              ) : null}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {question.type === 'teacher_choice' ? (
              <Select
                value={answers[question.id]?.teacher_id}
                onValueChange={(value) =>
                  setAnswer(question.id, { teacher_id: value })
                }
                disabled={employeesQuery.isLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      survey.department_id
                        ? 'Выберите преподавателя'
                        : 'Кафедра анкеты не указана'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.label}
                      {employee.position ? ` · ${employee.position}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}

            {(question.type === 'single_choice' ||
              question.type === 'rating') &&
              question.options
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((option) => (
                  <label
                    key={option.id}
                    className="flex cursor-pointer items-center gap-2 py-1.5 text-sm"
                  >
                    <input
                      type="radio"
                      name={`q-${question.id}`}
                      checked={
                        answers[question.id]?.selected_option_id === option.id
                      }
                      onChange={() =>
                        setAnswer(question.id, {
                          selected_option_id: option.id,
                        })
                      }
                      className="h-4 w-4 accent-primary"
                    />
                    {option.text}
                  </label>
                ))}

            {question.type === 'multiple_choice' &&
              question.options
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((option) => (
                  <label
                    key={option.id}
                    className="flex cursor-pointer items-center gap-2 py-1.5 text-sm"
                  >
                    <Checkbox
                      checked={(
                        answers[question.id]?.selected_option_ids ?? []
                      ).includes(option.id)}
                      onCheckedChange={(checked) =>
                        toggleMultiple(question.id, option.id, Boolean(checked))
                      }
                    />
                    {option.text}
                  </label>
                ))}

            {question.type === 'text' ? (
              <Textarea
                value={answers[question.id]?.text_answer ?? ''}
                onChange={(e) =>
                  setAnswer(question.id, { text_answer: e.target.value })
                }
                placeholder="Ваш ответ"
                rows={3}
              />
            ) : null}
          </CardContent>
        </Card>
      ))}

      <Button
        onClick={() => void handleSubmit()}
        disabled={submitting}
        className="w-full sm:w-auto"
      >
        {submitting ? 'Отправка…' : 'Отправить ответы'}
      </Button>
    </div>
  );
}

export function SurveyHeader({ survey }: { survey: SurveyOut }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{survey.title}</CardTitle>
        {survey.description ? (
          <CardDescription>{survey.description}</CardDescription>
        ) : null}
        <p className="text-xs text-muted-foreground">
          {survey.is_anonymous ? 'Анонимная анкета' : 'Анкета с авторизацией'}
          {' · '}
          Вопросов: {survey.questions.length}
        </p>
      </CardHeader>
    </Card>
  );
}