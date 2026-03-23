import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback, useRef, useEffect, useState } from 'react';

/**
 * Enum для типов форм в приложении
 */
export enum FormQuery {
  CREATE_TASK = 'create-task',
  CREATE_DOCUMENT = 'create-document',
  CREATE_RUP = 'create-rup',
  EDIT_COURSE = 'edit-course',
  CREATE_ELECTIVE = 'create-elective',
  CREATE_SEMESTER = 'create-semester',
  SETTINGS = 'settings',
  ADD_TASK_MEMBERS = 'add-task-members',
}

/**
 * Тип для дополнительных параметров формы
 */
export type FormParams = Record<string, string>;

 export type FormNavigationOptions = {
   syncUrl?: boolean;
 };

/**
 * Глобальное хранилище состояния форм (в памяти)
 * Используется для избежания перерендеров при изменении URL
 */
const formStateStore = new Map<FormQuery, { open: boolean; params: Record<string, string> }>();

/**
 * Подписчики на изменения состояния форм
 */
const formStateListeners = new Set<() => void>();

/**
 * Уведомить всех подписчиков об изменении состояния
 */
function notifyFormStateChange() {
  formStateListeners.forEach(listener => listener());
}

/**
 * Хук для получения параметров формы из in-memory store (без привязки к URL)
 */
export function useStoredFormParams(formType: FormQuery): Record<string, string> {
  const [params, setParams] = useState(() => formStateStore.get(formType)?.params ?? {});

  useEffect(() => {
    const listener = () => {
      const state = formStateStore.get(formType);
      setParams(state?.params ?? {});
    };

    formStateListeners.add(listener);
    return () => {
      formStateListeners.delete(listener);
    };
  }, [formType]);

  return params;
}

/**
 * Хук для получения конкретного параметра формы из in-memory store
 */
export function useStoredFormParam(formType: FormQuery, paramName: string): string | null {
  const params = useStoredFormParams(formType);
  return params[paramName] ?? null;
}

/**
 * Хук для навигации к формам через URL query параметры
 * Использует in-memory хранилище для избежания перерендеров
 * 
 * @example
 * const openForm = useFormNavigation();
 * 
 * // Открыть форму создания задачи
 * openForm(FormQuery.CREATE_TASK);
 * 
 * // Открыть форму с дополнительными параметрами
 * openForm(FormQuery.EDIT_COURSE, { courseId: '123' });
 */
export function useFormNavigation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stateRef = useRef(new Map(formStateStore));

  return useCallback(
    (
      formType: FormQuery,
      additionalParams?: Record<string, string>,
      options?: FormNavigationOptions
    ) => {
      const syncUrl = options?.syncUrl ?? true;
      // Обновляем in-memory хранилище
      stateRef.current.set(formType, {
        open: true,
        params: additionalParams || {},
      });
      formStateStore.set(formType, {
        open: true,
        params: additionalParams || {},
      });

      // Уведомляем подписчиков об изменении
      notifyFormStateChange();

      // Обновляем URL только для параметров, не для видимости формы
      if (!syncUrl) return;

      const params = new URLSearchParams(searchParams);
      if (additionalParams) {
        Object.entries(additionalParams).forEach(([key, value]) => {
          params.set(key, value);
        });
      }

      // Используем replace чтобы не засорять историю
      if (Object.keys(additionalParams || {}).length > 0) {
        navigate(`?${params.toString()}`, { replace: true });
      }
    },
    [navigate, searchParams]
  );
}

/**
 * Хук для закрытия формы (без изменения URL)
 * 
 * @example
 * const closeForm = useFormClose();
 * closeForm(); // Закрывает форму без изменения URL
 */
export function useFormClose() {
  const stateRef = useRef(new Map(formStateStore));

  return useCallback((formType?: FormQuery) => {
    if (formType) {
      stateRef.current.set(formType, { open: false, params: {} });
      formStateStore.set(formType, { open: false, params: {} });
      
      // Уведомляем подписчиков об изменении
      notifyFormStateChange();
    }
  }, []);
}

/**
 * Хук для получения текущего открытого типа формы
 * Использует in-memory хранилище для избежания перерендеров
 * 
 * @example
 * const currentForm = useCurrentForm();
 * if (currentForm === FormQuery.CREATE_TASK) {
 *   // Форма создания задачи открыта
 * }
 */
export function useCurrentForm(): FormQuery | null {
  const [currentForm, setCurrentForm] = useState<FormQuery | null>(() => {
    for (const [formType, state] of formStateStore.entries()) {
      if (state.open) {
        return formType;
      }
    }
    return null;
  });

  useEffect(() => {
    const listener = () => {
      for (const [formType, state] of formStateStore.entries()) {
        if (state.open) {
          setCurrentForm(formType);
          return;
        }
      }
      setCurrentForm(null);
    };

    formStateListeners.add(listener);
    return () => {
      formStateListeners.delete(listener);
    };
  }, []);

  return currentForm;
}

/**
 * Хук для проверки, открыта ли конкретная форма
 * Использует in-memory хранилище для избежания перерендеров
 * 
 * @example
 * const isTaskFormOpen = useIsFormOpen(FormQuery.CREATE_TASK);
 */
export function useIsFormOpen(formType: FormQuery): boolean {
  const [isOpen, setIsOpen] = useState(() => {
    const state = formStateStore.get(formType);
    return state?.open ?? false;
  });

  useEffect(() => {
    const listener = () => {
      const state = formStateStore.get(formType);
      setIsOpen(state?.open ?? false);
    };

    formStateListeners.add(listener);
    return () => {
      formStateListeners.delete(listener);
    };
  }, [formType]);

  return isOpen;
}
/**
 * Хук для получения параметров формы из URL
 * 
 * @example
 * const params = useFormParams();
 * const courseId = params.get('courseId');
 */
export function useFormParams() {
  const [searchParams] = useSearchParams();
  return searchParams;
}

/**
 * Хук для получения конкретного параметра формы
 * 
 * @example
 * const courseId = useFormParam('courseId');
 */
export function useFormParam(paramName: string): string | null {
  const [searchParams] = useSearchParams();
  return searchParams.get(paramName);
}
