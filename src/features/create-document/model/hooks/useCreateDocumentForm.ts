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
      file: undefined as any,
      members: [],
    },
  });

  const { mutateAsync: createDocument } = useCreateDocument();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      form.setValue('file', selectedFile);
    }
  };

  const removeFile = () => {
    form.setValue('file', null as any);
  };

  const addMember = (member: CreateDocumentMember) => {
    const currentMembers = form.getValues('members') || [];
    console.log('addMember - current members:', currentMembers);
    console.log('addMember - adding member:', member);
    
    const newMembers = [...currentMembers, member];
    console.log('addMember - new members array:', newMembers);
    
    form.setValue('members', newMembers);
    
    // Проверяем что установилось
    const afterSet = form.getValues('members');
    console.log('addMember - members after setValue:', afterSet);
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

      if (!data.file) {
        toast.error('Загрузите PDF файл');
        return false;
      }

      console.log('Submitting form with data:', {
        sender_id: data.sender_id,
        type: data.type,
        title: data.title,
        file: data.file?.name,
        members: data.members,
      });

      // Create document
      await createDocument({
        sender_id: data.sender_id,
        type: data.type,
        title: data.title,
        file: data.file,
        members: data.members || [],
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
    addMember,
    removeMember,
    resetForm,
    submitForm,
    isSubmitting: form.formState.isSubmitting,
  };
};
