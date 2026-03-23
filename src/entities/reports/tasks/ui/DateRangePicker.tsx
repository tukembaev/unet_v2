import { Calendar, CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Calendar as CalendarComponent,
  Label,
} from 'shared/ui';
import { cn } from 'shared/lib/utils';
import { formatDateToRFC3339 } from '../model/utils/dateFormatter';
import type { DateRangePreset, DateRange } from '../model';

interface DateRangePickerProps {
  preset: DateRangePreset;
  onPresetChange: (preset: DateRangePreset) => void;
  onCustomRangeChange: (range: DateRange) => void;
}

const presetLabels: Record<DateRangePreset, string> = {
  today: 'Сегодня',
  week: 'Неделя',
  month: 'Месяц',
  quarter: 'Квартал',
  year: 'Год',
  custom: 'Произвольный',
};

export function DateRangePicker({
  preset,
  onPresetChange,
  onCustomRangeChange,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);

  const handleApplyCustomRange = () => {
    if (startDate && endDate) {
      onCustomRangeChange({
        start_date: formatDateToRFC3339(startDate, false),
        end_date: formatDateToRFC3339(endDate, true),
      });
      onPresetChange('custom');
      setIsOpen(false);
    }
  };

  const getPresetRange = (presetType: DateRangePreset) => {
    const now = new Date();
    let start: Date;

    switch (presetType) {
      case 'today':
        start = new Date(now);
        break;
      case 'week':
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start = new Date(now);
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start = new Date(now);
        start.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        start = new Date(now);
        start.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return null;
    }

    return { start, end: now };
  };

  const handlePresetWithRange = (presetType: DateRangePreset) => {
    const range = getPresetRange(presetType);
    if (range) {
      onCustomRangeChange({
        start_date: formatDateToRFC3339(range.start, false),
        end_date: formatDateToRFC3339(range.end, true),
      });
      onPresetChange(presetType);
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-start">
          <Calendar className="mr-2 h-4 w-4" />
          {presetLabels[preset]}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={preset === 'today' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePresetWithRange('today')}
            >
              Сегодня
            </Button>
            <Button
              variant={preset === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePresetWithRange('week')}
            >
              Неделя
            </Button>
            <Button
              variant={preset === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePresetWithRange('month')}
            >
              Месяц
            </Button>
            <Button
              variant={preset === 'quarter' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePresetWithRange('quarter')}
            >
              Квартал
            </Button>
            <Button
              variant={preset === 'year' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePresetWithRange('year')}
              className="col-span-2"
            >
              Год
            </Button>
          </div>

          <div className="border-t pt-4">
            <Label className="text-sm font-medium">Произвольный период</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  От
                </Label>
                <Popover open={startDatePickerOpen} onOpenChange={setStartDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal truncate",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {startDate ? format(startDate, "dd.MM.yyyy", { locale: ru }) : "Дата"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        setStartDatePickerOpen(false);
                      }}
                      disabled={(date) => {
                        if (date > new Date()) return true;
                        if (endDate && date > endDate) return true;
                        return false;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  До
                </Label>
                <Popover open={endDatePickerOpen} onOpenChange={setEndDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal truncate",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {endDate ? format(endDate, "dd.MM.yyyy", { locale: ru }) : "Дата"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date);
                        setEndDatePickerOpen(false);
                      }}
                      disabled={(date) => {
                        if (date > new Date()) return true;
                        if (startDate && date < startDate) return true;
                        return false;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Button
              onClick={handleApplyCustomRange}
              disabled={!startDate || !endDate}
              className="w-full mt-3"
              size="sm"
            >
              Применить
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
