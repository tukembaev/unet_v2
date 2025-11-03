# Generic Data Table Components

Переиспользуемые компоненты для создания таблиц с табами, фильтрами и пагинацией.

## Компоненты

### GenericDataTable

Универсальная параметризуемая таблица с конфигурируемыми колонками.

**Props:**
- `data: T[]` - Массив данных для отображения
- `columns: ColumnConfig<T>[]` - Конфигурация колонок
- `onRowClick?: (item: T) => void` - Обработчик клика по строке
- `emptyMessage?: string` - Сообщение при пустой таблице
- `getRowKey: (item: T) => string | number` - Функция получения уникального ключа строки

**ColumnConfig:**
```typescript
interface ColumnConfig<T> {
  key: string;                           // Уникальный ключ колонки
  label: string;                         // Заголовок колонки
  width?: string;                        // Фиксированная ширина
  minWidth?: string;                     // Минимальная ширина
  render?: (item: T) => React.ReactNode; // Кастомный рендер ячейки
  className?: string;                    // CSS классы для ячейки
}
```

### GenericFilter

Универсальный компонент фильтрации с группами фильтров.

**Props:**
- `filterGroups: FilterGroup[]` - Группы фильтров
- `onClearAll?: () => void` - Обработчик очистки всех фильтров

**FilterGroup:**
```typescript
interface FilterGroup {
  id: string;                    // Уникальный ID группы
  label: string;                 // Название группы
  options: FilterOption[];       // Опции фильтра
  selectedValues: string[];      // Выбранные значения
  onChange: (values: string[]) => void; // Обработчик изменения
}
```

### GenericTabsContent

Универсальный компонент с табами, фильтрами и кнопками действий.

**Props:**
- `tabs: TabConfig[]` - Конфигурация табов
- `defaultTab: string` - Активный таб по умолчанию
- `columns: ColumnConfig<T>[]` - Конфигурация колонок таблицы
- `data: T[] | undefined` - Данные для отображения
- `isLoading: boolean` - Флаг загрузки
- `onTabChange: (tab: string) => void` - Обработчик смены таба
- `filterGroups: FilterGroup[]` - Группы фильтров
- `onClearFilters: () => void` - Обработчик очистки фильтров
- `buttons?: ButtonConfig[]` - Конфигурация кнопок действий
- `onRowClick?: (item: T) => void` - Обработчик клика по строке
- `emptyMessage?: string` - Сообщение при пустой таблице
- `getRowKey: (item: T) => string | number` - Функция получения ключа
- `loadingComponent: React.ReactNode` - Компонент-скелетон для загрузки

## Примеры использования

### Пример 1: Documents (Рапорты/Заявления)

```typescript
import { GenericTabsContent, ColumnConfig, FilterGroup } from 'shared/components/data-table';
import { Document } from '../model/types';

const columns: ColumnConfig<Document>[] = [
  {
    key: 'number',
    label: 'Номер',
    width: '180px',
    render: (doc) => doc.number,
  },
  {
    key: 'status',
    label: 'Статус',
    render: (doc) => (
      <Badge variant="outline">
        {statusIcon[doc.status]}
        {doc.status}
      </Badge>
    ),
  },
];

const filterGroups: FilterGroup[] = [
  {
    id: 'types',
    label: 'Тип документа',
    options: [
      { label: 'Все', value: 'all' },
      { label: 'Рапорт', value: 'Рапорт' },
    ],
    selectedValues: selectedTypes,
    onChange: setSelectedTypes,
  },
];

return (
  <GenericTabsContent
    tabs={[
      { value: 'incoming', label: 'Входящие' },
      { value: 'outgoing', label: 'Исходящие' },
    ]}
    defaultTab="incoming"
    columns={columns}
    data={documents}
    isLoading={isLoading}
    onTabChange={handleTabChange}
    filterGroups={filterGroups}
    onClearFilters={handleClearFilters}
    onRowClick={handleRowClick}
    getRowKey={(doc) => doc.id}
    loadingComponent={<Skeleton />}
  />
);
```

### Пример 2: Orders (Приказы)

```typescript
const columns: ColumnConfig<InboxOrder>[] = [
  {
    key: 'order_number',
    label: 'Номер оборота',
    width: '150px',
    render: (order) => order.order_number || order.number,
  },
  {
    key: 'title',
    label: 'Тема приказа',
    minWidth: '250px',
    render: (order) => order.title,
  },
];

return (
  <GenericTabsContent
    tabs={tabs}
    columns={columns}
    data={orders}
    // ... остальные props
  />
);
```

## Преимущества

✅ **Переиспользуемость** - Один набор компонентов для всех таблиц
✅ **Типобезопасность** - Generic типы для любых данных
✅ **Конфигурируемость** - Гибкая настройка через props
✅ **Консистентность** - Единый UI/UX для всех таблиц
✅ **Меньше дублирования** - DRY принцип

## Миграция со старых компонентов

Если вы использовали `DocumentsTable` или `DocumentsFilter`:

1. Импортируйте `GenericTabsContent` вместо старых компонентов
2. Создайте конфигурацию колонок `ColumnConfig<T>[]`
3. Создайте группы фильтров `FilterGroup[]`
4. Замените старый код на `GenericTabsContent`

**До:**
```typescript
<DocumentsTable documents={documents} />
<DocumentsFilter 
  selectedTypes={types}
  onTypesChange={setTypes}
/>
```

**После:**
```typescript
<GenericTabsContent
  columns={columnsConfig}
  data={documents}
  filterGroups={filterGroupsConfig}
  // ... другие props
/>
```

