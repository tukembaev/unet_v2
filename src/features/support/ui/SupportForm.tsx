import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Paperclip, Send, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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

export function SupportForm() {
  const { mutateAsync: submitSupport, isPending } = useSubmitSupportRequest();
  const categoriesQuery = useSupportCategories();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<SupportRequestFormValues>({
    resolver: zodResolver(supportRequestSchema),
    defaultValues: {
      category_id: '',
      feedback_email: '',
      title: '',
      description: '',
      files: [],
    },
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

  const onSubmit = async (values: SupportRequestFormValues) => {
    try {
      const ticket = await submitSupport({
        title: values.title,
        description: values.description,
        category_id: values.category_id,
        feedback_email: values.feedback_email,
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
        category_id: '',
        feedback_email: values.feedback_email,
        title: '',
        description: '',
        files: [],
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
          Авторизация не требуется.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
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
            <Label htmlFor="support-description">Описание</Label>
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
