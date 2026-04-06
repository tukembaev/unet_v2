import { FileText, X, Paperclip, FileUp, Type } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { AsyncSelect } from 'shared/components/select/AsyncSelect';
import { UserListItem } from 'entities/user/model/types';
import { useCurrentUser } from 'entities/user/model/queries';
import { FormQuery, useFormClose, useIsFormOpen } from 'shared/lib';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from 'shared/ui';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from 'shared/ui/field';

import { CreateDocumentMember } from '../model/types';
import { useCreateDocumentForm } from '../model/hooks/useCreateDocumentForm';
import { useTypeApprovals } from 'entities/documents/model/queries';

const DOCUMENT_TYPES = [
  { value: 'ORDER_STUD', label: 'Приказ (студент)' },
  { value: 'ORDER_EMPL', label: 'Приказ (сотрудник)' },
  { value: 'APPLICATION', label: 'Заявление' },
  { value: 'MAIL', label: 'Письмо' },
  { value: 'REPORT', label: 'Отчет' },
] as const;

export function CreateDocumentDialog() {
  const open = useIsFormOpen(FormQuery.CREATE_DOCUMENT);
  const closeForm = useFormClose();
  const {
    form,
    handleFileSelect,
    removeFile,
    addAdditionalFile,
    removeAdditionalFile,
    addMember,
    removeMember,
    resetForm,
    submitForm,
    isSubmitting,
  } = useCreateDocumentForm();

  const { data: typeApprovals = [], isLoading: isLoadingTypeApprovals } = useTypeApprovals();
  const { data: currentUser } = useCurrentUser();

  const [selectedMemberUser, setSelectedMemberUser] = useState<UserListItem | null>(null);
  const [selectedTypeApproval, setSelectedTypeApproval] = useState<string>('');
  const [contentType, setContentType] = useState<'file' | 'text'>('file');

  // Watch form values
  const documentType = useWatch({ control: form.control, name: 'type' });
  const file = useWatch({ control: form.control, name: 'file' });
  const text = useWatch({ control: form.control, name: 'text' });
  const members = useWatch({ control: form.control, name: 'members' });
  const additionalFiles = useWatch({ control: form.control, name: 'files' });

  // Устанавливаем sender_id текущего пользователя
  useEffect(() => {
    if (currentUser?.id) {
      form.setValue('sender_id', currentUser.id);
    }
  }, [currentUser, form]);

  // Автоматически добавляем участника при выборе типа согласования
  useEffect(() => {
    if (selectedMemberUser && selectedTypeApproval) {
      const member: CreateDocumentMember = {
        user_id: selectedMemberUser.user_id,
        type_approval_id: selectedTypeApproval,
        user_name: selectedMemberUser.full_name, // Сохраняем имя для отображения
      };
      
      console.log('Auto-adding member:', member);
      addMember(member);
      
      // Очищаем выбор
      setSelectedMemberUser(null);
      setSelectedTypeApproval('');
    }
  }, [selectedMemberUser, selectedTypeApproval, addMember]);

  const handleAdditionalFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const currentFiles = additionalFiles || [];
      const remainingSlots = 10 - currentFiles.length;
      
      if (remainingSlots <= 0) {
        form.setError('files', {
          type: 'manual',
          message: 'Максимум 10 дополнительных файлов',
        });
        return;
      }

      const filesToAdd = Array.from(selectedFiles).slice(0, remainingSlots);
      filesToAdd.forEach(file => addAdditionalFile(file));
      
      // Очищаем input для возможности повторного выбора
      event.target.value = '';
    }
  };

  const handleCancel = () => {
    resetForm();
    setSelectedMemberUser(null);
    setSelectedTypeApproval('');
    setContentType('file');
    closeForm(FormQuery.CREATE_DOCUMENT);
  };

  const handleFormSubmit = async (data: any) => {
    const success = await submitForm(data);
    if (success) {
      closeForm(FormQuery.CREATE_DOCUMENT);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Проверка на PDF формат
      if (selectedFile.type !== 'application/pdf') {
        form.setError('file', {
          type: 'manual',
          message: 'Можно загружать только PDF файлы',
        });
        return;
      }
      
      // Очищаем ошибку если была
      form.clearErrors('file');
      handleFileSelect(event);
      // Очищаем текст если выбран файл
      form.setValue('text', '');
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    form.setValue('text', value);
    // Очищаем файл если введен текст
    if (value) {
      form.setValue('file', undefined);
      removeFile();
    }
  };

  const handleTabChange = (value: string) => {
    setContentType(value as 'file' | 'text');
    // Очищаем оба поля при переключении
    form.setValue('file', undefined);
    form.setValue('text', '');
    form.clearErrors('file');
    form.clearErrors('text');
  };

  return (
    <Dialog open={open} onOpenChange={() => closeForm(FormQuery.CREATE_DOCUMENT)}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать документ</DialogTitle>
          <DialogDescription>
            Заполните форму для создания нового документа
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <FieldGroup>
            {/* Document Type */}
            <Field>
              <FieldLabel>
                Тип документа
                <span className="text-red-500 ml-1">*</span>
              </FieldLabel>
              <Select
                value={documentType}
                onValueChange={(value) => form.setValue('type', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип документа" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <FieldError>
                  {form.formState.errors.type.message}
                </FieldError>
              )}
            </Field>

            {/* Title */}
            <Field>
              <FieldLabel>Заголовок</FieldLabel>
              <Input
                placeholder="Введите заголовок документа"
                {...form.register('title')}
              />
              {form.formState.errors.title && (
                <FieldError>
                  {form.formState.errors.title.message}
                </FieldError>
              )}
            </Field>

            {/* File or Text Content */}
            <Field>
              <FieldLabel>
                Содержимое документа
                <span className="text-red-500 ml-1">*</span>
              </FieldLabel>
              <Tabs value={contentType} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="file" className="flex items-center gap-2">
                    <FileUp className="h-4 w-4" />
                    Загрузить файл
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Ввести текст
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="file" className="mt-4">
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('fileInput')?.click()}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-sm font-medium">
                        {file?.name || 'Выберите PDF файл'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Поддерживается только формат PDF
                      </p>
                    </div>
                    <Input
                      id="fileInput"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  {file && (
                    <div className="flex items-center justify-between p-3 border border-border rounded-md bg-card mt-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="text" className="mt-4">
                  <Textarea
                    placeholder="Введите текст документа..."
                    value={text || ''}
                    onChange={handleTextChange}
                    className="min-h-[200px] resize-y"
                  />
                  {text && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Символов: {text.length}
                    </p>
                  )}
                </TabsContent>
              </Tabs>
              {form.formState.errors.file && (
                <FieldError>
                  {form.formState.errors.file.message as string}
                </FieldError>
              )}
            </Field>

            {/* Members */}
            <Field>
              <FieldLabel>
                Участники согласования
                {members && members.length > 0 && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({members.length} участник{members.length > 1 ? 'ов' : ''})
                  </span>
                )}
              </FieldLabel>
              <div className="space-y-3">
                {/* Список добавленных участников */}
                {members && members.length > 0 && (
                  <div className="space-y-2">
                    {members.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-border rounded-md bg-card"
                      >
                        <div className="text-sm">
                          <span className="font-medium">
                            {member.user_name || `User ID: ${member.user_id}`}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            - {typeApprovals.find(t => t.id === member.type_approval_id)?.title || 'Тип согласования'}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMember(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Форма добавления нового участника */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <AsyncSelect
                      value={selectedMemberUser}
                      onChange={setSelectedMemberUser}
                      placeholder="Выберите пользователя"
                    />
                  </div>
                  <div className="flex-1">
                    <Select
                      value={selectedTypeApproval}
                      onValueChange={setSelectedTypeApproval}
                      disabled={isLoadingTypeApprovals}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingTypeApprovals ? "Загрузка..." : "Тип согласования"} />
                      </SelectTrigger>
                      <SelectContent>
                        {typeApprovals.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Field>

            {/* Additional Files */}
            <Field>
              <FieldLabel>
                Дополнительные файлы
                {additionalFiles && additionalFiles.length > 0 && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({additionalFiles.length}/10)
                  </span>
                )}
              </FieldLabel>
              <div className="space-y-3">
                {/* Список добавленных файлов */}
                {additionalFiles && additionalFiles.length > 0 && (
                  <div className="space-y-2">
                    {additionalFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-border rounded-md bg-card"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                            <Paperclip className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAdditionalFile(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Кнопка добавления файлов */}
                {(!additionalFiles || additionalFiles.length < 10) && (
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('additionalFilesInput')?.click()}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <Paperclip className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium">
                        Добавить файлы
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Максимум {10 - (additionalFiles?.length || 0)} файлов
                      </p>
                    </div>
                    <Input
                      id="additionalFilesInput"
                      type="file"
                      multiple
                      onChange={handleAdditionalFileChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
              {form.formState.errors.files && (
                <FieldError>
                  {form.formState.errors.files.message as string}
                </FieldError>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={handleCancel} disabled={isSubmitting} type="button">
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Создание...' : 'Создать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
