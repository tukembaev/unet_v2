import { useForm } from 'shared/lib/form';
import { createDocumentFormSchema, CreateDocumentFormData, CreateDocumentMember } from '../types';
import { useCreateDocument } from '../queries';
import { toast } from 'sonner';

export const useCreateDocumentForm = () => {
  const form = useForm<CreateDocumentFormData>({
    schema: createDocumentFormSchema,
    defaultValues: {
      sender_id: '',
      type: 'APPLICATION',
      title: '',
      file: undefined,
      text: '',
      members: [],
      files: [],
    },
  });

  const { mutateAsync: createDocument } = useCreateDocument();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      form.setValue('file', selectedFile);
      // Очищаем текст если выбран файл
      form.setValue('text', '');
    }
  };

  const removeFile = () => {
    form.setValue('file', undefined);
  };

  const addAdditionalFile = (file: File) => {
    const currentFiles = form.getValues('files') || [];
    if (currentFiles.length >= 10) {
      toast.error('Максимум 10 дополнительных файлов');
      return;
    }
    form.setValue('files', [...currentFiles, file]);
  };

  const removeAdditionalFile = (index: number) => {
    const currentFiles = form.getValues('files') || [];
    form.setValue('files', currentFiles.filter((_, i) => i !== index));
  };

  const addMember = (member: CreateDocumentMember) => {
    const currentMembers = form.getValues('members') || [];
    const newMembers = [...currentMembers, member];
    form.setValue('members', newMembers);
  };

  const removeMember = (index: number) => {
    const currentMembers = form.getValues('members') || [];
    form.setValue('members', currentMembers.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    form.reset();
  };

  const submitForm = async (data: CreateDocumentFormData) => {
    try {
      // Validate required fields
      if (!data.sender_id) {
        toast.error('Ошибка: не удалось определить отправителя');
        return false;
      }

      if (!data.type) {
        toast.error('Выберите тип документа');
        return false;
      }

      // Проверяем что есть либо файл либо текст
      if (!data.file && !data.text) {
        toast.error('Загрузите файл или введите текст документа');
        return false;
      }

      // Create document
      await createDocument({
        sender_id: data.sender_id,
        type: data.type,
        title: data.title,
        file: data.file,
        text: data.text,
        members: data.members || [],
        files: data.files || [],
      });

      toast.success('Документ создан');
      resetForm();
      return true;
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Не удалось создать документ');
      return false;
    }
  };

  return {
    form,
    handleFileSelect,
    removeFile,
    addAdditionalFile,
    removeAdditionalFile,
    addMember,
    removeMember,
    resetForm,
    submitForm,
    isSubmitting: form.formState.isSubmitting,
  };
};
