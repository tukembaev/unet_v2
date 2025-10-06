# Quick Reference Guide

## Installation

```bash
npm install
npm run dev
```

Visit: `http://localhost:5173`

## Common Tasks

### 1. Create a New Page

```typescript
// src/pages/profile/index.tsx
export function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold">Profile</h1>
    </div>
  );
}

// Add to src/app/providers/router.tsx
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  PROFILE: '/profile', // ← Add here
} as const;

// In routes array:
{
  path: ROUTES.PROFILE,
  element: <ProfilePage />,
}
```

### 2. Create a Form with Validation

```typescript
import { useForm, FormField } from 'shared/lib/form';
import { Button } from 'shared/ui';
import { z } from 'zod';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
  age: z.number().min(18, 'Must be 18+'),
});

type FormData = z.infer<typeof schema>;

function MyForm() {
  const form = useForm<FormData>({
    schema,
    defaultValues: { email: '', password: '', age: 0 }
  });

  const onSubmit = form.handleSubmit(async (data: FormData) => {
    try {
      // API call here
      console.log(data);
      toast.success('Success!');
    } catch (error) {
      toast.error('Failed!');
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField form={form} name="email" label="Email" type="email" required />
      <FormField form={form} name="password" label="Password" type="password" required />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### 3. Fetch Data with TanStack Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from 'shared/config/axios';
import { queryClient } from 'shared/config/query-client';

// Fetch data
function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await apiClient.get('/users');
      return data;
    },
  });
}

// Mutate data
function useCreateUser() {
  return useMutation({
    mutationFn: async (userData: User) => {
      const { data } = await apiClient.post('/users', userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Usage in component
function UsersList() {
  const { data, isLoading, error } = useUsers();
  const createUser = useCreateUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.map(user => <div key={user.id}>{user.name}</div>)}
      <button onClick={() => createUser.mutate({ name: 'John' })}>
        Add User
      </button>
    </div>
  );
}
```

### 4. Make API Calls

```typescript
import { apiClient } from 'shared/config/axios';

// GET request
const users = await apiClient.get('/users');

// POST request
const newUser = await apiClient.post('/users', { name: 'John' });

// PUT request
const updated = await apiClient.put('/users/1', { name: 'Jane' });

// DELETE request
await apiClient.delete('/users/1');

// With custom config
const data = await apiClient.get('/users', {
  params: { page: 1, limit: 10 },
  headers: { 'Custom-Header': 'value' }
});
```

### 5. Show Notifications

```typescript
import { toast } from 'sonner';

// Success
toast.success('User created!');

// Error
toast.error('Something went wrong!');

// Info
toast.info('This is information');

// Warning
toast.warning('Be careful!');

// With description
toast.success('Success', {
  description: 'Your changes have been saved.',
});

// Custom duration
toast.success('Quick message', { duration: 2000 });
```

### 6. Navigate Between Pages

```typescript
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from 'app/providers/router';

function MyComponent() {
  const navigate = useNavigate();

  // Using Link component
  return (
    <div>
      <Link to={ROUTES.HOME}>Home</Link>
      <Link to={ROUTES.ABOUT}>About</Link>
      
      {/* Programmatic navigation */}
      <button onClick={() => navigate(ROUTES.PROFILE)}>
        Go to Profile
      </button>
      
      {/* Go back */}
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}
```

### 7. Use Shadcn UI Components

```typescript
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Label } from 'shared/ui';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter name" />
        </div>
        
        <div className="flex gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 8. Style Components with Tailwind

```typescript
import { cn } from 'shared/lib/utils';

function MyComponent({ className, isActive }: Props) {
  return (
    <div 
      className={cn(
        "p-4 rounded-lg border",
        isActive && "bg-primary text-primary-foreground",
        className
      )}
    >
      Content
    </div>
  );
}
```

### 9. Error Boundary Usage

```typescript
import { ErrorBoundary } from 'app/providers/error-boundary';

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to error reporting service
        console.error('Error caught:', error, errorInfo);
      }}
    >
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### 10. Environment Variables

```typescript
// Access environment variables
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

// Add to .env file:
// VITE_API_BASE_URL=http://localhost:3000/api
// VITE_CUSTOM_VAR=value
```

## File Structure for New Features

```
src/
├── features/
│   └── auth/                    # Authentication feature
│       ├── ui/                  # Feature UI components
│       │   ├── LoginForm.tsx
│       │   └── RegisterForm.tsx
│       ├── api/                 # Feature API calls
│       │   └── authApi.ts
│       ├── model/               # Feature state/logic
│       │   └── useAuth.ts
│       └── index.ts             # Public API
│
├── entities/
│   └── user/                    # User entity
│       ├── model/               # User types, state
│       │   └── types.ts
│       ├── api/                 # User API calls
│       │   └── userApi.ts
│       └── index.ts
│
└── widgets/
    └── header/                  # Header widget
        ├── ui/
        │   └── Header.tsx
        └── index.ts
```

## Icons with Lucide React

```typescript
import { 
  Home, 
  User, 
  Settings, 
  Mail, 
  Lock,
  AlertCircle,
  CheckCircle,
  Info,
  XCircle 
} from 'lucide-react';

function MyComponent() {
  return (
    <div className="flex items-center gap-2">
      <Home className="h-4 w-4" />
      <User className="h-6 w-6 text-primary" />
      <Settings size={20} color="red" />
    </div>
  );
}
```

## TypeScript Tips

```typescript
// Type inference from Zod schema
const userSchema = z.object({ name: z.string(), age: z.number() });
type User = z.infer<typeof userSchema>; // { name: string; age: number }

// Type-safe route paths
type RoutePath = typeof ROUTES[keyof typeof ROUTES];

// Generic component props
interface Props<T> {
  data: T;
  onSelect: (item: T) => void;
}
```

## Commands

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## Helpful VS Code Extensions

1. **ESLint** - For linting
2. **Tailwind CSS IntelliSense** - Tailwind autocomplete
3. **TypeScript Vue Plugin (Volar)** - Better TS support
4. **Path Intellisense** - Autocomplete imports

## Common Patterns

### Loading State
```typescript
const { data, isLoading } = useQuery({ ... });
return isLoading ? <div>Loading...</div> : <div>{data}</div>;
```

### Conditional Rendering
```typescript
{isLoggedIn && <UserProfile />}
{isLoading ? <Spinner /> : <Content />}
```

### List Rendering
```typescript
{items.map(item => <Item key={item.id} {...item} />)}
```

---

**Need help?** Check the full documentation in `README.md` and `SETUP_INSTRUCTIONS.md`

