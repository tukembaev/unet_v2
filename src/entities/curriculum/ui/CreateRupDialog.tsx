import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
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
import { AsyncSelect } from 'shared/components/select';
import { useForm } from 'shared/lib/form';
import { z } from 'zod';
import { useFaculties } from 'entities/education-management/model/queries';

const createRupFormSchema = z
  .object({
    institute: z.string().min(1, 'Выберите институт'),
    formOfStudy: z.enum(['full_time', 'part_time'], {
      required_error: 'Выберите форму обучения',
    }),
    educationLevel: z.enum(['Бакалавр', 'Магистратура'], {
      required_error: 'Выберите уровень образования',
    }),
    startYear: z
      .string()
      .min(4, 'Год должен содержать 4 цифры')
      .max(4, 'Год должен содержать 4 цифры')
      .regex(/^\d{4}$/, 'Год должен содержать только цифры')
      .refine((val) => {
        const year = parseInt(val, 10);
        return year >= 2020 && year <= 2050;
      }, 'Год должен быть в диапазоне 2020-2050'),
    endYear: z
      .string()
      .min(4, 'Год должен содержать 4 цифры')
      .max(4, 'Год должен содержать 4 цифры')
      .regex(/^\d{4}$/, 'Год должен содержать только цифры')
      .refine((val) => {
        const year = parseInt(val, 10);
        return year >= 2020 && year <= 2050;
      }, 'Год должен быть в диапазоне 2020-2050'),
  })
  .refine((data) => {
    const startYear = parseInt(data.startYear, 10);
    const endYear = parseInt(data.endYear, 10);
    return endYear > startYear;
  }, {
    message: 'Год окончания должен быть больше года начала',
    path: ['endYear'],
  });

type CreateRupFormData = z.infer<typeof createRupFormSchema>;

interface CreateRupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateRupDialog = ({ open, onOpenChange }: CreateRupDialogProps) => {
  const { data: faculties, isLoading: isLoadingFaculties } = useFaculties();

  const form = useForm<CreateRupFormData>({
    schema: createRupFormSchema,
    defaultValues: {
      institute: '',
      formOfStudy: undefined,
      educationLevel: undefined,
      startYear: '',
      endYear: '',
    },
  });

  const fetchFaculties = async (query?: string) => {
    if (!faculties || faculties.length === 0) return [];
    if (!query) return faculties;
    return faculties.filter((faculty) =>
      faculty.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  const handleSubmit = async (data: CreateRupFormData) => {
    try {
      // TODO: Implement API call to create RUP
      console.log('Creating RUP:', data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating RUP:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать РУП</DialogTitle>
          <DialogDescription>
            Заполните форму ниже для создания новой рабочей учебной программы
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            {/* Institute */}
            <Field className="flex flex-col">
              <FieldLabel>
                Институт
                <span className="text-red-500 ml-1">*</span>
              </FieldLabel>
              <AsyncSelect
                fetcher={fetchFaculties}
                label="Институт"
                value={form.watch('institute')}
                onChange={(value) => form.setValue('institute', value)}
                renderOption={(option) => <span>{option.label}</span>}
                getOptionValue={(option) => option.value.toString()}
                getDisplayValue={(option) => option.label}
                placeholder="Выберите институт"
                disabled={isLoadingFaculties}
              />
              {form.formState.errors.institute && (
                <FieldError>{form.formState.errors.institute.message}</FieldError>
              )}
            </Field>

            {/* Form of Study */}
            <Field>
              <FieldLabel>
                Форма обучения
                <span className="text-red-500 ml-1">*</span>
              </FieldLabel>
              <Select
                value={form.watch('formOfStudy')}
                onValueChange={(value) => form.setValue('formOfStudy', value as 'full_time' | 'part_time')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите форму обучения" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Очная</SelectItem>
                  <SelectItem value="part_time">Заочная</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.formOfStudy && (
                <FieldError>{form.formState.errors.formOfStudy.message}</FieldError>
              )}
            </Field>

            {/* Education Level */}
            <Field>
              <FieldLabel>
                Уровень образования
                <span className="text-red-500 ml-1">*</span>
              </FieldLabel>
              <Select
                value={form.watch('educationLevel')}
                onValueChange={(value) => form.setValue('educationLevel', value as 'Бакалавр' | 'Магистратура')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите уровень образования" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Бакалавр">Бакалавр</SelectItem>
                  <SelectItem value="Магистратура">Магистратура</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.educationLevel && (
                <FieldError>{form.formState.errors.educationLevel.message}</FieldError>
              )}
            </Field>

            {/* Year Range */}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>
                  Год начала
                  <span className="text-red-500 ml-1">*</span>
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="2020"
                  maxLength={4}
                  value={form.watch('startYear')}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    form.setValue('startYear', value);
                  }}
                />
                {form.formState.errors.startYear && (
                  <FieldError>{form.formState.errors.startYear.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>
                  Год окончания
                  <span className="text-red-500 ml-1">*</span>
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="2024"
                  maxLength={4}
                  value={form.watch('endYear')}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    form.setValue('endYear', value);
                  }}
                />
                {form.formState.errors.endYear && (
                  <FieldError>{form.formState.errors.endYear.message}</FieldError>
                )}
              </Field>
            </div>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Отмена
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Создание...' : 'Создать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

