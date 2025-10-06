# Feature-Sliced Design - Complete Example

This guide shows how to create a complete feature following FSD architecture.

## Example: Creating a "Todo List" Feature

### 1. Create the Entity (Domain Model)

**File:** `src/entities/todo/model/types.ts`
```typescript
export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export type CreateTodoDto = Omit<Todo, 'id' | 'createdAt'>;
export type UpdateTodoDto = Partial<CreateTodoDto>;
```

**File:** `src/entities/todo/api/todoApi.ts`
```typescript
import { apiClient } from 'shared/config/axios';
import type { Todo, CreateTodoDto, UpdateTodoDto } from '../model/types';

export const todoApi = {
  getAll: async (): Promise<Todo[]> => {
    const { data } = await apiClient.get('/todos');
    return data;
  },

  getById: async (id: string): Promise<Todo> => {
    const { data } = await apiClient.get(`/todos/${id}`);
    return data;
  },

  create: async (dto: CreateTodoDto): Promise<Todo> => {
    const { data } = await apiClient.post('/todos', dto);
    return data;
  },

  update: async (id: string, dto: UpdateTodoDto): Promise<Todo> => {
    const { data } = await apiClient.patch(`/todos/${id}`, dto);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/todos/${id}`);
  },
};
```

**File:** `src/entities/todo/index.ts`
```typescript
export { todoApi } from './api/todoApi';
export type { Todo, CreateTodoDto, UpdateTodoDto } from './model/types';
```

### 2. Create Features (User Interactions)

**File:** `src/features/add-todo/ui/AddTodoForm.tsx`
```typescript
import { useForm, FormField } from 'shared/lib/form';
import { Button, Card, CardHeader, CardTitle, CardContent } from 'shared/ui';
import { z } from 'zod';
import { toast } from 'sonner';

const addTodoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

type AddTodoFormData = z.infer<typeof addTodoSchema>;

interface AddTodoFormProps {
  onSuccess: () => void;
}

export function AddTodoForm({ onSuccess }: AddTodoFormProps) {
  const form = useForm<AddTodoFormData>({
    schema: addTodoSchema,
    defaultValues: { title: '', description: '' },
  });

  const onSubmit = form.handleSubmit(async (data: AddTodoFormData) => {
    try {
      // API call would go here
      console.log('Creating todo:', data);
      toast.success('Todo created!');
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error('Failed to create todo');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Todo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            form={form}
            name="title"
            label="Title"
            placeholder="Enter todo title"
            required
          />
          <FormField
            form={form}
            name="description"
            label="Description"
            placeholder="Enter description (optional)"
          />
          <Button type="submit">Add Todo</Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

**File:** `src/features/add-todo/model/useAddTodo.ts`
```typescript
import { useMutation } from '@tanstack/react-query';
import { todoApi, type CreateTodoDto } from 'entities/todo';
import { queryClient } from 'shared/config/query-client';

export function useAddTodo() {
  return useMutation({
    mutationFn: (dto: CreateTodoDto) => todoApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}
```

**File:** `src/features/add-todo/index.ts`
```typescript
export { AddTodoForm } from './ui/AddTodoForm';
export { useAddTodo } from './model/useAddTodo';
```

**File:** `src/features/toggle-todo/model/useToggleTodo.ts`
```typescript
import { useMutation } from '@tanstack/react-query';
import { todoApi } from 'entities/todo';
import { queryClient } from 'shared/config/query-client';

export function useToggleTodo() {
  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      todoApi.update(id, { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}
```

**File:** `src/features/toggle-todo/index.ts`
```typescript
export { useToggleTodo } from './model/useToggleTodo';
```

### 3. Create a Widget (Complex UI Block)

**File:** `src/widgets/todo-list/ui/TodoList.tsx`
```typescript
import { useQuery } from '@tanstack/react-query';
import { todoApi, type Todo } from 'entities/todo';
import { useToggleTodo } from 'features/toggle-todo';
import { Card, CardHeader, CardTitle, CardContent, Button } from 'shared/ui';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';
import { cn } from 'shared/lib/utils';

export function TodoList() {
  const { data: todos, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: todoApi.getAll,
  });

  const toggleTodo = useToggleTodo();

  if (isLoading) {
    return <div>Loading todos...</div>;
  }

  if (error) {
    return <div>Error loading todos: {error.message}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Todos</CardTitle>
      </CardHeader>
      <CardContent>
        {todos && todos.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No todos yet. Add one to get started!
          </p>
        ) : (
          <ul className="space-y-2">
            {todos?.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={() =>
                  toggleTodo.mutate({ id: todo.id, completed: !todo.completed })
                }
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
}

function TodoItem({ todo, onToggle }: TodoItemProps) {
  return (
    <li
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border',
        'hover:bg-accent transition-colors',
        todo.completed && 'opacity-60'
      )}
    >
      <button onClick={onToggle} className="shrink-0">
        {todo.completed ? (
          <CheckCircle className="h-5 w-5 text-primary" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      <div className="flex-1">
        <h3
          className={cn(
            'font-medium',
            todo.completed && 'line-through text-muted-foreground'
          )}
        >
          {todo.title}
        </h3>
        {todo.description && (
          <p className="text-sm text-muted-foreground">{todo.description}</p>
        )}
      </div>

      <Button variant="ghost" size="icon">
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  );
}
```

**File:** `src/widgets/todo-list/index.ts`
```typescript
export { TodoList } from './ui/TodoList';
```

### 4. Create a Page

**File:** `src/pages/todos/index.tsx`
```typescript
import { AddTodoForm } from 'features/add-todo';
import { TodoList } from 'widgets/todo-list';
import { queryClient } from 'shared/config/query-client';

export function TodosPage() {
  const handleTodoAdded = () => {
    // Refresh the list when a todo is added
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">My Todos</h1>
          <p className="text-muted-foreground">
            Manage your tasks efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <AddTodoForm onSuccess={handleTodoAdded} />
          <TodoList />
        </div>
      </div>
    </div>
  );
}
```

### 5. Add Route

**File:** `src/app/providers/router.tsx`
```typescript
import { TodosPage } from 'pages/todos';

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  TODOS: '/todos', // ← Add this
} as const;

// In routes array:
const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.ABOUT, element: <AboutPage /> },
      { path: ROUTES.TODOS, element: <TodosPage /> }, // ← Add this
    ],
  },
  // ...
];
```

## Project Structure After Adding Todo Feature

```
src/
├── entities/
│   └── todo/
│       ├── model/
│       │   └── types.ts
│       ├── api/
│       │   └── todoApi.ts
│       └── index.ts
│
├── features/
│   ├── add-todo/
│   │   ├── ui/
│   │   │   └── AddTodoForm.tsx
│   │   ├── model/
│   │   │   └── useAddTodo.ts
│   │   └── index.ts
│   │
│   └── toggle-todo/
│       ├── model/
│       │   └── useToggleTodo.ts
│       └── index.ts
│
├── widgets/
│   └── todo-list/
│       ├── ui/
│       │   └── TodoList.tsx
│       └── index.ts
│
└── pages/
    └── todos/
        └── index.tsx
```

## FSD Layer Rules

### ✅ Allowed Imports (Top-Down)

- **pages** can import from: widgets, features, entities, shared
- **widgets** can import from: features, entities, shared
- **features** can import from: entities, shared
- **entities** can import from: shared
- **shared** cannot import from other layers

### ❌ Forbidden Imports

- Lower layers CANNOT import from upper layers
- Entities CANNOT import from features or widgets
- Features CANNOT import from widgets or pages
- Shared CANNOT import from any layer

### 📁 Segments (Optional Structure)

Each slice can have these segments:
- **ui/** - React components
- **api/** - API calls
- **model/** - Business logic, hooks, state, types
- **lib/** - Helper functions
- **config/** - Configuration

## Best Practices

1. **Each feature does ONE thing** - Add todo, toggle todo, delete todo are separate features
2. **Entities are pure domain models** - No UI, just data structures and API calls
3. **Widgets compose features** - TodoList uses toggle-todo feature
4. **Pages compose widgets** - TodosPage uses TodoList widget and AddTodoForm
5. **Use index.ts for public API** - Export only what other layers need
6. **Keep shared generic** - Don't add business logic to shared layer

## Common Patterns

### Pattern 1: Feature with Form
```
features/
└── add-todo/
    ├── ui/
    │   └── AddTodoForm.tsx    # Form UI
    ├── model/
    │   ├── schema.ts          # Zod validation
    │   └── useAddTodo.ts      # Mutation hook
    └── index.ts
```

### Pattern 2: Feature with Modal
```
features/
└── edit-todo/
    ├── ui/
    │   ├── EditTodoModal.tsx  # Modal UI
    │   └── EditTodoForm.tsx   # Form inside modal
    ├── model/
    │   └── useEditTodo.ts     # Mutation hook
    └── index.ts
```

### Pattern 3: Complex Widget
```
widgets/
└── todo-dashboard/
    ├── ui/
    │   ├── TodoDashboard.tsx  # Main widget
    │   ├── TodoStats.tsx      # Subcomponent
    │   └── TodoChart.tsx      # Subcomponent
    ├── model/
    │   └── useTodoStats.ts    # Custom hook
    └── index.ts
```

---

**This structure scales!** As your app grows, you simply add more slices without creating coupling between them.

