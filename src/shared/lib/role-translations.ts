import { Crown, Eye, Gavel, LucideIcon, Users } from 'lucide-react';

export const roleTranslations: Record<string, string> = {
  'RESPONSIBLE': 'Ответственный',
  'CO_EXECUTOR': 'Соисполнитель',
  'OBSERVER': 'Наблюдатель',
  'CREATOR': 'Создатель',
  'EXECUTOR': 'Соисполнитель',
};

export const roleIcons: Record<string, LucideIcon> = {
  'RESPONSIBLE': Gavel,
  'CO_EXECUTOR': Users,
  'OBSERVER': Eye,
  'CREATOR': Crown,
  'EXECUTOR': Users,
};

export const roleColors: Record<string, { bg: string; text: string; border: string }> = {
  'RESPONSIBLE': {
    bg: 'bg-blue-50 dark:bg-blue-950',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
  },
  'CO_EXECUTOR': {
    bg: 'bg-green-50 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
  },
  'OBSERVER': {
    bg: 'bg-amber-50 dark:bg-amber-950',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
  },
  'CREATOR': {
    bg: 'bg-purple-50 dark:bg-purple-950',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
  },
  'EXECUTOR': {
    bg: 'bg-green-50 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
  },
};

export const translateRole = (role: string): string => {
  return roleTranslations[role] || role;
};

export const getRoleIcon = (role: string): LucideIcon | null => {
  return roleIcons[role] || null;
};

export const getRoleColors = (role: string) => {
  return roleColors[role] || {
    bg: 'bg-gray-50 dark:bg-gray-950',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-800',
  };
};
