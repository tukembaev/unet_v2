# Исправление избыточных перерендеров при открытии модалки создания задачи

## Проблема
При открытии модалки создания задачи происходили избыточные перерендеры всех TaskCard компонентов и родительских компонентов из-за:
1. Множественных вызовов `form.watch()` в CreateTaskDialog
2. Отсутствия мемоизации компонентов
3. Создания новых функций-обработчиков при каждом рендере

## Решение

### 1. Оптимизация CreateTaskDialog
**Файл:** `src/features/create-task/ui/CreateTaskDialog.tsx`

- Заменили все `form.watch()` на `useWatch` из react-hook-form
- `useWatch` создает изолированные подписки только на нужные поля формы
- Это предотвращает перерендер всего компонента при изменении любого поля

```typescript
// Было:
form.watch('isImportant')
form.watch('selectedFiles')
form.watch('deadline')

// Стало:
const isImportant = useWatch({ control: form.control, name: 'isImportant' });
const selectedFiles = useWatch({ control: form.control, name: 'selectedFiles' });
const deadline = useWatch({ control: form.control, name: 'deadline' });
```

### 2. Мемоизация TaskCard
**Файл:** `src/entities/task/ui/TaskCard.tsx`

- Обернули компонент в `React.memo()`
- Теперь TaskCard перерендеривается только при изменении пропсов
- Предотвращает лишние рендеры при открытии/закрытии модалки

```typescript
const TaskCardComponent: React.FC<TaskCardProps> = ({ task }) => {
  // ... код компонента
};

export const TaskCard = React.memo(TaskCardComponent);
```

### 3. Мемоизация KanbanBoard
**Файл:** `src/entities/task/ui/KanbanBoard.tsx`

- Обернули компонент в `React.memo()`
- Предотвращает перерендер всей доски при изменении состояния модалки

### 4. Оптимизация обработчиков в TaskPage
**Файл:** `src/pages/task/index.tsx`

- Обернули все обработчики в `useCallback`
- Предотвращает создание новых функций при каждом рендере
- Стабильные ссылки на функции не вызывают перерендер дочерних компонентов

```typescript
const handleSearch = useCallback((value: string) => {
  console.log('Search:', value)
}, [])

const handleFiltersChange = useCallback((filters: string[]) => {
  setSelectedFilters(filters)
}, [])

const handleAddTask = useCallback(() => {
  setIsCreateTaskDialogOpen(true)
}, [])
```

### 5. Мемоизация TaskTabsContent
**Файл:** `src/entities/task/ui/TaskTabsContent.tsx`

- Обернули компонент в `React.memo()`
- Предотвращает перерендер при открытии модалки
- Компонент обновляется только при изменении `tasksData` или `selectedFilters`

### 6. Мемоизация TaskSearchFilter
**Файл:** `src/entities/task/ui/TaskSearchFilter.tsx`

- Обернули компонент в `React.memo()`
- Предотвращает лишние рендеры при изменении состояния модалки
- Компонент обновляется только при изменении пропсов

## Результат
- Открытие модалки больше не вызывает перерендер TaskCard компонентов
- Изменения в форме модалки не влияют на родительские компоненты
- Улучшена производительность приложения
- Уменьшено количество ненужных рендеров
