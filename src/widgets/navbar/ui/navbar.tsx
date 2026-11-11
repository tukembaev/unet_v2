import { ROUTES } from 'app/providers/routes';
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Menu,
  MessageSquare,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePermissions } from 'entities/user';
import { getActiveContext, getAppHomePath } from 'shared/lib/auth-context';
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
  filterNavigationForContext,
} from '../config/navigation';
import type { NavItemConfig } from '../config/navigation';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { permissions, isLoading } = usePermissions();
  const context = getActiveContext();
  const homePath = getAppHomePath(context);

  const navigationSections = useMemo(
    () =>
      isLoading && context !== 'student'
        ? NAVIGATION_SECTIONS
        : filterNavigationForContext(context, permissions),
    [isLoading, permissions, context]
  );

  const isActiveRoute = (href: string) => {
    if (href === homePath || href === ROUTES.HOME || href === ROUTES.SCHEDULE) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const getSectionMeta = (title: string) => {
    if (title === 'Учёба') {
      return {
        BgIcon: CalendarDays,
        iconColor: 'text-sky-500',
        description: 'Расписание занятий и учебные сервисы студента',
      };
    }
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
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex h-12 items-center justify-between gap-3 sm:h-14 sm:gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to={homePath}
              className="flex items-center transition-opacity hover:opacity-90"
            >
              <AppLogo size="md" />
            </Link>

            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {navigationSections.map((section) => (
                  <NavigationMenuItem key={section.title}>
                    <NavigationMenuTrigger className="h-9 border-none bg-transparent">
                      {section.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div
                        className={cn(
                          'grid gap-4 border p-4 shadow-lg',
                          context === 'student'
                            ? 'w-[min(100vw-2rem,360px)] grid-cols-1'
                            : 'w-[700px] grid-cols-[280px_1fr]'
                        )}
                      >
                        {context !== 'student' && (
                          <SectionCard sectionTitle={section.title} />
                        )}
                        <ul className="grid gap-3">
                          {section.items.map((item) => (
                            <ListItem
                              key={`${item.href}-${item.title}`}
                              item={item}
                            />
                          ))}
                        </ul>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <NotificationBell />
            <UserMenu />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Открыть меню">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[min(100vw-2rem,300px)] overflow-y-auto sm:w-[350px]"
              >
                <SheetHeader>
                  <SheetTitle>Навигация</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-6">
                  {navigationSections.map((section) => (
                    <div key={section.title} className="space-y-3">
                      <h3 className="px-2 text-sm font-semibold text-muted-foreground">
                        {section.title}
                      </h3>
                      <div className="flex flex-col gap-1">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const linkClassName = cn(
                            'flex items-start gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent',
                            !item.external &&
                              isActiveRoute(item.href) &&
                              'bg-accent'
                          );

                          const content = (
                            <>
                              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                              <div className="flex flex-col gap-1">
                                <span className="font-medium">{item.title}</span>
                                {item.description && (
                                  <span className="text-xs text-muted-foreground">
                                    {item.description}
                                  </span>
                                )}
                              </div>
                            </>
                          );

                          return item.external ? (
                            <a
                              key={`${item.href}-${item.title}`}
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsOpen(false)}
                              className={linkClassName}
                            >
                              {content}
                            </a>
                          ) : (
                            <Link
                              key={`${item.href}-${item.title}`}
                              to={item.href}
                              onClick={() => setIsOpen(false)}
                              className={linkClassName}
                            >
                              {content}
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

  function sectionIconFallback(props: {
    className?: string;
    strokeWidth?: number;
  }) {
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
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    );
  }
}

function ListItem({ item }: { item: NavItemConfig }) {
  const Icon = item.icon;
  const className =
    'flex items-center items-start gap-3 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground';

  const content = (
    <>
      <Icon className="mt-0.5 h-6 w-6 shrink-0" />
      <div className="space-y-1">
        <div className="text-sm font-medium leading-none">{item.title}</div>
        {item.description && (
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </>
  );

  if (item.external) {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
          >
            {content}
          </a>
        </NavigationMenuLink>
      </li>
    );
  }

  return (
    <li>
      <NavigationMenuLink asChild>
        <Link to={item.href} className={className}>
          {content}
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
