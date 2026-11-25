import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Paperclip, Send, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { getHttpErrorMessage } from 'shared/lib/http-error';
import { cn } from 'shared/lib/utils';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from 'shared/ui';
import { toast } from 'sonner';

import { composeSupportDescription } from '../lib/compose-support-description';
import {
  useSubmitSupportRequest,
  useSupportCategories,
} from '../model/queries';
import {
  supportRequestSchema,
  type SupportRequestFormValues,
} from '../model/schema';

const fieldClassName = cn(
  'rounded-xl border-input bg-background',
  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0'
);

type SupportFormState = Omit<SupportRequestFormValues, 'applicant_type'> & {
  applicant_type: '' | 'student' | 'employee';
};

const DEFAULT_VALUES: SupportFormState = {
  applicant_type: '',
  category_id: '',
  feedback_email: '',
  title: '',
  description: '',
  full_name: '',
  group_name: '',
  pin: '',
  phone: '',
  department: '',
  institute: '',
  position: '',
  files: [],
};

export function SupportForm() {
  const { mutateAsync: submitSupport, isPending } = useSubmitSupportRequest();
  const categoriesQuery = useSupportCategories();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<SupportFormState>({
    resolver: zodResolver(supportRequestSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const applicantType = useWatch({
    control: form.control,
    name: 'applicant_type',
  });

  const categories = categoriesQuery.data ?? [];

  const addFiles = (incoming: FileList | null) => {
    if (!incoming?.length) return;
    const next = [...files, ...Array.from(incoming)];
    setFiles(next);
    form.setValue('files', next, { shouldValidate: true });
  };

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    form.setValue('files', next, { shouldValidate: true });
  };

  const onSubmit = async (values: SupportFormState) => {
    if (values.applicant_type !== 'student' && values.applicant_type !== 'employee') {
      return;
    }

    try {
      const description = composeSupportDescription({
        applicantType: values.applicant_type,
        fullName: values.full_name ?? '',
        email: values.feedback_email ?? '',
        group:
          values.applicant_type === 'student' ? values.group_name : undefined,
        pin: values.applicant_type === 'employee' ? values.pin : undefined,
        phone: values.applicant_type === 'employee' ? values.phone : undefined,
        department:
          values.applicant_type === 'employee' ? values.department : undefined,
        institute:
          values.applicant_type === 'employee' ? values.institute : undefined,
        position:
          values.applicant_type === 'employee' ? values.position : undefined,
        message: values.description,
      });

      const ticket = await submitSupport({
        title: values.title,
        description,
        category_id: values.category_id,
        feedback_email: (values.feedback_email ?? '').trim(),
        files,
      });
      toast.success('Обращение отправлено', {
        description: ticket.ticket_number
          ? `Номер обращения: ${ticket.ticket_number}. Ответ придёт на указанный email.`
          : 'Ответ придёт на указанный email.',
      });
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      form.reset({
        ...DEFAULT_VALUES,
        feedback_email: values.feedback_email,
      });
    } catch (error) {
      toast.error('Не удалось отправить обращение', {
        description: getHttpErrorMessage(
          error,
          'Попробуйте позже или обратитесь в IT-отдел.'
        ),
      });
    }
  };

  return (
    <Card className="h-fit border-border/70 shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Новое обращение</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Вопросы по приложению, учёбе, LMS, документам и сервисам университета.
          Авторизация не требуется — укажите контакты, чтобы мы могли ответить.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <div className="space-y-2">
            <Label htmlFor="support-applicant-type">Кто обращается</Label>
            <Controller
              control={form.control}
              name="applicant_type"
              render={({ field }) => (
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="support-applicant-type"
                    className={cn(fieldClassName, 'h-11')}
                  >
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Студент</SelectItem>
                    <SelectItem value="employee">Сотрудник</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.applicant_type ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.applicant_type.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="support-category">Тема обращения</Label>
            <Controller
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  disabled={categoriesQuery.isLoading || categoriesQuery.isError}
                >
                  <SelectTrigger
                    id="support-category"
                    className={cn(fieldClassName, 'h-11')}
                  >
                    <SelectValue
                      placeholder={
                        categoriesQuery.isLoading
                          ? 'Загрузка тем…'
                          : 'Выберите тему'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {categoriesQuery.isError ? (
              <p className="text-sm text-destructive">
                {getHttpErrorMessage(
                  categoriesQuery.error,
                  'Не удалось загрузить темы обращений'
                )}
              </p>
            ) : null}
            {form.formState.errors.category_id ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.category_id.message}
              </p>
            ) : null}
          </div>

          {applicantType === 'student' || applicantType === 'employee' ? (
            <div className="space-y-4 rounded-2xl border border-border/70 bg-muted/20 p-4">
              <p className="text-sm font-semibold text-foreground">
                Контактные данные
              </p>

              <div className="space-y-2">
                <Label htmlFor="support-full-name">ФИО</Label>
                <Input
                  id="support-full-name"
                  autoComplete="name"
                  placeholder="Фамилия Имя Отчество"
                  className={cn(fieldClassName, 'h-11')}
                  {...form.register('full_name')}
                />
                {form.formState.errors.full_name ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.full_name.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="support-email">Email для ответа</Label>
                <Input
                  id="support-email"
                  type="email"
                  autoComplete="email"
                  placeholder="user@example.com"
                  className={cn(fieldClassName, 'h-11')}
                  {...form.register('feedback_email')}
                />
                {form.formState.errors.feedback_email ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.feedback_email.message}
                  </p>
                ) : null}
              </div>

              {applicantType === 'student' ? (
                <div className="space-y-2">
                  <Label htmlFor="support-group">Группа</Label>
                  <Input
                    id="support-group"
                    placeholder="например ИВТ-1-21"
                    className={cn(fieldClassName, 'h-11')}
                    {...form.register('group_name')}
                  />
                  {form.formState.errors.group_name ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.group_name.message}
                    </p>
                  ) : null}
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="support-pin">ПИН</Label>
                      <Input
                        id="support-pin"
                        inputMode="numeric"
                        placeholder="Ваш ПИН"
                        className={cn(fieldClassName, 'h-11')}
                        {...form.register('pin')}
                      />
                      {form.formState.errors.pin ? (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.pin.message}
                        </p>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="support-phone">№ телефона</Label>
                      <Input
                        id="support-phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+996…"
                        className={cn(fieldClassName, 'h-11')}
                        {...form.register('phone')}
                      />
                      {form.formState.errors.phone ? (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.phone.message}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="support-institute">Институт</Label>
                    <Input
                      id="support-institute"
                      placeholder="Название института"
                      className={cn(fieldClassName, 'h-11')}
                      {...form.register('institute')}
                    />
                    {form.formState.errors.institute ? (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.institute.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="support-department">Кафедра</Label>
                    <Input
                      id="support-department"
                      placeholder="Название кафедры"
                      className={cn(fieldClassName, 'h-11')}
                      {...form.register('department')}
                    />
                    {form.formState.errors.department ? (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.department.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="support-position">Должность</Label>
                    <Input
                      id="support-position"
                      placeholder="Например: старший преподаватель"
                      className={cn(fieldClassName, 'h-11')}
                      {...form.register('position')}
                    />
                    {form.formState.errors.position ? (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.position.message}
                      </p>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="support-title">Заголовок</Label>
            <Input
              id="support-title"
              placeholder="Кратко о вопросе"
              className={cn(fieldClassName, 'h-11')}
              {...form.register('title')}
            />
            {form.formState.errors.title ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="support-description">Описание проблемы</Label>
            <Textarea
              id="support-description"
              rows={6}
              placeholder="Опишите вопрос или ситуацию подробнее"
              className={cn(fieldClassName, 'min-h-[140px] resize-y')}
              {...form.register('description')}
            />
            {form.formState.errors.description ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="support-files">
              Вложения{' '}
              <span className="font-normal text-muted-foreground">
                (необязательно)
              </span>
            </Label>
            <input
              ref={fileInputRef}
              id="support-files"
              type="file"
              multiple
              className="hidden"
              onChange={(event) => addFiles(event.target.files)}
            />
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-xl sm:w-auto"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="mr-2 h-4 w-4" aria-hidden />
              Прикрепить файлы
            </Button>
            {files.length > 0 ? (
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${file.size}-${index}`}
                    className="flex items-center justify-between gap-2 rounded-lg border border-border/70 bg-muted/30 px-3 py-2 text-sm"
                  >
                    <span className="truncate">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      aria-label={`Удалить ${file.name}`}
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <Button
            type="submit"
            disabled={
              isPending ||
              form.formState.isSubmitting ||
              categoriesQuery.isLoading ||
              categories.length === 0
            }
            className="h-11 w-full rounded-xl sm:w-auto sm:min-w-[180px]"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Send className="mr-2 h-4 w-4" aria-hidden />
            )}
            Отправить обращение
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
