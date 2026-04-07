# Task UI Components

## Фильтрация задач

### TaskFilter
Компонент фильтрации задач по роли пользователя.

#### Типы фильтров:

**По роли:**
- `CREATOR` - Поручил (пользователь создал задачу, но не является ни ответственным, ни участником)
- `RESPONSIBLE` - Ответственный (responsible_user_id совпадает с user_id)
- `EXECUTOR` - Соисполнитель (роль CO_EXECUTOR в members)
- `OBSERVER` - Наблюдатель (роль OBSERVER в members)

### Цветная обводка TaskCard

Карточки задач окрашиваются слева в зависимости от роли текущего пользователя:

- 🟣 **Фиолетовый** (`border-l-4 border-l-purple-500`) - CREATOR (создатель)
- 🔵 **Синий** (`border-l-4 border-l-blue-500`) - RESPONSIBLE (ответственный)
- 🟢 **Зеленый** (`border-l-4 border-l-green-500`) - EXECUTOR (соисполнитель)
- 🟡 **Желтый** (`border-l-4 border-l-yellow-500`) - OBSERVER (наблюдатель)

### Использование

```tsx
import { TaskFilter, TaskFilters } from 'entities/task';

const [filters, setFilters] = useState<TaskFilters>({
  roles: [],
});

<TaskFilter 
  selectedFilters={filters}
  onFiltersChange={setFilters}
/>

<KanbanBoard 
  tasks={tasks}
  currentUserId="1"
  filters={filters}
/>
```

### Определение роли пользователя

Роль определяется по следующему алгоритму:

1. **Проверка CREATOR:**
   - Если `task.creator_id === currentUserId` И пользователь НЕ является ответственным И НЕ находится в members → **CREATOR**
   - Если `creator_id` не указан, но пользователь не найден ни как ответственный, ни в members → **CREATOR** (fallback)

2. **Проверка RESPONSIBLE:**
   - Если `task.responsible_user_id === currentUserId` → **RESPONSIBLE**

3. **Проверка роли в members:**
   - Роль `CO_EXECUTOR` → **EXECUTOR**
   - Роль `OBSERVER` → **OBSERVER**
   - Роль `RESPONSIBLE` → **RESPONSIBLE**

**Важно:** Если пользователь является создателем, но также назначен ответственным или участником, приоритет отдается роли RESPONSIBLE/EXECUTOR/OBSERVER.

### Отладка

Для проверки работы обводки откройте консоль браузера. В логах будет информация:
- `taskId` - ID задачи
- `currentUserId` - ID текущего пользователя
- `creator_id` - ID создателя задачи
- `responsible_user_id` - ID ответственного
- `members` - список участников
- `userRole` - определенная роль пользователя
- `Border color` - применяемый класс обводки

Если обводка не показывается, проверьте:
1. Передается ли `currentUserId` в компонент KanbanBoard
2. Совпадает ли формат ID (строка/число)
3. Правильно ли определяется роль пользователя в логах

**Пример данных задачи:**
```json
{
  "id": "35dadfd9-685a-4735-a72d-a4c23277f56f",
  "creator_id": "user-123",
  "responsible_user_id": "e91fe710-3147-4262-8ce2-9703c8da1fee",
  "members": [
    {
      "user_id": "e91fe710-3147-4262-8ce2-9703c8da1fee",
      "role": "RESPONSIBLE"
    }
  ]
}
```

В этом примере:
- Если `currentUserId = "user-123"` → роль **CREATOR** (фиолетовая обводка)
- Если `currentUserId = "e91fe710-3147-4262-8ce2-9703c8da1fee"` → роль **RESPONSIBLE** (синяя обводка)
