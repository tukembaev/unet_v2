import { LayoutGrid } from 'lucide-react';
import { useMemo, useState } from 'react';
import { usePermissions } from 'entities/user';
import { getActiveContext } from 'shared/lib/auth-context';
import { cn } from 'shared/lib/utils';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'shared/ui';
import { filterLauncherApps } from '../config/apps-launcher';

export function AppsLauncher() {
  const [open, setOpen] = useState(false);
  const { permissions, isLoading } = usePermissions();
  const context = getActiveContext();

  const apps = useMemo(
    () => filterLauncherApps(context, permissions),
    [context, permissions]
  );

  if (isLoading || apps.length === 0) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Приложения"
          title="Приложения"
        >
          <LayoutGrid className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className={cn(
          'w-[min(100vw-1.5rem,320px)] rounded-3xl border border-border/70 p-3 shadow-xl',
          'bg-popover/95 backdrop-blur-xl'
        )}
      >
        <div className="mb-2 px-2 pt-1">
          <p className="text-sm font-semibold tracking-tight">Приложения</p>
          <p className="text-xs text-muted-foreground">
            Внешние сервисы университета
          </p>
        </div>

        <div className="thin-scrollbar max-h-[min(70vh,420px)] overflow-y-auto px-1 pb-1">
          <div className="grid grid-cols-3 gap-1">
            {apps.map((app) => {
              const Icon = app.icon;
              return (
                <a
                  key={app.id}
                  href={app.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={app.description}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'group flex flex-col items-center gap-2 rounded-2xl px-2 py-3 text-center',
                    'transition-colors hover:bg-accent/80 focus-visible:outline-none',
                    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm',
                      'ring-1 ring-black/5 transition-transform group-hover:scale-[1.04]',
                      app.tone
                    )}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <span className="line-clamp-2 text-[12px] font-medium leading-tight text-foreground">
                    {app.title}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
