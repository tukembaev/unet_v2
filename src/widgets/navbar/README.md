# Navbar Widget

Modern responsive navbar with dropdown navigation menu and user profile.

## Features

- **NavigationMenu Component**: Professional dropdown menus from shadcn/ui
- **Organized Structure**: Navigation grouped by sections (Структура, Документооборот, Учебный процесс)
- **User Menu**: Dropdown menu with user avatar and profile options (right side)
- **Active Route Highlighting**: Automatically highlights the current active route
- **Sticky Header**: Stays at the top of the page when scrolling
- **Backdrop Blur**: Modern glass-morphism effect
- **Mobile Optimized**: Grouped navigation in slide-out menu with sections

## Layout

### Desktop (≥ 768px)
- **Left**: Logo + NavigationMenu with dropdown sections
- **Right**: User menu

### Mobile (< 768px)
- **Left**: Logo
- **Right**: User menu + Hamburger menu toggle
- **Mobile Menu**: Organized sections with descriptions

## Navigation Structure

Current sections:
1. **Структура**
   - Учебное управление
   - IT департамент
   - Отчеты KPI

2. **Документооборот**
   - Обращения
   - Приказы
   - Задачи

3. **Учебный процесс**
   - РУП (Рабочие учебные планы)
   - Потоки
   - Нагрузка

## Usage

The navbar is already integrated into `RootLayout` and will automatically display on all pages.

## Adding New Navigation Items

To add new navigation items, follow these steps:

### 1. Add Route Constants (`src/app/providers/routes.ts`)
```typescript
export const ROUTES = {
  // ... existing routes
  NEW_ITEM: '/section/new-item', // New route
} as const;
```

### 2. Add Route Configuration (`src/app/providers/router.tsx`)
```typescript
const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // ... existing routes
      {
        path: ROUTES.NEW_ITEM,
        element: <NewItemPage />,
      },
    ],
  },
];
```

### 3. Update Navigation Structure (`src/widgets/navbar/ui/navbar.tsx`)

To add a new item to an existing section:
```typescript
import { Settings } from 'lucide-react'; // Import icon

const navigationSections: NavSection[] = [
  {
    title: 'Структура',
    items: [
      // ... existing items
      {
        title: 'Новый элемент',
        href: ROUTES.NEW_ITEM,
        description: 'Описание нового элемента',
        icon: Settings, // Add icon
      },
    ],
  },
  // ... other sections
];
```

To add a completely new section:
```typescript
import { Folder, File } from 'lucide-react'; // Import icons

const navigationSections: NavSection[] = [
  // ... existing sections
  {
    title: 'Новая секция',
    items: [
      {
        title: 'Элемент 1',
        href: ROUTES.ITEM_1,
        description: 'Описание элемента 1',
        icon: Folder,
      },
      {
        title: 'Элемент 2',
        href: ROUTES.ITEM_2,
        description: 'Описание элемента 2',
        icon: File,
      },
    ],
  },
];
```

### Available Icons

Icons are imported from `lucide-react`. Current icons used:
- **GraduationCap** - Учебное управление
- **Laptop** - IT департамент
- **BarChart3** - Отчеты KPI
- **MessageSquare** - Обращения
- **FileText** - Приказы
- **CheckSquare** - Задачи
- **BookOpen** - РУП
- **Users** - Потоки
- **Clock** - Нагрузка

Browse more icons at: [lucide.dev](https://lucide.dev)

## User Menu

The user menu component (`user-menu.tsx`) displays:
- User avatar with fallback initials
- User name (hidden on mobile, visible on desktop)
- Dropdown with profile options:
  - Профиль (Profile)
  - Настройки (Settings)
  - Помощь (Help)
  - Выйти (Logout)

### Customizing User Data

Currently uses mock data. To integrate real user data, replace the mock user object in `user-menu.tsx`:

```typescript
const user = {
  name: 'Пользователь',
  email: 'user@example.com',
  avatar: '', // URL to user's avatar image
};
```

You can also integrate this with your authentication context or user store.

## Mobile Navigation

On mobile devices (< 768px), navigation is accessible via a hamburger menu that opens a slide-in sheet from the right side. This approach works well even with many navigation links, as they're displayed in a scrollable list.

The user menu remains visible on mobile devices and displays only the avatar.

## Customization

### Changing Mobile Menu Side

To change the slide-in direction, modify the `side` prop in `navbar.tsx`:
```typescript
<SheetContent side="left"> // or "right", "top", "bottom"
```

### Styling

The navbar uses Tailwind CSS classes and follows the shadcn/ui design system. You can customize:
- Colors: Modify the button variants
- Spacing: Adjust container padding and gap values
- Heights: Change the `h-16` class in the header

### Active Route Logic

The `isActiveRoute` function determines which links are highlighted. By default:
- Home route matches exactly
- Other routes match by prefix (useful for nested routes)

