# Изменения в системе создания задач

## Обзор изменений

Полностью переработаны компоненты создания задач с оптимизацией и упрощением API.

## Новые компоненты

### 1. AsyncSelect (src/shared/components/select/AsyncSelect.tsx)
- Упрощенный компонент выбора одного пользователя
- Встроенная интеграция с `useUsersList`
- Автоматическая загрузка и фильтрация пользователей
- Отображение аватара, имени и email
- Растягивается на всю ширину контейнера

### 2. AsyncMultiSelect (src/shared/components/select/AsyncMultiSelect.tsx)
- Компонент множественного выбора пользователей
- Встроенная интеграция с `useUsersList`
- Отображение выбранных пользователей в виде badges
- Компактный режим при большом количестве выбранных
- Растягивается на всю ширину контейнера

## Новые API endpoints

### User API (src/entities/user/model/api/index.ts)
```typescript
// Синхронизация пользователей перед созданием задачи
POST http://localhost:8080/api/v1/users/sync
Body: UserListItem[]
```

### Task API (src/features/create-task/model/api/index.ts)
```typescript
// Создание задачи
POST http://localhost:8080/api/v1/tasks
Body: {
  title: string;
  description?: string;
  isImportant: boolean;
  responsible: string; // user_id
  observers: string[];
  coExecutors: string[];
  deadline: string; // ISO date
}

// Загрузка файла к задаче
POST http://localhost:8080/api/v1/tasks/{id}/files
Content-Type: multipart/form-data
Fields:
  - file: File (обязательно)
  - url: string (опционально)
  - extra: JSON (опционально)
```

## Новые queries

### User queries (src/entities/user/model/queries/index.ts)
- `useUsersList()` - получение списка пользователей
- `useSyncUsers()` - синхронизация пользователей

### Task queries (src/features/create-task/model/queries/index.ts)
- `useCreateTask()` - создание задачи
- `useUploadTaskFile()` - загрузка файла к задаче

## Обновленные типы

### CreateTaskFormData (src/features/create-task/model/types/index.ts)
```typescript
{
  taskName: string;
  description?: string;
  isImportant: boolean;
 
  responsible: UserListItem; // Теперь полный объект
  observers: UserListItem[]; // Теперь массив объектов
  coExecutors: UserListItem[]; // Теперь массив объектов
  deadline: Date;
}
```

### UserListItem (src/entities/user/model/types/index.ts)
```typescript
{
  id?: number;
  user_id: string;
  full_name: string;
  middle_name: string | null;
  email: string;
  is_active?: boolean;
  avatar?: string;
  avatar_url?: string | null;
}
```

## Логика создания задачи

1. Пользователь заполняет форму
2. При отправке формы:
   - Собираются все выбранные пользователи (responsible, observers, coExecutors)
   - Отправляется запрос на `/users/sync` для синхронизации пользователей
   - Создается задача через `/tasks`
   - Загружаются файлы через `/tasks/{id}/files` (если есть)
3. После успешного создания форма очищается и диалог закрывается

## Использование

```tsx
import { CreateTaskDialog } from 'features/create-task';

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <CreateTaskDialog 
      open={open} 
      onOpenChange={setOpen} 
    />
  );
}
```

## Ключевые улучшения

1. ✅ Селекты растянуты на всю ширину
2. ✅ Вся логика внутри компонентов (не нужно передавать fetcher)
3. ✅ Использование shadcn Command компонента
4. ✅ Единый вид отображения (аватар + имя + email)
5. ✅ Возврат полных объектов вместо ID
6. ✅ Синхронизация пользователей перед созданием задачи
7. ✅ Загрузка файлов к задаче
8. ✅ Оптимизированная производительность с useWatch
