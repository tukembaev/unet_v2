import { ROUTES } from 'app/providers/routes';
import {
  BarChart3,
  BookOpen,
  GraduationCap,
  Menu,
  MessageSquare,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePermissions } from 'entities/user';
import { cn } from 'shared/lib/utils';
import {
  AppLogo,
  Button,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from 'shared/ui';
import { NotificationBell } from './NotificationBell';
import { UserMenu } from './user-menu';
import {
  NAVIGATION_SECTIONS,
  filterNavigationForPermissions,
} from '../config/navigation';
import type { NavItemConfig } from '../config/navigation';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { permissions, isLoading } = usePermissions();

  const navigationSections = useMemo(
    () =>
      isLoading
        ? NAVIGATION_SECTIONS
        : filterNavigationForPermissions(permissions),
    [isLoading, permissions]
  );

  const isActiveRoute = (href: string) => {
    if (href === ROUTES.HOME) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const getSectionMeta = (title: string) => {
    if (title === 'Структура') {
      return {
        BgIcon: GraduationCap,
        iconColor: 'text-blue-500',
        description:
          'Управление структурными подразделениями и ключевыми показателями университета',
      };
    }
    if (title === 'Документооборот') {
      return {
        BgIcon: MessageSquare,
        iconColor: 'text-green-500',
        description:
          'Работа с документами, заявками и задачами в едином пространстве',
      };
    }
    if (title === 'Учебный процесс') {
      return {
        BgIcon: BookOpen,
        iconColor: 'text-purple-500',
        description:
          'Планирование и организация учебного процесса, управление нагрузкой',
      };
    }
    if (title === 'Отчетность') {
      return {
        BgIcon: BarChart3,
        iconColor: 'text-orange-500',
        description:
          'Формирование и анализ отчетов по всем направлениям деятельности',
      };
    }

    return {
      BgIcon: sectionIconFallback,
      iconColor: 'text-primary',
      description: 'Раздел навигации по рабочим инструментам системы',
    };
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-6">
            <Link
              to={ROUTES.HOME}
              className="flex items-center transition-opacity hover:opacity-90"
            >
              <AppLogo size="md" />
            </Link>

            {/* Desktop Navigation Menu */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {navigationSections.map((section) => (
                  <NavigationMenuItem key={section.title}>
                    <NavigationMenuTrigger className="h-9 border-none bg-transparent">
                      {section.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[700px] grid-cols-[280px_1fr] gap-4 border p-4 shadow-lg">
                        <SectionCard sectionTitle={section.title} />
                        <ul className="grid gap-3">
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
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right: Notifications & User Menu */}
          <div className="flex items-center gap-2">
            <NotificationBell />
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

  function sectionIconFallback(props: { className?: string; strokeWidth?: number }) {
    return <BookOpen {...props} />;
  }

  function SectionCard({ sectionTitle }: { sectionTitle: string }) {
    const { BgIcon, iconColor, description } = getSectionMeta(sectionTitle);

    return (
      <div className="relative flex min-h-[240px] flex-col overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-6">
        <div className="absolute right-0 top-0 h-32 w-32 opacity-20">
          <BgIcon className={cn('h-full w-full', iconColor)} strokeWidth={0.5} />
        </div>
        <div className="relative z-10 mt-auto space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 backdrop-blur-sm">
            <BgIcon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">{sectionTitle}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
    );
  }
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
  icon: NavItemConfig['icon'];
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

