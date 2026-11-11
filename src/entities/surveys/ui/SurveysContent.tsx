import { useMemo, useState } from 'react';
import {
  BarChart3,
  Link2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { getHttpErrorMessage } from 'shared/lib';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Empty,
  EmptyDescription,
  EmptyTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'shared/ui';
import {
  useDeleteSurvey,
  useDepartments,
  useSurveys,
  useUpdateSurvey,
} from '../model/queries';
import type { SurveyOut } from '../model/types';
import { QuestionBankContent } from './QuestionBankContent';
import { SurveyEditorDialog } from './SurveyEditorDialog';
import { SurveyResultsDialog } from './SurveyResultsDialog';
import { SurveyShareDialog } from './SurveyShareDialog';

const ALL = '__all__';

export function SurveysContent() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(ALL);
  const [departmentFilter, setDepartmentFilter] = useState(ALL);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<SurveyOut | null>(null);
  const [shareSurvey, setShareSurvey] = useState<SurveyOut | null>(null);
  const [resultsSurvey, setResultsSurvey] = useState<SurveyOut | null>(null);

  const departmentsQuery = useDepartments();
  const surveysQuery = useSurveys({
    limit: 200,
    ...(activeFilter === 'active' ? { is_active: true } : {}),
    ...(activeFilter === 'inactive' ? { is_active: false } : {}),
    ...(departmentFilter !== ALL
      ? { department_id: departmentFilter }
      : {}),
  });
  const deleteSurvey = useDeleteSurvey();
  const updateSurvey = useUpdateSurvey();

  const departmentMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const d of departmentsQuery.data ?? []) map.set(d.id, d.label);
    return map;
  }, [departmentsQuery.data]);

  const surveys = useMemo(() => {
    const items = surveysQuery.data?.items ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((s) => s.title.toLowerCase().includes(q));
  }, [surveysQuery.data, search]);

  const openCreate = () => {
    setEditingSurvey(null);
    setEditorOpen(true);
  };

  const openEdit = (survey: SurveyOut) => {
    setEditingSurvey(survey);
    setEditorOpen(true);
  };

  const handleDelete = async (survey: SurveyOut) => {
    if (!window.confirm(`Удалить анкету «${survey.title}»?`)) return;
    try {
      await deleteSurvey.mutateAsync(survey.id);
      toast.success('Анкета удалена');
    } catch (e) {
      toast.error(getHttpErrorMessage(e, 'Не удалось удалить анкету'));
    }
  };

  const toggleActive = async (survey: SurveyOut) => {
    try {
      await updateSurvey.mutateAsync({
        id: survey.id,
        payload: { is_active: !survey.is_active },
      });
      toast.success(survey.is_active ? 'Анкета отключена' : 'Анкета включена');
    } catch (e) {
      toast.error(getHttpErrorMessage(e, 'Не удалось изменить статус'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Анкетирование</h1>
          <p className="text-sm text-muted-foreground">
            Анкеты, банк вопросов и результаты опросов
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" />
          Создать анкету
        </Button>
      </div>

      <Tabs defaultValue="surveys">
        <TabsList>
          <TabsTrigger value="surveys">Анкеты</TabsTrigger>
          <TabsTrigger value="bank">Банк вопросов</TabsTrigger>
        </TabsList>

        <TabsContent value="surveys" className="space-y-4">
          <Card>
            <CardContent className="grid gap-3 pt-6 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск по названию"
                  className="pl-9"
                />
              </div>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Все анкеты</SelectItem>
                  <SelectItem value="active">Только активные</SelectItem>
                  <SelectItem value="inactive">Только неактивные</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Кафедра" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Все кафедры</SelectItem>
                  {(departmentsQuery.data ?? []).map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {surveysQuery.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : surveysQuery.isError ? (
            <Empty className="border border-dashed py-10">
              <EmptyTitle>Не удалось загрузить анкеты</EmptyTitle>
              <EmptyDescription>
                {getHttpErrorMessage(
                  surveysQuery.error,
                  'Проверьте доступность Surveys Service'
                )}
              </EmptyDescription>
            </Empty>
          ) : surveys.length === 0 ? (
            <Empty className="border border-dashed py-10">
              <EmptyTitle>Анкеты не найдены</EmptyTitle>
              <EmptyDescription>
                Создайте первую анкету или измените фильтры.
              </EmptyDescription>
            </Empty>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {surveys.map((survey) => (
                <Card key={survey.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{survey.title}</CardTitle>
                      <div className="flex shrink-0 gap-1">
                        <Badge variant={survey.is_active ? 'default' : 'secondary'}>
                          {survey.is_active ? 'Активна' : 'Неактивна'}
                        </Badge>
                        <Badge variant="outline">
                          {survey.is_anonymous ? 'Анонимная' : 'По логину'}
                        </Badge>
                      </div>
                    </div>
                    {survey.description ? (
                      <p className="text-sm text-muted-foreground">
                        {survey.description}
                      </p>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      {survey.department_id
                        ? (departmentMap.get(survey.department_id) ??
                          'Кафедра выбрана')
                        : 'Без кафедры'}
                      {' · '}
                      Вопросов: {survey.questions.length}
                      {survey.created_at
                        ? ` · ${new Date(survey.created_at).toLocaleDateString()}`
                        : ''}
                    </p>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setResultsSurvey(survey)}
                    >
                      <BarChart3 className="mr-1 h-4 w-4" />
                      Результаты
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShareSurvey(survey)}
                    >
                      <Link2 className="mr-1 h-4 w-4" />
                      Ссылка / QR
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(survey)}
                    >
                      <Pencil className="mr-1 h-4 w-4" />
                      Редактировать
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => void toggleActive(survey)}
                    >
                      {survey.is_active ? 'Отключить' : 'Включить'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => void handleDelete(survey)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Удалить
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bank">
          <QuestionBankContent />
        </TabsContent>
      </Tabs>

      <SurveyEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        survey={editingSurvey}
      />
      <SurveyShareDialog
        survey={shareSurvey}
        onOpenChange={(open) => !open && setShareSurvey(null)}
      />
      <SurveyResultsDialog
        survey={resultsSurvey}
        onOpenChange={(open) => !open && setResultsSurvey(null)}
      />
    </div>
  );
}
