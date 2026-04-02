# Reports Entity

Модуль для работы с отчетами в системе.

## Структура

```
reports/
├── tasks/              # Отчеты по задачам
│   ├── model/
│   │   ├── api/       # API запросы к бэкенду
│   │   ├── queries/   # React Query хуки
│   │   ├── types/     # TypeScript типы
│   │   ├── hooks/     # Кастомные хуки (useDateRange)
│   │   └── utils/     # Утилиты (dateFormatter)
│   └── ui/            # UI компоненты для отчетов
│       ├── TaskReportsHeader.tsx
│       ├── TaskPerformanceCards.tsx
│       ├── TaskUsersTable.tsx
│       └── DateRangePicker.tsx
└── documents/         # Отчеты по документам (будет реализовано позже)
```

## API Endpoints

### Отчеты по задачам

Все даты передаются в RFC3339 формате: `2026-03-16T00:00:00Z`

- `GET /api/reports/users?start_date=2026-03-16T00:00:00Z&end_date=2026-03-23T23:59:59Z` - отчет по исполнителям
- `GET /api/reports/performance?start_date=2026-03-16T00:00:00Z&end_date=2026-03-23T23:59:59Z` - производительность

## Формат дат

Все даты в API используют RFC3339 формат:
- Начало дня: `2026-03-16T00:00:00Z`
- Конец дня: `2026-03-23T23:59:59Z`

Утилита `formatDateToRFC3339` автоматически форматирует даты:
```typescript
import { formatDateToRFC3339 } from 'entities/reports/tasks/model/utils/dateFormatter';

const startDate = new Date();
const formatted = formatDateToRFC3339(startDate, false); // 2026-03-16T00:00:00Z
const endOfDay = formatDateToRFC3339(startDate, true);   // 2026-03-16T23:59:59Z
```

## Использование

### В странице

```tsx
import {
  TaskReportsHeader,
  TaskPerformanceCards,
  TaskUsersTable,
  useDateRange,
  useUsersReport,
  usePerformanceReport,
} from 'entities/reports';

export const TaskReportsPage = () => {
  const { preset, setPreset, dateRange, setCustomRange } = useDateRange('week');
  const usersQuery = useUsersReport(dateRange);
  
  return (
    <div>
      <TaskReportsHeader
        preset={preset}
        onPresetChange={setPreset}
        onCustomRangeChange={setCustomRange}
        onRefresh={handleRefresh}
      />
      <TaskPerformanceCards
        performance={performanceQuery.data?.performance || defaultPerformance}
        isLoading={performanceQuery.isLoading}
      />
    </div>
  );
};
```

## Типы данных

### UserTaskStats
```typescript
{
  userId: string;
  userName: string;
  totalAssigned: number;
  completed: number;
  inProgress: number;
  avgCompletionTime: number; // в часах
}
```

### PerformanceStats
```typescript
{
  totalCreated: number;
  totalCompleted: number;
  avgCompletionTime: number;
  completionRate: number; // процент
}
```

## Компоненты

### TaskReportsHeader
Заголовок страницы с выбором периода и кнопкой обновления.

### TaskPerformanceCards
4 карточки с ключевыми метриками производительности.

### TaskUsersTable
Таблица с отчетом по исполнителям задач.

### TaskUsersTable
Таблица с отчетом по исполнителям задач с сортировкой.

### TaskOverdueList
Список просроченных задач с фильтром по приоритету.

### TaskTimelineChart
График временной динамики создания и завершения задач.

### DateRangePicker
Компонент для выбора периода отчета (сегодня, неделя, месяц, квартал).
