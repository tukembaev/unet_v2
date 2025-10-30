import { useForm } from 'shared/lib/form';
import { createDocumentFormSchema, CreateDocumentFormData } from '../types';
import { createDocument } from '../api';

export const useCreateDocumentForm = () => {
  const form = useForm<CreateDocumentFormData>({
    schema: createDocumentFormSchema,
    defaultValues: {
      type_doc: undefined,
      addressee: '',
      type: '',
      text: '',
      very_urgent: false,
      file: undefined,
      files: [],
    },
  });

  const handleMainFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('file', file);
    }
  };

  const handleAdditionalFilesSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const currentFiles = form.getValues('files');
    form.setValue('files', [...currentFiles, ...files]);
  };

  const removeAdditionalFile = (index: number) => {
    const currentFiles = form.getValues('files');
    const newFiles = currentFiles.filter((_, i) => i !== index);
    form.setValue('files', newFiles);
  };

  const removeMainFile = () => {
    form.setValue('file', undefined as any);
  };

  const resetForm = () => {
    form.reset();
  };

  const submitForm = async (data: CreateDocumentFormData) => {
    try {
      await createDocument(data);
      resetForm();
      return true;
    } catch (error) {
      console.error('Error creating document:', error);
      return false;
    }
  };

  return {
    form,
    handleMainFileSelect,
    handleAdditionalFilesSelect,
    removeAdditionalFile,
    removeMainFile,
    resetForm,
    submitForm,
    isSubmitting: form.formState.isSubmitting,
  };
};

