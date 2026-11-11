import { Plus, Trash2, X } from 'lucide-react';
import {
  Button,
  Checkbox,
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
  QUESTION_TYPE_LABELS,
  hasOptions,
  type BankQuestion,
  type QuestionDraft,
  type QuestionType,
} from '../model/types';

let draftCounter = 0;
export function createDraft(
  partial?: Partial<QuestionDraft>
): QuestionDraft {
  draftCounter += 1;
  return {
    key: `draft-${Date.now()}-${draftCounter}`,
    type: 'single_choice',
    text: '',
    is_required: true,
    bank_question_id: null,
    options: ['Да', 'Нет'],
    ...partial,
  };
}

export function bankToDraft(bank: BankQuestion): QuestionDraft {
  return createDraft({
    type: bank.type,
    text: bank.text,
    bank_question_id: bank.id,
    options: bank.options
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((o) => o.text),
  });
}

type Props = {
  drafts: QuestionDraft[];
  onChange: (drafts: QuestionDraft[]) => void;
  showRequired?: boolean;
  bankQuestions?: BankQuestion[];
};

export function QuestionDraftEditor({
  drafts,
  onChange,
  showRequired = true,
  bankQuestions,
}: Props) {
  const update = (key: string, patch: Partial<QuestionDraft>) => {
    onChange(
      drafts.map((d) => (d.key === key ? { ...d, ...patch } : d))
    );
  };

  const handleTypeChange = (key: string, type: QuestionType) => {
    const draft = drafts.find((d) => d.key === key);
    if (!draft) return;
    let options = draft.options;
    if (type === 'rating' && options.length === 0) {
      options = ['1', '2', '3', '4', '5'];
    }
    if (
      (type === 'single_choice' || type === 'multiple_choice') &&
      options.length === 0
    ) {
      options = ['Да', 'Нет'];
    }
    update(key, { type, options, bank_question_id: null });
  };

  return (
    <div className="space-y-3">
      {bankQuestions && bankQuestions.length > 0 ? (
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-1.5">
            <Label>Добавить из банка вопросов</Label>
            <Select
              value={undefined}
              onValueChange={(bankId) => {
                const bank = bankQuestions.find((b) => b.id === bankId);
                if (bank) onChange([...drafts, bankToDraft(bank)]);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите вопрос из банка…" />
              </SelectTrigger>
              <SelectContent>
                {bankQuestions.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    {bank.text}
                    {bank.category_name ? ` · ${bank.category_name}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : null}

      {drafts.map((draft, index) => (
        <div key={draft.key} className="space-y-3 rounded-md border p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">Вопрос {index + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(drafts.filter((d) => d.key !== draft.key))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <Textarea
            value={draft.text}
            onChange={(e) => update(draft.key, { text: e.target.value })}
            placeholder="Текст вопроса"
            rows={2}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Тип</Label>
              <Select
                value={draft.type}
                onValueChange={(v) =>
                  handleTypeChange(draft.key, v as QuestionType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.entries(QUESTION_TYPE_LABELS) as [
                      QuestionType,
                      string,
                    ][]
                  ).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {showRequired ? (
              <label className="flex items-center gap-2 pt-6 text-sm">
                <Checkbox
                  checked={draft.is_required}
                  onCheckedChange={(checked) =>
                    update(draft.key, { is_required: Boolean(checked) })
                  }
                />
                Обязательный
              </label>
            ) : null}
          </div>

          {draft.bank_question_id ? (
            <p className="text-xs text-muted-foreground">
              Из банка вопросов (id: {draft.bank_question_id})
            </p>
          ) : null}

          {hasOptions(draft.type) ? (
            <div className="space-y-2">
              <Label>Варианты ответа</Label>
              {draft.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const next = [...draft.options];
                      next[optionIndex] = e.target.value;
                      update(draft.key, { options: next });
                    }}
                    placeholder={`Вариант ${optionIndex + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      update(draft.key, {
                        options: draft.options.filter(
                          (_, i) => i !== optionIndex
                        ),
                      })
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  update(draft.key, { options: [...draft.options, ''] })
                }
              >
                <Plus className="mr-1 h-4 w-4" />
                Вариант
              </Button>
            </div>
          ) : null}
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => onChange([...drafts, createDraft()])}
      >
        <Plus className="mr-1 h-4 w-4" />
        Добавить вопрос
      </Button>
    </div>
  );
}

export function draftsToPayload(drafts: QuestionDraft[]) {
  return drafts.map((draft, index) => ({
    type: draft.type,
    text: draft.text.trim(),
    order: index + 1,
    is_required: draft.is_required,
    ...(draft.bank_question_id
      ? { bank_question_id: draft.bank_question_id }
      : {}),
    ...(hasOptions(draft.type)
      ? {
          options: draft.options
            .map((text) => text.trim())
            .filter(Boolean)
            .map((text, i) => ({ text, order: i + 1 })),
        }
      : {}),
  }));
}

export function validateDrafts(drafts: QuestionDraft[]): string | null {
  if (drafts.length === 0) return 'Добавьте хотя бы один вопрос';
  for (const [i, draft] of drafts.entries()) {
    if (!draft.text.trim()) return `Вопрос ${i + 1}: укажите текст`;
    if (hasOptions(draft.type)) {
      const options = draft.options.map((o) => o.trim()).filter(Boolean);
      if (options.length < 2) {
        return `Вопрос ${i + 1}: нужно минимум 2 варианта ответа`;
      }
    }
  }
  return null;
}
