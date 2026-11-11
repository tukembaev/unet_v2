import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
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
  Skeleton,
} from 'shared/ui';
import {
  useBankQuestions,
  useCategories,
  useCreateBankQuestion,
  useCreateCategory,
  useDeleteBankQuestion,
  useDeleteCategory,
  useUpdateBankQuestion,
  useUpdateCategory,
} from '../model/queries';
import {
  QUESTION_TYPE_LABELS,
  type BankQuestion,
  type QuestionDraft,
} from '../model/types';
import {
  QuestionDraftEditor,
  createDraft,
  draftsToPayload,
  validateDrafts,
} from './QuestionDraftEditor';

const ALL = '__all__';

export function QuestionBankContent() {
  const [categoryFilter, setCategoryFilter] = useState(ALL);
  const [search, setSearch] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [bankDialogOpen, setBankDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<BankQuestion | null>(null);
  const [drafts, setDrafts] = useState<QuestionDraft[]>([createDraft()]);
  const [bankCategoryId, setBankCategoryId] = useState(ALL);

  const categoriesQuery = useCategories();
  const bankQuery = useBankQuestions({
    ...(categoryFilter !== ALL ? { category_id: categoryFilter } : {}),
    ...(search.trim() ? { q: search.trim() } : {}),
  });

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const createBank = useCreateBankQuestion();
  const updateBank = useUpdateBankQuestion();
  const deleteBank = useDeleteBankQuestion();

  const openBankDialog = (bank: BankQuestion | null) => {
    setEditingBank(bank);
    if (bank) {
      setBankCategoryId(bank.category_id ?? ALL);
      setDrafts([
        {
          key: `bank-${bank.id}`,
          type: bank.type,
          text: bank.text,
          is_required: true,
          bank_question_id: null,
          options: [...bank.options]
            .sort((a, b) => a.order - b.order)
            .map((o) => o.text),
        },
      ]);
    } else {
      setBankCategoryId(ALL);
      setDrafts([createDraft()]);
    }
    setBankDialogOpen(true);
  };

  const saveBank = async () => {
    const draft = drafts[0];
    if (!draft) return;
    const error = validateDrafts([draft]);
    if (error) {
      toast.error(error);
      return;
    }
    const [payloadQuestion] = draftsToPayload([draft]);
    const payload = {
      text: payloadQuestion.text,
      type: payloadQuestion.type,
      category_id: bankCategoryId === ALL ? null : bankCategoryId,
      ...(payloadQuestion.options ? { options: payloadQuestion.options } : {}),
    };
    try {
      if (editingBank) {
        await updateBank.mutateAsync({ id: editingBank.id, payload });
        toast.success('Вопрос банка обновлён');
      } else {
        await createBank.mutateAsync(payload);
        toast.success('Вопрос добавлен в банк');
      }
      setBankDialogOpen(false);
    } catch (e) {
      toast.error(getHttpErrorMessage(e, 'Не удалось сохранить вопрос'));
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Категории вопросов</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(categoriesQuery.data ?? []).map((category) =>
              editingCategoryId === category.id ? (
                <div key={category.id} className="flex items-center gap-1">
                  <Input
                    value={editingCategoryName}
                    onChange={(e) => setEditingCategoryName(e.target.value)}
                    className="h-8 w-44"
                  />
                  <Button
                    size="sm"
                    onClick={async () => {
                      try {
                        await updateCategory.mutateAsync({
                          id: category.id,
                          name: editingCategoryName.trim(),
                        });
                        setEditingCategoryId(null);
                        toast.success('Категория обновлена');
                      } catch (e) {
                        toast.error(
                          getHttpErrorMessage(e, 'Не удалось обновить категорию')
                        );
                      }
                    }}
                  >
                    ОК
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingCategoryId(null)}
                  >
                    Отмена
                  </Button>
                </div>
              ) : (
                <Badge
                  key={category.id}
                  variant="secondary"
                  className="gap-1 py-1 pr-1"
                >
                  {category.name}
                  <button
                    type="button"
                    className="ml-1 rounded p-0.5 hover:bg-background"
                    onClick={() => {
                      setEditingCategoryId(category.id);
                      setEditingCategoryName(category.name);
                    }}
                    aria-label="Переименовать"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    className="rounded p-0.5 hover:bg-background"
                    onClick={async () => {
                      if (!window.confirm(`Удалить категорию «${category.name}»?`))
                        return;
                      try {
                        await deleteCategory.mutateAsync(category.id);
                        toast.success('Категория удалена');
                      } catch (e) {
                        toast.error(
                          getHttpErrorMessage(e, 'Не удалось удалить категорию')
                        );
                      }
                    }}
                    aria-label="Удалить"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              )
            )}
            {(categoriesQuery.data ?? []).length === 0 &&
            !categoriesQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Пока нет категорий</p>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Новая категория"
              className="max-w-xs"
            />
            <Button
              variant="outline"
              disabled={!newCategory.trim() || createCategory.isPending}
              onClick={async () => {
                try {
                  await createCategory.mutateAsync(newCategory.trim());
                  setNewCategory('');
                  toast.success('Категория создана');
                } catch (e) {
                  toast.error(
                    getHttpErrorMessage(e, 'Не удалось создать категорию')
                  );
                }
              }}
            >
              <Plus className="mr-1 h-4 w-4" />
              Добавить
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Банк вопросов</CardTitle>
          <Button onClick={() => openBankDialog(null)}>
            <Plus className="mr-1 h-4 w-4" />
            Вопрос
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по тексту вопроса"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Все категории</SelectItem>
                {(categoriesQuery.data ?? []).map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {bankQuery.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : (bankQuery.data?.items ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              В банке пока нет вопросов.
            </p>
          ) : (
            <div className="space-y-2">
              {(bankQuery.data?.items ?? []).map((bank) => (
                <div
                  key={bank.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3"
                >
                  <div>
                    <p className="font-medium">{bank.text}</p>
                    <p className="text-xs text-muted-foreground">
                      {QUESTION_TYPE_LABELS[bank.type]}
                      {bank.category_name ? ` · ${bank.category_name}` : ''}
                      {bank.options.length
                        ? ` · Вариантов: ${bank.options.length}`
                        : ''}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openBankDialog(bank)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        if (!window.confirm('Удалить вопрос из банка?')) return;
                        try {
                          await deleteBank.mutateAsync(bank.id);
                          toast.success('Вопрос удалён');
                        } catch (e) {
                          toast.error(
                            getHttpErrorMessage(e, 'Не удалось удалить вопрос')
                          );
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={bankDialogOpen} onOpenChange={setBankDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBank ? 'Редактировать вопрос' : 'Новый вопрос банка'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Категория</Label>
              <Select value={bankCategoryId} onValueChange={setBankCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Без категории" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Без категории</SelectItem>
                  {(categoriesQuery.data ?? []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <QuestionDraftEditor
              drafts={drafts.slice(0, 1)}
              onChange={(next) => setDrafts(next.slice(0, 1))}
              showRequired={false}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBankDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={() => void saveBank()}
              disabled={createBank.isPending || updateBank.isPending}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
