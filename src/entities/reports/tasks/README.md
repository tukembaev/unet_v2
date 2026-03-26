# Отчеты по задачам

Модуль для работы с отчетами по задачам, включающий отчеты по исполнителям и детальные отчеты по задачам с фильтрацией.

## Компоненты

### ReportsTabsSection
Основной компонент с табами для переключения между отчетами:
- **Отчет по исполнителям** - статистика по пользователям
- **Отчет по задачам** - детальная таблица задач с фильтрами и возможностью скачивания PDF

### TasksTable
Таблица задач с возможностью фильтрации по:
- **Роль**: Ответственный, Исполнитель, Наблюдатель, Поручитель
- **Статус**: В очереди, В работе, Приостановлено, На проверке, Завершено, Отменено
- **Кнопка "Скачать PDF"** - экспорт отчета в PDF с учетом выбранных фильтров

## API

### GET /api/v1/reports/tasks
Получение списка задач с фильтрацией.

**Параметры:**
- `start_date` (обязательный) - дата начала периода в RFC3339
- `end_date` (обязательный) - дата окончания периода в RFC3339  
- `role` (опциональный) - роль участника: `RESPONSIBLE`, `EXECUTOR`, `OBSERVER`, `CREATOR`
- `status` (опциональный) - статус задачи: `PENDING`, `IN_PROGRESS`, `PAUSED`, `REVIEW`, `COMPLETED`, `CANCELED`

### GET /api/v1/reports/tasks/pdf
Скачивание PDF-отчета по задачам.

**Параметры:**
- `start_date` (обязательный) - дата начала периода в RFC3339
- `end_date` (обязательный) - дата окончания периода в RFC3339  
- `role` (опциональный) - фильтр по роли
- `status` (опциональный) - фильтр по статусу

**Ответ:** Blob (application/pdf)

**Пример:**
```bash
curl -X GET "http://localhost:8080/api/v1/reports/tasks/pdf?start_date=2024-01-01T00:00:00Z&end_date=2024-12-31T23:59:59Z&status=COMPLETED" \
-H "Authorization: Bearer TOKEN" \
--output отчет.pdf
```

## Использование

```tsx
import { ReportsTabsSection } from 'entities/reports';

<ReportsTabsSection
  users={usersData}
  isUsersLoading={isLoading}
  dateRange={dateRange}
/>
```

## Хуки

### useDownloadTasksPdf
Хук для скачивания PDF-отчета по задачам.

```tsx
const { downloadPdf, isDownloading, error } = useDownloadTasksPdf();

await downloadPdf({
  start_date: '2024-01-01T00:00:00Z',
  end_date: '2024-12-31T23:59:59Z',
  role: 'RESPONSIBLE',
  status: 'COMPLETED'
});
```

## Типы

- `TaskRole` - роли участников задач
- `TaskStatus` - статусы задач  
- `ReportTask` - структура задачи в отчете
- `TasksReportParams` - параметры запроса отчета по задачам
- `TasksReportResponse` - ответ API с задачами
