# FileDragDrop Компонент

Переиспользуемый компонент для загрузки файлов с поддержкой drag-and-drop, созданный на основе shadcn/ui.

## Особенности

- **Drag & Drop** - перетаскивание файлов для загрузки
- **Валидация** - проверка размера, типа и количества файлов
- **Кастомизация** - гибкая настройка внешнего вида и поведения
- **Accessibility** - поддержка клавиатуры и скринридеров
- **TypeScript** - полная типизация
- **shadcn/ui** - интеграция с дизайн-системой

## Использование

### Базовый пример

```tsx
import { FileDragDrop } from 'shared/ui';

function MyComponent() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FileDragDrop
      files={files}
      onFilesChange={setFiles}
    />
  );
}
```

### С ограничениями

```tsx
<FileDragDrop
  files={files}
  onFilesChange={setFiles}
  maxFiles={5}
  maxFileSize={10 * 1024 * 1024} // 10MB
  accept="image/*"
  title="Только изображения"
  description="JPG, PNG, GIF до 10MB"
/>
```

### Одиночный файл

```tsx
<FileDragDrop
  files={files}
  onFilesChange={setFiles}
  multiple={false}
  title="Выберите один файл"
/>
```

## API

### Props

| Prop | Тип | По умолчанию | Описание |
|------|-----|-------------|----------|
| `files` | `File[]` | **Обязательно** | Текущие выбранные файлы |
| `onFilesChange` | `(files: File[]) => void` | **Обязательно** | Callback при изменении файлов |
| `maxFiles` | `number` | `10` | Максимальное количество файлов |
| `maxFileSize` | `number` | `10MB` | Максимальный размер файла в байтах |
| `accept` | `string` | - | Разрешенные типы файлов (MIME или расширения) |
| `className` | `string` | - | Дополнительные CSS классы |
| `title` | `string` | `'Перетащите файлы сюда'` | Текст заголовка |
| `description` | `string` | `'Поддерживаются любые типы файлов'` | Текст описания |
| `showFileList` | `boolean` | `true` | Показывать список выбранных файлов |
| `multiple` | `boolean` | `true` | Множественный выбор файлов |
| `disabled` | `boolean` | `false` | Неактивное состояние |

### Валидация файлов

Компонент автоматически валидирует файлы по следующим критериям:

1. **Размер файла** - проверка `maxFileSize`
2. **Тип файла** - проверка `accept` (MIME типы или расширения)
3. **Количество файлов** - проверка `maxFiles`

### Формат accept

```tsx
// MIME типы
accept="image/*"
accept="application/pdf"
accept="text/plain"

// Расширения
accept=".jpg,.png,.gif"
accept=".pdf,.doc,.docx"

// Смешанный формат
accept="image/*,.pdf,.doc,.docx"
```

## Стили

Компонент использует классы Tailwind CSS и следует дизайн-системе shadcn/ui:

- **Активное состояние** - `border-primary bg-primary/5`
- **Hover** - `hover:border-primary/50`
- **Неактивное** - `opacity-50 cursor-not-allowed`
- **Карточки** - компонент `Card` из shadcn/ui

## Доступность

- Поддержка клавиатуры (Tab, Enter, Space)
- ARIA атрибуты для скринридеров
- Семантическая HTML разметка
- Фокусные индикаторы

## Примеры использования

Смотри `file-drag-drop.examples.tsx` для полных примеров:

- `BasicExample` - базовое использование
- `RestrictedExample` - с ограничениями
- `SingleFileExample` - одиночный файл
- `DisabledExample` - неактивное состояние
- `CustomExample` - кастомизация
- `FullExample` - все опции

## Интеграция с формами

Компонент легко интегрируется с React Hook Form:

```tsx
function FormExample() {
  const { control, setValue } = useForm();

  return (
    <Controller
      name="files"
      control={control}
      render={({ field }) => (
        <FileDragDrop
          files={field.value}
          onFilesChange={field.onChange}
        />
      )}
    />
  );
}
```

## Совместимость

- **React 18+**
- **TypeScript**
- **shadcn/ui**
- **Tailwind CSS**
- **Современные браузеры** (File API, Drag & Drop API)
