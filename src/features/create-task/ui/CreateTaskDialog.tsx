import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import React from 'react';
import { useWatch } from 'react-hook-form';
import { AsyncMultiSelect } from 'shared/components/select/AsyncMultiSelect';
import { AsyncSelect } from 'shared/components/select/AsyncSelect';
import {
  Button,
  Calendar,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea
} from 'shared/ui';
import { FormQuery, useIsFormOpen, useFormClose, useStoredFormParam } from 'shared/lib';

import { useCreateTaskForm } from '../model/hooks/useCreateTaskForm';

export function CreateTaskDialog() {
  const open = useIsFormOpen(FormQuery.CREATE_TASK);
  const closeForm = useFormClose();
  const parentTaskId = useStoredFormParam(FormQuery.CREATE_TASK, 'task_id');
  
  // Получаем параметры документа
  const documentName = useStoredFormParam(FormQuery.CREATE_TASK, 'documentName');
  const docId = useStoredFormParam(FormQuery.CREATE_TASK, 'doc_id');
  const documentType = useStoredFormParam(FormQuery.CREATE_TASK, 'documentType');

  const {
    form,
    resetForm,
    submitForm,
    isSubmitting,
  } = useCreateTaskForm();
  const { setValue } = form;

  const isImportant = useWatch({ control: form.control, name: 'isImportant' });
  const deadline = useWatch({ control: form.control, name: 'deadline' });
  const responsible = useWatch({ control: form.control, name: 'responsible' });
  const observers = useWatch({ control: form.control, name: 'observers' });
  const coExecutors = useWatch({ control: form.control, name: 'coExecutors' });

  const handleCancel = () => {
    resetForm();
    closeForm(FormQuery.CREATE_TASK);
  };

  const handleFormSubmit = async (data: any) => {
    const success = await submitForm(data);
    if (success) {
      closeForm(FormQuery.CREATE_TASK);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
      closeForm(FormQuery.CREATE_TASK);
    }
  };

  // Устанавливаем parent_task_id когда компонент монтируется или изменяется parentTaskId
  React.useEffect(() => {
    if (parentTaskId) {
      setValue('parent_task_id', parentTaskId);
    } else {
      setValue('parent_task_id', '');
    }
  }, [parentTaskId, setValue]);

  // Устанавливаем данные документа, если они переданы
  React.useEffect(() => {
    if (documentName) {
      setValue('doc_title', documentName);
    }
    if (docId) {
      setValue('doc_id', docId);
    }
    if (documentType) {
      setValue('doc_type', documentType);
    }
  }, [documentName, docId, documentType, setValue]);


  const isSubtaskMode = !!parentTaskId;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isSubtaskMode ? 'Создать подзадачу' : 'Создать новую задачу'}
          </DialogTitle>
          <DialogDescription>
            {isSubtaskMode
              ? 'Заполните форму ниже для создания подзадачи'
              : 'Заполните форму ниже для создания новой задачи'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
          {/* Task Name */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="taskName">Название задачи</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isImportant"
                  checked={isImportant}
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

          {/* Responsible */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Ответственный
              <span className="text-red-500">*</span>
            </Label>
            <AsyncSelect
              value={responsible}
              onChange={(value) => form.setValue('responsible', value as any)}
              placeholder="Выбрать ответственного"
            />
            {form.formState.errors.responsible && (
              <p className="text-sm text-destructive">
                {form.formState.errors.responsible.message}
              </p>
            )}
          </div>

          {/* Observers */}
          <div className="space-y-2">
            <Label>Наблюдатель</Label>
            <AsyncMultiSelect
              value={observers}
              onChange={(value) => form.setValue('observers', value)}
              placeholder="Выбрать наблюдателей"
            />
          </div>

          {/* Co-executors */}
          <div className="space-y-2">
            <Label>Соисполнитель</Label>
            <AsyncMultiSelect
              value={coExecutors}
              onChange={(value) => form.setValue('coExecutors', value)}
              placeholder="Выбрать соисполнителей"
            />
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline">Крайний срок</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? (
                    format(deadline, 'PPP', { locale: ru })
                  ) : (
                    <span>Выберите дату</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={(date) => {
                    if (date) {
                      form.setValue('deadline', date);
                    }
                  }}
                  disabled={(date) => date < new Date()}
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
            <Button variant="outline" type="button" onClick={handleCancel} disabled={isSubmitting}>
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? (isSubtaskMode ? 'Создание...' : 'Создание...')
                : (isSubtaskMode ? 'Создать подзадачу' : 'Создать')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
