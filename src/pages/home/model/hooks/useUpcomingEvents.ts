import { useQuery } from '@tanstack/react-query';
import { apiClientGo } from 'shared/config';

interface ScheduleEvent {
  subject: string;
  time: string;
  room?: string;
  teacher?: string;
  day: string;
}

export const useUpcomingEvents = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['schedule-events'],
    queryFn: async () => {
      const { data } = await apiClientGo.get('schedule');
      return data;
    },
  });

  const events: ScheduleEvent[] = [];

  if (data) {
    // Получаем текущий день недели
    const daysMap: Record<number, string> = {
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday',
      0: 'sunday',
    };

    const today = new Date().getDay();
    const todayKey = daysMap[today];

    // Получаем события на сегодня
    if (data[todayKey]) {
      data[todayKey].forEach((item: any) => {
        events.push({
          subject: item.subject || 'Занятие',
          time: item.time || '',
          room: item.room,
          teacher: item.teacher,
          day: todayKey,
        });
      });
    }

    // Если сегодня нет событий, берем следующий день
    if (events.length === 0) {
      const nextDay = (today + 1) % 7;
      const nextDayKey = daysMap[nextDay];
      
      if (data[nextDayKey]) {
        data[nextDayKey].forEach((item: any) => {
          events.push({
            subject: item.subject || 'Занятие',
            time: item.time || '',
            room: item.room,
            teacher: item.teacher,
            day: nextDayKey,
          });
        });
      }
    }
  }

  return {
    events,
    isLoading,
  };
};
