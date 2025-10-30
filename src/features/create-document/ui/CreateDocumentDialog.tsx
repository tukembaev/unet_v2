import { Upload, X, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Textarea,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'shared/ui';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from 'shared/ui/field';
import { AsyncSelect } from 'shared/components/select/AsyncSelect';
import { useCreateDocumentForm } from '../model/hooks/useCreateDocumentForm';
import { fetchEmployees } from '../model/api';
import { Employee, DOCUMENT_TYPES } from '../model/types';

interface CreateDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateDocumentDialog({ open, onOpenChange }: CreateDocumentDialogProps) {
  const {
    form,
    handleMainFileSelect,
    handleAdditionalFilesSelect,
    removeAdditionalFile,
    removeMainFile,
    resetForm,
    submitForm,
    isSubmitting,
  } = useCreateDocumentForm();

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleFormSubmit = async (data: any) => {
    const success = await submitForm(data);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать обращение</DialogTitle>
          <DialogDescription>
            Заполните форму ниже для создания нового обращения
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
                value={form.watch('type_doc')}
                onValueChange={(value) => form.setValue('type_doc', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип документа" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.type_doc && (
                <FieldError>
                  {form.formState.errors.type_doc.message}
                </FieldError>
              )}
            </Field>

            {/* Addressee (Кому) */}
            <Field>
              <FieldLabel>
                Кому
                <span className="text-red-500 ml-1">*</span>
              </FieldLabel>
              <AsyncSelect<Employee>
                fetcher={fetchEmployees}
                value={form.watch('addressee')}
                onChange={(value) => form.setValue('addressee', value)}
                label="Адресат"
                placeholder="Выберите адресата"
                renderOption={(employee) => (
                  <div className="flex flex-col">
                    <span className="font-medium">{employee.full_name}</span>
                    <span className="text-sm text-muted-foreground">
                      ID: {employee.employee_id}
                    </span>
                  </div>
                )}
                getOptionValue={(employee) => employee.id.toString()}
                getDisplayValue={(employee) => employee.full_name}
                width="100%"
                autoSize={false}
              />
              {form.formState.errors.addressee && (
                <FieldError>
                  {form.formState.errors.addressee.message}
                </FieldError>
              )}
            </Field>

            {/* Theme/Subject */}
            <Field>
              <FieldLabel>
                Тема
                <span className="text-red-500 ml-1">*</span>
              </FieldLabel>
              <Input
                placeholder="Введите тему обращения"
                {...form.register('type')}
              />
              {form.formState.errors.type && (
                <FieldError>
                  {form.formState.errors.type.message}
                </FieldError>
              )}
            </Field>

            {/* Main Document File */}
            <Field>
              <FieldLabel>
                Основной документ
                <span className="text-red-500 ml-1">*</span>
              </FieldLabel>
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById('mainFileInput')?.click()}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium">
                    {form.watch('file')?.name || 'Выберите основной файл документа'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Поддерживаются любые типы файлов
                  </p>
                </div>
                <Input
                  id="mainFileInput"
                  type="file"
                  onChange={handleMainFileSelect}
                  className="hidden"
                />
              </div>
              {form.watch('file') && (
                <div className="flex items-center justify-between p-3 border border-border rounded-md bg-card">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{form.watch('file').name}</span>
                      <span className="text-xs text-muted-foreground">
                        {(form.watch('file').size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeMainFile}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {form.formState.errors.file && (
                <FieldError>
                  {form.formState.errors.file.message as string}
                </FieldError>
              )}
            </Field>

            {/* Document Content/Text */}
            <Field>
              <FieldLabel>
                Содержимое документа
                <span className="text-red-500 ml-1">*</span>
              </FieldLabel>
              <Textarea
                placeholder="Введите содержимое документа"
                {...form.register('text')}
                rows={5}
              />
              {form.formState.errors.text && (
                <FieldError>
                  {form.formState.errors.text.message}
                </FieldError>
              )}
            </Field>

            {/* Additional Files */}
            <Field>
              <FieldLabel>Прикрепите дополнительные файлы</FieldLabel>
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById('additionalFilesInput')?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-primary', 'bg-primary/5');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
                  const files = Array.from(e.dataTransfer.files);
                  const currentFiles = form.getValues('files');
                  form.setValue('files', [...currentFiles, ...files]);
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium">Выберите дополнительные файлы</p>
                  <p className="text-xs text-muted-foreground">
                    Поддерживаются любые типы файлов
                  </p>
                </div>
                <Input
                  id="additionalFilesInput"
                  type="file"
                  multiple
                  onChange={handleAdditionalFilesSelect}
                  className="hidden"
                />
              </div>
              {form.watch('files').length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Выбрано файлов: {form.watch('files').length}
                </div>
              )}
              {form.watch('files').length > 0 && (
                <div className="space-y-2">
                  {form.watch('files').map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-border rounded-md bg-card"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                          <Upload className="h-4 w-4 text-primary" />
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
            </Field>

            {/* Very Urgent Checkbox */}
            <Field>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="very_urgent"
                  checked={form.watch('very_urgent')}
                  onCheckedChange={(checked) => form.setValue('very_urgent', checked === true)}
                />
                <FieldLabel htmlFor="very_urgent" className="text-sm font-normal cursor-pointer">
                  Очень срочно
                </FieldLabel>
              </div>
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

