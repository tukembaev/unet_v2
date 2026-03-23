import { useState, useMemo } from 'react';
import { formatDateToRFC3339 } from '../utils/dateFormatter';

export type DateRangePreset = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export interface DateRange {
  start_date: string;
  end_date: string;
}

export const useDateRange = (initialPreset: DateRangePreset = 'week') => {
  const [preset, setPreset] = useState<DateRangePreset>(initialPreset);
  const [customRange, setCustomRange] = useState<DateRange | null>(null);

  const dateRange = useMemo((): DateRange => {
    if (preset === 'custom' && customRange) {
      return customRange;
    }

    const now = new Date();
    let start: Date;

    switch (preset) {
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
        start = new Date(now);
        start.setDate(now.getDate() - 7);
    }

    return {
      start_date: formatDateToRFC3339(start, false),
      end_date: formatDateToRFC3339(now, true),
    };
  }, [preset, customRange]);

  return {
    preset,
    setPreset,
    dateRange,
    setCustomRange,
  };
};
