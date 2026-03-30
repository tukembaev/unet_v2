import { useEffect, useState } from "react";
import { useSchedulesQuery } from "entities/schedule/model/queries";
import { IScheduleItem } from "entities/schedule/model/types";
import { ScheduleCard } from "entities/schedule/ui";
import { ScheduleSkeleton } from "entities/schedule/ui/ScheduleCardSkeleton";

const days = [
  { key: "monday", label: "Понедельник" },
  { key: "tuesday", label: "Вторник" },
  { key: "wednesday", label: "Среда" },
  { key: "thursday", label: "Четверг" },
  { key: "friday", label: "Пятница" },
  { key: "saturday", label: "Суббота" },
];

export const SchedulePage = () => {
  const { data, isLoading, isError } = useSchedulesQuery();
  const [selectedDay] = useState("monday");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelectSubject = (subject: IScheduleItem) => {
    console.log("Selected subject:", subject);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        <ScheduleSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        Ошибка при загрузке расписания.
      </div>
    );
  }

  return (
    <div className="min-h-screen    py-6">
      <div className="flex items-center justify-between flex-wrap mb-6 ">
        <h1 className="text-2xl font-bold">Расписание</h1>
      </div>

      {isMobile ? (
        <ScheduleCard
          title={days.find((d) => d.key === selectedDay)?.label || ""}
          data={data?.[selectedDay]}
          onSelect={handleSelectSubject}
        />
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {days.map((day) => (
            <ScheduleCard
              key={day.key}
              title={day.label}
              data={data?.[day.key]}
              onSelect={handleSelectSubject}
            />
          ))}
        </div>
      )}
    </div>
  );
};
