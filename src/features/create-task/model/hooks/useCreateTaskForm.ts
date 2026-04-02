import { useForm } from 'shared/lib/form';
import { createTaskFormSchema, CreateTaskFormData } from '../types';
import { useCreateTask } from '../queries';
import { useSyncUsers } from 'entities/user/model/queries';
import { UserListItem } from 'entities/user/model/types';
import { toast } from 'sonner';

export const useCreateTaskForm = () => {
  const form = useForm<CreateTaskFormData>({
    schema: createTaskFormSchema,
    defaultValues: {
      taskName: '',
      description: '',
      isImportant: false,
      parent_task_id: '',
      responsible: null as unknown as UserListItem,
      observers: [],
      coExecutors: [],
      deadline: undefined,
      doc_title: undefined,
      doc_id: undefined,
      doc_type: undefined,
    },
  });

  const { mutateAsync: syncUsers } = useSyncUsers();
  const { mutateAsync: createTask } = useCreateTask();
 

  const resetForm = () => {
    form.reset();
  };

  const submitForm = async (data: CreateTaskFormData) => {
    try {
      // Собираем всех пользователей для синхронизации
      const usersToSync: UserListItem[] = [
        data.responsible,
        ...data.observers,
        ...data.coExecutors,
      ].filter(Boolean);

      // Синхронизируем пользователей
      if (usersToSync.length > 0) {
        await syncUsers(usersToSync);
      }

      // Создаем задачу
      await createTask({
        title: data.taskName,
        description: data.description,
        isImportant: data.isImportant,
        responsible: data.responsible.user_id,
        observers: data.observers.map(u => u.user_id),
        coExecutors: data.coExecutors.map(u => u.user_id),
        deadline: data.deadline.toISOString(),
        parent_task_id: data.parent_task_id ? data.parent_task_id : undefined,
        doc_title: data.doc_title,
        doc_id: data.doc_id,
        doc_type: data.doc_type,
      });

      toast.success('Задача создана');
      resetForm();
      return true;
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Не удалось создать задачу');
      return false;
    }
  };

  return {
    form,
    resetForm,
    submitForm,
    isSubmitting: form.formState.isSubmitting,
  };
};
