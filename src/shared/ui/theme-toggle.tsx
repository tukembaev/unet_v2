import { Palette } from 'lucide-react';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { useTheme } from 'app/providers/theme-provider';

const themes = [
  { 
    value: 'standard', 
    label: 'Standard', 
    description: 'Классическая светлая тема',
    colors: ['#010711ff', '#b9babbff', '#dbeafe']
  },
  { 
    value: 'lastchat', 
    label: 'LastChat', 
    description: 'Теплая бежевая тема',
    colors: ['#d4a574', '#8b6f47', '#f5e6d3']
  },
  { 
    value: 'claude', 
    label: 'Claude', 
    description: 'Современная оранжевая тема',
    colors: ['#ff8c42', '#e65100', '#ffe0b2']
  },
  { 
    value: 'purple-rain', 
    label: 'Purple Rain', 
    description: 'Фиолетовая тема',
    colors: ['#a855f7', '#6d28d9', '#e9d5ff']
  },
  { 
    value: 'supabase', 
    label: 'SupaBase', 
    description: 'Зеленая тема',
    colors: ['#10b981', '#047857', '#d1fae5']
  },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Выбрать тему</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value as any)}
            className={`flex items-center justify-between cursor-pointer py-3 ${
              theme === themeOption.value ? 'bg-accent' : ''
            }`}
          >
            <div className="flex flex-col flex-1">
              <span className="font-medium">{themeOption.label}</span>
              <span className="text-xs text-muted-foreground">
                {themeOption.description}
              </span>
            </div>
            <div className="flex gap-1">
              {themeOption.colors.map((color, idx) => (
                <div
                  key={idx}
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

