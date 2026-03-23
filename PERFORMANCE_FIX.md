# Исправление зависания формы редактирования дисциплины

## Проблема

При нажатии на дисциплину форма редактирования сильно зависала из-за следующих причин:

### 1. Polling каждые 50ms в form-navigation.ts
В хуках `useIsFormOpen`, `useStoredFormParams` и `useCurrentForm` использовался `setInterval` с интервалом 50ms для проверки состояния форм:

```typescript
// ❌ ПЛОХО - вызывает перерендер каждые 50ms
useEffect(() => {
  const interval = setInterval(() => {
    setTrigger(prev => prev + 1);
  }, 50);
  return () => clearInterval(interval);
}, []);
```

Это приводило к:
- Постоянным перерендерам всех компонентов, использующих эти хуки
- Высокой нагрузке на CPU
- Зависанию UI при открытии формы

### 2. Избыточные defaultValues в react-hook-form
В `CourseEditModal` использовались `defaultValues` которые пересчитывались при каждом рендере, что создавало дополнительную нагрузку.

### 3. Отсутствие мемоизации callback функций
Функция `openEditor` в `SyllabusTable` создавалась заново при каждом рендере.

## Решение

### 1. Event-based подход вместо polling
Заменили polling на систему подписок (pub-sub pattern):

```typescript
// ✅ ХОРОШО - обновление только при изменении состояния
const formStateListeners = new Set<() => void>();

function notifyFormStateChange() {
  formStateListeners.forEach(listener => listener());
}

export function useIsFormOpen(formType: FormQuery): boolean {
  const [isOpen, setIsOpen] = useState(() => {
    const state = formStateStore.get(formType);
    return state?.open ?? false;
  });

  useEffect(() => {
    const listener = () => {
      const state = formStateStore.get(formType);
      setIsOpen(state?.open ?? false);
    };

    formStateListeners.add(listener);
    return () => {
      formStateListeners.delete(listener);
    };
  }, [formType]);

  return isOpen;
}
```

### 2. Убрали defaultValues из useForm
Теперь форма инициализируется только через `reset()` в `useEffect`:

```typescript
// ✅ Инициализация только при необходимости
const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
  resolver: zodResolver(schema),
});

useEffect(() => {
  if (course && open) {
    reset({ /* данные курса */ });
  }
}, [course, open, reset]);
```

### 3. Мемоизация callback функций
Использовали `useCallback` для предотвращения пересоздания функций:

```typescript
// ✅ Функция создается только один раз
const openEditor = useCallback((course: SyllabusCourse) => {
  setSelected(course);
  openForm(FormQuery.EDIT_COURSE, { courseId: course.id.toString() });
}, [openForm]);
```

## Результат

- ❌ Было: ~20 перерендеров в секунду (каждые 50ms)
- ✅ Стало: Рендер только при реальном изменении состояния
- Форма открывается мгновенно без зависаний
- Значительно снижена нагрузка на CPU

## Измененные файлы

1. `src/shared/lib/form-navigation.ts` - заменен polling на event-based подход
2. `src/features/syllabus/CourseEditModal.tsx` - убраны defaultValues, добавлена проверка open
3. `src/entities/education-management/ui/tabs/report/syllabus/SyllabusTable.tsx` - добавлен useCallback
