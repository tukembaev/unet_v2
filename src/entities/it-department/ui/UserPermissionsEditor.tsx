import { useEffect, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import {
  normalizePermissionSlugs,
  sortPermissionOptions,
} from "../lib/parse-employee-permissions";
import {
  usePermissionSelectOptions,
  useUpdateUserPermissions,
} from "../model/queries";
import type { ID } from "../model/types";
import { getHttpErrorMessage } from "shared/lib/http-error";
import { Button, Checkbox, Input, Label, Skeleton } from "shared/ui";
import { cn } from "shared/lib/utils";

type UserPermissionsEditorProps = {
  userId: ID;
  /** Активные права из GET /employees/{id} (slug или название) */
  activePermissionSlugs: string[];
  isLoadingPermissions?: boolean;
  enabled?: boolean;
};

type PermissionOption = { slug: string; label: string };

const GROUP_ORDER = [
  "Учебный процесс",
  "Учебное управление",
  "Приемная комиссия",
  "IT департамент",
  "KPI",
  "Прочее",
] as const;

function isAdminPermission(opt: PermissionOption): boolean {
  const slug = opt.slug.toLowerCase();
  const label = opt.label.toLowerCase();
  return slug.includes("admin") || label.includes("админ");
}

function getPermissionGroup(opt: PermissionOption): (typeof GROUP_ORDER)[number] {
  if (
    opt.slug === "work_plan" ||
    opt.slug === "streams" ||
    opt.slug === "discipline_department"
  ) {
    return "Учебный процесс";
  }

  if (opt.slug.startsWith("education_department:")) {
    return "Учебное управление";
  }

  if (opt.slug.startsWith("abiturient:")) {
    return "Приемная комиссия";
  }

  if (opt.slug.startsWith("it:")) {
    return "IT департамент";
  }

  if (opt.slug.startsWith("kpi:")) {
    return "KPI";
  }

  return "Прочее";
}

export function UserPermissionsEditor({
  userId,
  activePermissionSlugs,
  isLoadingPermissions = false,
  enabled = true,
}: UserPermissionsEditorProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);

  const { data: options = [], isLoading: isOptionsLoading } =
    usePermissionSelectOptions(enabled);
  const updatePermissions = useUpdateUserPermissions(userId);

  const catalogOptions = useMemo(
    () => sortPermissionOptions(options).filter((opt) => !isAdminPermission(opt)),
    [options]
  );

  const normalizedActive = useMemo(
    () => normalizePermissionSlugs(activePermissionSlugs, catalogOptions),
    [activePermissionSlugs, catalogOptions]
  );

  const normalizedActiveKey = normalizedActive.join("|");

  useEffect(() => {
    if (isOptionsLoading || isLoadingPermissions) return;
    setSelected(normalizedActive);
    setDirty(false);
  }, [normalizedActiveKey, isOptionsLoading, isLoadingPermissions, normalizedActive]);

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return catalogOptions;
    return catalogOptions.filter(
      (opt) =>
        opt.slug.toLowerCase().includes(q) ||
        opt.label.toLowerCase().includes(q)
    );
  }, [catalogOptions, search]);

  const groupedOptions = useMemo(() => {
    const buckets = new Map<string, PermissionOption[]>();

    for (const opt of filteredOptions) {
      const group = getPermissionGroup(opt);
      const current = buckets.get(group) ?? [];
      current.push(opt);
      buckets.set(group, current);
    }

    return GROUP_ORDER.map((group) => ({
      group,
      options: buckets.get(group) ?? [],
    })).filter((entry) => entry.options.length > 0);
  }, [filteredOptions]);

  const togglePermission = (slug: string, checked: boolean) => {
    setSelected((prev) => {
      const next = checked
        ? [...new Set([...prev, slug])]
        : prev.filter((item) => item !== slug);
      setDirty(true);
      return next;
    });
  };

  const handleSave = async () => {
    try {
      await updatePermissions.mutateAsync({
        previous: normalizedActive,
        next: selected,
      });
      toast.success("Доступы обновлены");
      setDirty(false);
    } catch (e) {
      toast.error("Не удалось сохранить доступы", {
        description: getHttpErrorMessage(e),
      });
    }
  };

  const isLoading = isOptionsLoading || isLoadingPermissions;

  return (
    <div className="space-y-3 rounded-lg border border-border/70 bg-muted/15 p-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
        <p className="text-sm font-semibold">Доступы в системе</p>
      </div>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск по правам..."
        className="h-9"
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      ) : groupedOptions.length === 0 ? (
        <p className="text-sm text-muted-foreground">Нет доступных прав</p>
      ) : (
        <div className="max-h-56 space-y-1 overflow-y-auto rounded-md border border-border/60 bg-background p-2">
          {groupedOptions.map(({ group, options }) => (
            <div key={group} className="space-y-1.5">
              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group}
              </p>
              {options.map((opt) => {
                const checked = selected.includes(opt.slug);
                return (
                  <label
                    key={opt.slug}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/40",
                      checked && "bg-primary/5 ring-1 ring-primary/15"
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) =>
                        togglePermission(opt.slug, value === true)
                      }
                      className="shrink-0"
                    />
                    <span className="min-w-0 flex-1">
                      <Label className="cursor-pointer font-medium leading-tight">
                        {opt.label}
                      </Label>
                      <span className="block text-xs text-muted-foreground">
                        {opt.slug}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground tabular-nums">
          Выбрано: {selected.length}
        </span>
        <Button
          type="button"
          size="sm"
          disabled={!dirty || updatePermissions.isPending || isLoading}
          onClick={() => void handleSave()}
        >
          {updatePermissions.isPending ? "Сохранение..." : "Сохранить доступы"}
        </Button>
      </div>
    </div>
  );
}
