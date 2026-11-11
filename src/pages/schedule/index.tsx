import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useSchedulesQuery } from "entities/schedule/model/queries";
import type { ISchedule, IScheduleItem } from "entities/schedule/model/types";
import { ScheduleCard } from "entities/schedule/ui";
import { ScheduleSkeleton } from "entities/schedule/ui/ScheduleCardSkeleton";
import { cn } from "shared/lib/utils";
import { Button } from "shared/ui";

const days = [
  { key: "monday", label: "Понедельник", short: "Пн" },
  { key: "tuesday", label: "Вторник", short: "Вт" },
  { key: "wednesday", label: "Среда", short: "Ср" },
  { key: "thursday", label: "Четверг", short: "Чт" },
  { key: "friday", label: "Пятница", short: "Пт" },
  { key: "saturday", label: "Суббота", short: "Сб" },
] as const;

type DayKey = (typeof days)[number]["key"];

const EMPTY_SCHEDULE: ISchedule = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
};

function todayDayKey(): DayKey {
  const jsDay = new Date().getDay();
  const map: Record<number, DayKey> = {
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  };
  return map[jsDay] ?? "monday";
}

function isScheduleEmpty(schedule: ISchedule | undefined): boolean {
  if (!schedule) return true;
  return days.every((d) => !(schedule[d.key]?.length > 0));
}

export const SchedulePage = () => {
  const { data, isLoading, isError, error, isSuccess } = useSchedulesQuery();
  const [selectedDay, setSelectedDay] = useState<DayKey>(todayDayKey);
  const [isMobile, setIsMobile] = useState(false);
  const toastShown = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (toastShown.current || isLoading) return;
    if (isError) {
      toastShown.current = true;
      toast.error("Не удалось загрузить расписание", {
        description:
          error instanceof Error ? error.message : "Показано пустое расписание",
      });
      return;
    }
    if (isSuccess && isScheduleEmpty(data)) {
      toastShown.current = true;
      toast.message("Расписание пустое", {
        description: "На этой неделе занятий нет или данные ещё не загружены",
      });
    }
  }, [isLoading, isError, isSuccess, data, error]);

  const schedule = data ?? EMPTY_SCHEDULE;

  const selectedLabel = useMemo(
    () => days.find((d) => d.key === selectedDay)?.label ?? "",
    [selectedDay]
  );

  const handleSelectSubject = (_subject: IScheduleItem) => {
    /* placeholder */
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <ScheduleSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
        Расписание
      </h1>

      {isMobile ? (
        <div className="space-y-3">
          <div className="flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {days.map((day) => (
              <Button
                key={day.key}
                type="button"
                size="sm"
                variant={selectedDay === day.key ? "default" : "outline"}
                className={cn(
                  "h-8 shrink-0 rounded-full px-3 text-xs",
                  selectedDay === day.key && "shadow-sm"
                )}
                onClick={() => setSelectedDay(day.key)}
              >
                {day.short}
              </Button>
            ))}
          </div>
          <ScheduleCard
            title={selectedLabel}
            data={schedule[selectedDay]}
            onSelect={handleSelectSubject}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {days.map((day) => (
            <ScheduleCard
              key={day.key}
              title={day.label}
              data={schedule[day.key]}
              onSelect={handleSelectSubject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
