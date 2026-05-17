import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { usePermissions } from "entities/user";
import { ROUTES } from "app/providers/routes";
import {
  getFirstAccessibleEducationTab,
  getVisibleEducationTabIds,
  type EducationTabId,
} from "./education-tab-permissions";

export const EDUCATION_TAB_SEARCH_PARAM = "tab";

function parseTabFromUrl(
  raw: string | null,
  visible: EducationTabId[]
): EducationTabId | undefined {
  if (!raw) return undefined;
  return visible.includes(raw as EducationTabId)
    ? (raw as EducationTabId)
    : undefined;
}

export function getEducationManagementPath(tab?: EducationTabId): string {
  if (!tab) return ROUTES.EDUCATION_MANAGEMENT;
  return `${ROUTES.EDUCATION_MANAGEMENT}?${EDUCATION_TAB_SEARCH_PARAM}=${tab}`;
}

export function useEducationManagementTab(prefer?: EducationTabId) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { permissions } = usePermissions();

  const visible = useMemo(
    () => getVisibleEducationTabIds(permissions),
    [permissions]
  );

  const fallbackTab = useMemo(
    () => getFirstAccessibleEducationTab(permissions, prefer),
    [permissions, prefer]
  );

  const activeTab = useMemo(() => {
    const fromUrl = parseTabFromUrl(
      searchParams.get(EDUCATION_TAB_SEARCH_PARAM),
      visible
    );
    return fromUrl ?? fallbackTab;
  }, [searchParams, visible, fallbackTab]);

  const setActiveTab = useCallback(
    (tab: string) => {
      const id = tab as EducationTabId;
      if (!visible.includes(id)) return;
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set(EDUCATION_TAB_SEARCH_PARAM, id);
          return next;
        },
        { replace: true }
      );
    },
    [visible, setSearchParams]
  );

  return { activeTab, setActiveTab, visible, fallbackTab };
}
