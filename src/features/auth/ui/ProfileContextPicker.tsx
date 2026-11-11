import { Briefcase, ChevronRight, GraduationCap, Loader2, Users } from "lucide-react";
import { useEffect, useState } from "react";

import type { AvailableContext } from "../model/types/auth-context";
import type { ProfileContext } from "shared/lib/auth-context";
import { getHttpErrorMessage } from "shared/lib/http-error";
import { cn } from "shared/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "shared/ui";
import { toast } from "sonner";

import { fetchAvailableContexts, selectAuthContext } from "../model/api";

const CONTEXT_META: Record<
  ProfileContext,
  {
    title: string;
    subtitle: string;
    icon: typeof Briefcase;
    iconClass: string;
    cardClass: string;
  }
> = {
  employee: {
    title: "Сотрудник",
    subtitle: "Рабочие сервисы университета",
    icon: Briefcase,
    iconClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    cardClass: "hover:border-violet-500/30 hover:bg-violet-500/[0.04]",
  },
  student: {
    title: "Студент",
    subtitle: "Учёба, расписание и кампус",
    icon: GraduationCap,
    iconClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    cardClass: "hover:border-sky-500/30 hover:bg-sky-500/[0.04]",
  },
};

type ProfileContextPickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contexts?: AvailableContext[];
  onComplete: () => void | Promise<void>;
};

export function ProfileContextPicker({
  open,
  onOpenChange,
  contexts: initialContexts,
  onComplete,
}: ProfileContextPickerProps) {
  const [contexts, setContexts] = useState<AvailableContext[]>(
    initialContexts ?? []
  );
  const [loadingContexts, setLoadingContexts] = useState(
    open && !initialContexts?.length
  );
  const [submitting, setSubmitting] = useState<ProfileContext | null>(null);

  useEffect(() => {
    if (!open) return;
    if (initialContexts?.length) {
      setContexts(initialContexts);
      setLoadingContexts(false);
      return;
    }

    let cancelled = false;
    setLoadingContexts(true);
    void (async () => {
      try {
        const items = await fetchAvailableContexts();
        if (!cancelled) setContexts(items);
      } catch (e) {
        if (!cancelled) {
          toast.error("Не удалось загрузить профили", {
            description: getHttpErrorMessage(e),
          });
        }
      } finally {
        if (!cancelled) setLoadingContexts(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, initialContexts]);

  const handleSelect = async (context: ProfileContext) => {
    try {
      setSubmitting(context);
      await selectAuthContext(context);
      await onComplete();
      onOpenChange(false);
    } catch (e) {
      toast.error("Не удалось выбрать профиль", {
        description: getHttpErrorMessage(e),
      });
    } finally {
      setSubmitting(null);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next && submitting) return;
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden border-border/70 p-0 sm:max-w-md">
        <div className="border-b border-border/60 bg-gradient-to-b from-muted/50 to-background px-6 pb-5 pt-6">
          <DialogHeader className="space-y-2 text-left">
            <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Users className="h-5 w-5" aria-hidden />
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight">
              Выберите профиль
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              У вас несколько ролей в системе. Выберите, под какой ролью
              продолжить работу.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4 px-6 py-5">
          {loadingContexts ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
              <Loader2
                className="h-7 w-7 animate-spin text-muted-foreground"
                aria-hidden
              />
              <p className="text-sm text-muted-foreground">Загрузка профилей…</p>
            </div>
          ) : !contexts.length ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Нет доступных профилей для входа
            </p>
          ) : (
            <div className="grid gap-2.5">
              {contexts.map((item) => {
                const meta = CONTEXT_META[item.type];
                const Icon = meta.icon;
                const detail =
                  item.type === "student" ? item.group_name : item.position;
                const isPending = submitting === item.type;
                const isDisabled = Boolean(submitting);

                return (
                  <button
                    key={item.type}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => void handleSelect(item.type)}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl border border-border/70 bg-card p-3.5 text-left shadow-sm transition-all",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      meta.cardClass,
                      isDisabled && !isPending && "opacity-60",
                      isPending && "border-primary/30 ring-1 ring-primary/15"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                        meta.iconClass
                      )}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-foreground">
                        {meta.title}
                      </span>
                      <span className="block truncate text-sm text-muted-foreground">
                        {item.full_name || meta.subtitle}
                      </span>
                      {detail ? (
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground/80">
                          {detail}
                        </span>
                      ) : null}
                    </span>
                    {isPending ? (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            Роль можно сменить позже без повторного входа
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
