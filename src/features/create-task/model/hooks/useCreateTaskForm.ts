import { useForm } from 'shared/lib/form';
import { createTaskFormSchema, CreateTaskFormData } from '../types';
import { createTask } from '../api';

export const useCreateTaskForm = () => {
  const form = useForm<CreateTaskFormData>({
    schema: createTaskFormSchema,
    defaultValues: {
      taskName: '',
      description: '',
      isImportant: false,
      selectedFiles: [],
      responsible: '',
      students: [],
      observers: [],
      coExecutors: [],
      deadline: undefined,
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const currentFiles = form.getValues('selectedFiles');
    form.setValue('selectedFiles', [...currentFiles, ...files]);
  };

  const removeFile = (index: number) => {
    const currentFiles = form.getValues('selectedFiles');
    const newFiles = currentFiles.filter((_, i) => i !== index);
    form.setValue('selectedFiles', newFiles);
  };

  const resetForm = () => {
    form.reset();
  };

  const submitForm = async (data: CreateTaskFormData) => {
    try {
      await createTask(data);
      resetForm();
      return true;
    } catch (error) {
      console.error('Error creating task:', error);
      return false;
    }
  };

  return {
    form,
    handleFileSelect,
    removeFile,
    resetForm,
    submitForm,
    isSubmitting: form.formState.isSubmitting,
  };
};
