# Setup Instructions for Unet V2

## Quick Start

Follow these steps to get the project up and running:

### 1. Install Dependencies

```bash
npm install
```

This will install all the required packages including:
- React 19 and React DOM
- TypeScript 5.x
- Vite
- Tailwind CSS
- Shadcn UI components
- React Router DOM
- React Hook Form with Zod validation
- TanStack Query
- Axios
- Lucide React icons
- Sonner for notifications
- ESLint and all necessary plugins

### 2. Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

The optimized production build will be created in the `dist` folder.

### 4. Preview Production Build

```bash
npm run preview
```

### 5. Run Linter

```bash
npm run lint
```

## Project Structure

The project follows **Feature-Sliced Design (FSD)** architecture:

```
src/
├── app/                    # Application layer
│   ├── providers/         # React Router, Query Client, Error Boundary
│   ├── layouts/           # Root layout with navigation
│   └── styles/            # Global CSS styles
│
├── pages/                 # Pages layer (route pages)
│   ├── home/             # Home page with example form
│   ├── about/            # About page
│   └── not-found/        # 404 page
│
├── widgets/               # Widgets layer (complex UI blocks)
│   └── (add your widgets here)
│
├── features/              # Features layer (user interactions)
│   └── (add your features here)
│
├── entities/              # Entities layer (business entities)
│   └── (add your entities here)
│
├── shared/                # Shared layer (reusable code)
│   ├── ui/               # UI components (Button, Input, Card, Label)
│   ├── lib/              # Utilities (cn, form hook, etc.)
│   └── config/           # Configuration (axios, query-client)
│
└── @/                     # Additional shared resources
```

## Key Features Implemented

### ✅ Typed Form Hook

Located in `src/shared/lib/form.tsx`, this is a fully typed wrapper around `react-hook-form` with built-in Zod validation:

```typescript
import { useForm, FormField } from 'shared/lib/form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

function MyForm() {
  const form = useForm<FormValues>({
    schema,
    defaultValues: { email: '', password: '' }
  });

  return (
    <form onSubmit={form.handleSubmit((data) => console.log(data))}>
      <FormField form={form} name="email" label="Email" required />
      <FormField form={form} name="password" label="Password" type="password" required />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### ✅ Type-Safe Router

Located in `src/app/providers/router.tsx`, routes are defined with TypeScript constants:

```typescript
import { ROUTES, getRoute } from 'app/providers/router';
import { Link } from 'react-router-dom';

// Use route constants
<Link to={ROUTES.HOME}>Home</Link>

// Add new routes in router.tsx:
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  PROFILE: '/profile', // Add new route
} as const;
```

### ✅ Error Boundary

Located in `src/app/providers/error-boundary.tsx`, automatically catches and handles errors:

```typescript
import { ErrorBoundary } from 'app/providers/error-boundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### ✅ Pre-configured Axios Client

Located in `src/shared/config/axios.ts`, includes interceptors for auth and error handling:

```typescript
import { apiClient } from 'shared/config/axios';

const response = await apiClient.get('/users');
```

### ✅ TanStack Query Setup

Located in `src/shared/config/query-client.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { apiClient } from 'shared/config/axios';

function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.get('/users').then(res => res.data),
  });
}
```

### ✅ Shadcn UI Components

Pre-built components in `src/shared/ui/`:
- Button
- Input
- Label
- Card (with CardHeader, CardTitle, CardDescription, CardContent, CardFooter)

All components are styled with Tailwind CSS and support dark mode.

## Path Aliases

The following path aliases are configured:

- `app/*` → `src/app/*`
- `pages/*` → `src/pages/*`
- `widgets/*` → `src/widgets/*`
- `features/*` → `src/features/*`
- `entities/*` → `src/entities/*`
- `shared/*` → `src/shared/*`
- `@/*` → `src/@/*`
- `lib/*` → `src/lib/*`

Use them in imports:

```typescript
import { Button } from 'shared/ui';
import { useForm } from 'shared/lib/form';
import { ROUTES } from 'app/providers/router';
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Access in code:

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## ESLint Configuration

ESLint is configured with:
- React and React Hooks rules
- TypeScript strict mode
- React Refresh plugin
- Best practices for React 19

Run linting:
```bash
npm run lint
```

## Adding New Routes

1. Create a new page component in `src/pages/your-page/index.tsx`
2. Add the route constant to `src/app/providers/router.tsx`:
   ```typescript
   export const ROUTES = {
     // ...existing routes
     YOUR_PAGE: '/your-page',
   } as const;
   ```
3. Add the route to the routes array:
   ```typescript
   {
     path: ROUTES.YOUR_PAGE,
     element: <YourPage />,
   }
   ```

## Adding New Forms

1. Define your Zod schema:
   ```typescript
   const mySchema = z.object({
     field1: z.string().min(1),
     field2: z.number(),
   });
   ```
2. Use the typed form hook:
   ```typescript
   const form = useForm({ schema: mySchema });
   ```
3. Use FormField components or register fields manually

## Notifications

Use Sonner for toast notifications:

```typescript
import { toast } from 'sonner';

toast.success('Success!');
toast.error('Error!');
toast.info('Info');
toast.warning('Warning');
```

## Next Steps

1. ✅ All dependencies are listed in `package.json` - just run `npm install`
2. ✅ Full TypeScript support with strict mode
3. ✅ ESLint configured and ready
4. ✅ Example pages demonstrating all features
5. ✅ FSD architecture properly structured

Start building your features in the appropriate layers:
- **features/** - for user interactions (e.g., authentication, search)
- **entities/** - for business entities (e.g., User, Product models)
- **widgets/** - for complex UI blocks (e.g., UserProfile, ProductCard)
- **pages/** - for route-level pages

Happy coding! 🚀

