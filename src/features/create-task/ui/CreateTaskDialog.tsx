import { Calendar as CalendarIcon, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Label,
  Textarea,
  Checkbox,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'shared/ui';
import { AsyncSelect } from 'shared/components/select/AsyncSelect';
import { AsyncMultiSelect } from 'shared/components/select/AsyncMultiSelect';
import { useCreateTaskForm } from '../model/hooks/useCreateTaskForm';
import {
  fetchUsers,
  fetchStudents,
  fetchObservers,
  fetchCoExecutors,
} from '../model/api';
import {
  CreateTaskDialogUser,
  CreateTaskDialogStudent,
  CreateTaskDialogObserver,
  CreateTaskDialogCoExecutor,
} from '../model/types';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTaskDialog({ open, onOpenChange }: CreateTaskDialogProps) {
  const {
    form,
    handleFileSelect,
    removeFile,
    resetForm,
    submitForm,
    isSubmitting,
  } = useCreateTaskForm();

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
          <DialogTitle>Создать новую задачу</DialogTitle>
          <DialogDescription>
            Заполните форму ниже для создания новой задачи
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-2">
          {/* Task Name */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="taskName">Название задачи</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isImportant"
                  checked={form.watch('isImportant')}
                  onCheckedChange={(checked) => form.setValue('isImportant', checked === true)}
                />
                <Label htmlFor="isImportant" className="text-sm font-normal">
                  Важная задача
                </Label>
              </div>
            </div>
            <Input
              id="taskName"
              placeholder="Введите название задачи"
              {...form.register('taskName')}
            />
            {form.formState.errors.taskName && (
              <p className="text-sm text-destructive">
                {form.formState.errors.taskName.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              placeholder="Введите описание задачи"
              {...form.register('description')}
              rows={3}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Прикрепление файла</Label>
            <div 
              className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById('fileInput')?.click()}
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
                const currentFiles = form.getValues('selectedFiles');
                form.setValue('selectedFiles', [...currentFiles, ...files]);
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
              
                <p className="text-xs text-muted-foreground">
                  Поддерживаются любые типы файлов
                </p>
              </div>
              <Input
                id="fileInput"
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            {form.watch('selectedFiles').length > 0 && (
              <div className="text-sm text-muted-foreground">
                Выбрано файлов: {form.watch('selectedFiles').length}
              </div>
            )}
            {form.watch('selectedFiles').length > 0 && (
              <div className="space-y-2">
                {form.watch('selectedFiles').map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-md bg-card">
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
                      onClick={() => removeFile(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Responsible (Required) */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Ответственный (Обязательное поле)
              <span className="text-red-500">*</span>
            </Label>
            <AsyncSelect<CreateTaskDialogUser>
              fetcher={fetchUsers}
              value={form.watch('responsible')}
              onChange={(value) => form.setValue('responsible', value)}
              label="Ответственный"
              placeholder="Выбрать ответственного"
              renderOption={(user) => (
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                </div>
              )}
              getOptionValue={(user) => user.id}
              getDisplayValue={(user) => user.name}
              width="100%"
              autoSize={false}
            />
            {form.formState.errors.responsible && (
              <p className="text-sm text-destructive">
                {form.formState.errors.responsible.message}
              </p>
            )}
          </div>

          {/* Students */}
          <div className="space-y-2">
            <Label>Ответственный</Label>
            <AsyncMultiSelect<CreateTaskDialogStudent>
              fetcher={fetchStudents}
              value={form.watch('students')}
              onChange={(value) => form.setValue('students', value)}
              label="Студенты"
              placeholder="Выбрать студентов"
              renderOption={(student) => (
                <div className="flex flex-col">
                  <span className="font-medium">{student.name}</span>
                  <span className="text-sm text-muted-foreground">{student.group}</span>
                </div>
              )}
              getOptionValue={(student) => student.id}
              getDisplayValue={(student) => student.name}
              width="100%"
            />
          </div>

          {/* Observers */}
          <div className="space-y-2">
            <Label>Наблюдатель</Label>
            <AsyncMultiSelect<CreateTaskDialogObserver>
              fetcher={fetchObservers}
              value={form.watch('observers')}
              onChange={(value) => form.setValue('observers', value)}
              label="Наблюдатели"
              placeholder="Выбрать наблюдателей"
              renderOption={(observer) => (
                <div className="flex flex-col">
                  <span className="font-medium">{observer.name}</span>
                  <span className="text-sm text-muted-foreground">{observer.role}</span>
                </div>
              )}
              getOptionValue={(observer) => observer.id}
              getDisplayValue={(observer) => observer.name}
              width="100%"
            />
          </div>

          {/* Co-executors */}
          <div className="space-y-2">
            <Label>Соисполнитель</Label>
            <AsyncMultiSelect<CreateTaskDialogCoExecutor>
              fetcher={fetchCoExecutors}
              value={form.watch('coExecutors')}
              onChange={(value) => form.setValue('coExecutors', value)}
              label="Соисполнители"
              placeholder="Выбрать соисполнителей"
              renderOption={(coExecutor) => (
                <div className="flex flex-col">
                  <span className="font-medium">{coExecutor.name}</span>
                  <span className="text-sm text-muted-foreground">{coExecutor.department}</span>
                </div>
              )}
              getOptionValue={(coExecutor) => coExecutor.id}
              getDisplayValue={(coExecutor) => coExecutor.name}
              width="100%"
            />
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="deadline">Крайний срок</Label>
              <span className="text-sm text-muted-foreground">Дополнительные параметры</span>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch('deadline') ? (
                    format(form.watch('deadline'), 'PPP', { locale: ru })
                  ) : (
                    <span>Выберите дату</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.watch('deadline')}
                  onSelect={(date) => {
                    if (date) {
                      form.setValue('deadline', date);
                    }
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {form.formState.errors.deadline && (
              <p className="text-sm text-destructive">
                {form.formState.errors.deadline.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
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
