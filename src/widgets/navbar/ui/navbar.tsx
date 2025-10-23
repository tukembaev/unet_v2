import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  GraduationCap, 
  Laptop, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  CheckSquare,
  BookOpen,
  Users,
  Clock,
  type LucideIcon
} from 'lucide-react';
import {
  Button,
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  ThemeToggle,
} from 'shared/ui';
import { ROUTES } from 'app/providers/routes';
import { cn } from 'shared/lib/utils';
import { UserMenu } from './user-menu';

interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon: LucideIcon;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigationSections: NavSection[] = [
  {
    title: 'Структура',
    items: [
      {
        title: 'Учебное управление',
        href: ROUTES.EDUCATION_MANAGEMENT,
        description: 'Управление учебным процессом',
        icon: GraduationCap,
      },
      {
        title: 'IT департамент',
        href: ROUTES.IT_DEPARTMENT,
        description: 'Информационные технологии',
        icon: Laptop,
      },
      {
        title: 'Отчеты KPI',
        href: ROUTES.KPI_REPORTS,
        description: 'Ключевые показатели эффективности',
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'Документооборот',
    items: [
      {
        title: 'Обращения',
        href: ROUTES.APPLICATIONS,
        description: 'Входящие обращения',
        icon: MessageSquare,
      },
      {
        title: 'Приказы',
        href: ROUTES.ORDERS,
        description: 'Приказы и распоряжения',
        icon: FileText,
      },
      {
        title: 'Задачи',
        href: ROUTES.TASK,
        description: 'Управление задачами',
        icon: CheckSquare,
      },
    ],
  },
  {
    title: 'Учебный процесс',
    items: [
      {
        title: 'РУП',
        href: ROUTES.CURRICULUM,
        description: 'Рабочие учебные планы',
        icon: BookOpen,
      },
      {
        title: 'Потоки',
        href: ROUTES.STREAMS,
        description: 'Учебные потоки',
        icon: Users,
      },
      {
        title: 'Нагрузка',
        href: ROUTES.WORKLOAD,
        description: 'Учебная нагрузка',
        icon: Clock,
      },
    ],
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActiveRoute = (href: string) => {
    if (href === ROUTES.HOME) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/20">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-6">
            <Link 
              to={ROUTES.HOME} 
              className="flex items-center space-x-2 transition-colors hover:text-primary"
            >
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">Unet V2</span>
            </Link>

            {/* Desktop Navigation Menu */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {navigationSections.map((section) => (
                  <NavigationMenuItem key={section.title}>
                    <NavigationMenuTrigger className="h-9">
                      {section.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 rounded-[20px] bg-popover shadow-lg border">
                        {section.items.map((item) => (
                          <ListItem
                            key={item.href}
                            title={item.title}
                            href={item.href}
                            icon={item.icon}
                          >
                            {item.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right: Theme Toggle, User Menu & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu />

            {/* Mobile Navigation Toggle */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Открыть меню">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Навигация</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-6">
                  {navigationSections.map((section) => (
                    <div key={section.title} className="space-y-3">
                      <h3 className="font-semibold text-sm text-muted-foreground px-2">
                        {section.title}
                      </h3>
                      <div className="flex flex-col gap-1">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                'flex items-start gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent',
                                isActiveRoute(item.href) && 'bg-accent'
                              )}
                            >
                              <Icon className="h-5 w-5 mt-0.5 shrink-0" />
                              <div className="flex flex-col gap-1">
                                <span className="font-medium">{item.title}</span>
                                {item.description && (
                                  <span className="text-xs text-muted-foreground">
                                    {item.description}
                                  </span>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

function ListItem({
  title,
  children,
  href,
  icon: Icon,
}: {
  title: string;
  children?: React.ReactNode;
  href: string;
  icon: LucideIcon;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          className="flex items-center items-start gap-3 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <Icon className="h-6 w-6 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <div className="text-sm font-medium leading-none">{title}</div>
            {children && (
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {children}
              </p>
            )}
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

