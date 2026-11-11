import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getHttpErrorMessage } from 'shared/lib';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from 'shared/ui';
import {
  useBankQuestions,
  useCreateSurvey,
  useDepartments,
  useUpdateSurvey,
} from '../model/queries';
import type { QuestionDraft, SurveyOut } from '../model/types';
import {
  QuestionDraftEditor,
  createDraft,
  draftsToPayload,
  validateDrafts,
} from './QuestionDraftEditor';

const NO_DEPARTMENT = '__none__';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  survey: SurveyOut | null;
};

function surveyToDrafts(survey: SurveyOut): QuestionDraft[] {
  return [...survey.questions]
    .sort((a, b) => a.order - b.order)
    .map((q) => ({
      key: `q-${q.id}`,
      type: q.type,
      text: q.text,
      is_required: q.is_required,
      bank_question_id: q.bank_question_id,
      options: [...q.options]
        .sort((a, b) => a.order - b.order)
        .map((o) => o.text),
    }));
}

export function SurveyEditorDialog({ open, onOpenChange, survey }: Props) {
  const isEdit = Boolean(survey);
  const departmentsQuery = useDepartments();
  const bankQuery = useBankQuestions();
  const createSurvey = useCreateSurvey();
  const updateSurvey = useUpdateSurvey();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [departmentId, setDepartmentId] = useState(NO_DEPARTMENT);
  const [isActive, setIsActive] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [drafts, setDrafts] = useState<QuestionDraft[]>([createDraft()]);

  useEffect(() => {
    if (!open) return;
    if (survey) {
      setTitle(survey.title);
      setDescription(survey.description ?? '');
      setDepartmentId(survey.department_id ?? NO_DEPARTMENT);
      setIsActive(survey.is_active);
      setIsAnonymous(survey.is_anonymous);
      setDrafts(
        survey.questions.length ? surveyToDrafts(survey) : [createDraft()]
      );
    } else {
      setTitle('');
      setDescription('');
      setDepartmentId(NO_DEPARTMENT);
      setIsActive(true);
      setIsAnonymous(true);
      setDrafts([createDraft()]);
    }
  }, [open, survey]);

  const pending = createSurvey.isPending || updateSurvey.isPending;

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Укажите название анкеты');
      return;
    }
    const error = validateDrafts(drafts);
    if (error) {
      toast.error(error);
      return;
    }
    const hasTeacherChoice = drafts.some((d) => d.type === 'teacher_choice');
    const dept =
      departmentId === NO_DEPARTMENT ? null : departmentId;
    if (hasTeacherChoice && !dept) {
      toast.error('Для вопроса «Выбор преподавателя» выберите кафедру');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      department_id: dept,
      is_active: isActive,
      is_anonymous: isAnonymous,
      questions: draftsToPayload(drafts),
    };

    try {
      if (survey) {
        await updateSurvey.mutateAsync({ id: survey.id, payload });
        toast.success('Анкета обновлена');
      } else {
        await createSurvey.mutateAsync(payload);
        toast.success('Анкета создана');
      }
      onOpenChange(false);
    } catch (e) {
      toast.error(getHttpErrorMessage(e, 'Не удалось сохранить анкету'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Редактировать анкету' : 'Создать анкету'}
          </DialogTitle>
          <DialogDescription>
            Вопросы можно собрать вручную или выбрать из банка вопросов.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Название *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Преподаватель глазами студентов"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Описание</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Краткое описание анкеты"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Кафедра</Label>
            <Select value={departmentId} onValueChange={setDepartmentId}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите кафедру" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_DEPARTMENT}>Не выбрана</SelectItem>
                {(departmentsQuery.data ?? []).map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.label}
                    {dept.abbreviation ? ` (${dept.abbreviation})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Обязательна, если есть вопрос «Выбор преподавателя».
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={isActive}
                onCheckedChange={(c) => setIsActive(Boolean(c))}
              />
              Активна
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={isAnonymous}
                onCheckedChange={(c) => setIsAnonymous(Boolean(c))}
              />
              Анонимная
            </label>
          </div>

          <div className="space-y-2">
            <Label>Вопросы</Label>
            <QuestionDraftEditor
              drafts={drafts}
              onChange={setDrafts}
              bankQuestions={bankQuery.data?.items ?? []}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Отмена
          </Button>
          <Button
            type="button"
            onClick={() => void handleSave()}
            disabled={pending}
          >
            {pending ? 'Сохранение…' : isEdit ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
