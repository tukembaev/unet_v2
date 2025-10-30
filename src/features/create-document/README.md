# Create Document Feature

Этот feature предоставляет функциональность для создания новых документов (обращений/рапортов/заявлений/писем).

## Структура

```
create-document/
├── model/
│   ├── types/          # Типы и схемы валидации
│   ├── api/            # API функции
│   ├── hooks/          # React хуки
│   └── index.ts        # Экспорты модели
├── ui/
│   ├── CreateDocumentDialog.tsx  # Модальное окно с формой
│   └── index.ts        # Экспорты UI
└── index.ts            # Главный экспорт feature
```

## Использование

### Импорт компонента

```tsx
import { CreateDocumentDialog } from 'features/create-document';
```

### Пример использования

```tsx
import { useState } from 'react';
import { CreateDocumentDialog } from 'features/create-document';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Создать документ
      </button>
      
      <CreateDocumentDialog
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
}
```

## Поля формы

1. **Тип документа** (обязательное) - Селект с опциями:
   - Рапорт
   - Заявление
   - Письмо

2. **Кому** (обязательное) - AsyncSelect с загрузкой сотрудников из API
   - API endpoint: `employees/all-employees/?user_type=E`

3. **Тема** (обязательное) - Текстовое поле
   - Минимум 3 символа

4. **Основной документ** (обязательное) - Загрузка файла
   - Поддерживаются любые типы файлов

5. **Содержимое документа** (обязательное) - Текстовая область
   - Минимум 10 символов

6. **Прикрепите доп. файлы** (необязательное) - Множественная загрузка файлов
   - Поддерживается drag & drop

7. **Очень срочно** (необязательное) - Чекбокс

## API

### POST /conversion/raportsforpost/

Отправляемые данные (FormData):
```
addressee: number      // ID сотрудника
type: string           // Тема
type_doc: string       // Тип документа
text: string           // Содержимое
very_urgent: boolean   // Срочность
file: File            // Основной файл
files: File[]         // Дополнительные файлы
```

## Особенности

- ✅ Валидация формы с помощью Zod
- ✅ Использование компонента Field для форматирования
- ✅ Асинхронная загрузка списка сотрудников
- ✅ Drag & drop для загрузки файлов
- ✅ Предпросмотр выбранных файлов
- ✅ Возможность удаления файлов перед отправкой
- ✅ Индикатор загрузки при отправке
- ✅ Автоматическая очистка формы после успешной отправки

