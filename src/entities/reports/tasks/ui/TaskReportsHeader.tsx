import type { DateRange, DateRangePreset } from '../model';
import { DateRangePicker } from './DateRangePicker';

interface TaskReportsHeaderProps {
  preset: DateRangePreset;
  onPresetChange: (preset: DateRangePreset) => void;
  onCustomRangeChange: (range: DateRange) => void;

}

export function TaskReportsHeader({
  preset,
  onPresetChange,
  onCustomRangeChange,

}: TaskReportsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Отчеты по задачам</h1>
        <p className="text-sm text-muted-foreground">
          Аналитика и статистика выполнения задач
        </p>
      </div>

      <div className="flex items-center gap-2">
        <DateRangePicker
          preset={preset}
          onPresetChange={onPresetChange}
          onCustomRangeChange={onCustomRangeChange}
        />
        
     
      </div>
    </div>
  );
}
