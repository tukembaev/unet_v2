import React from "react";
import { Card, CardHeader, CardContent } from "shared/ui";
import { BookText, CalendarClock, MapPin, User } from "lucide-react";
import { ScaleLoader } from "react-spinners";
import { IScheduleItem } from "../model/types";
import { cn } from "shared/lib";
import { formatTeacherName } from "features/auth/model/helpers";

interface Props {
  title: string;
  data?: IScheduleItem[];
  onSelect?: (subject: IScheduleItem) => void;
}

const getColor = (type: string) => {
  switch (type) {
    case "Пр":
      return "bg-emerald-600";
    case "Лк":
      return "bg-blue-600";
    case "Лб":
      return "bg-violet-600";
    default:
      return "bg-gray-500";
  }
};

export const ScheduleCard: React.FC<Props> = ({ title, data, onSelect }) => {
  return (
    <Card className="rounded-2xl border border-border/70 shadow-sm">
      <CardHeader className="pb-2 pt-4">
        <h2 className="text-sm font-semibold sm:text-base">{title}</h2>
      </CardHeader>

      <CardContent className="pb-4">
        {!data ? (
          <div className="flex justify-center py-8">
            <ScaleLoader color="#888" />
          </div>
        ) : data.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Нет занятий
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {data.map((item) => {
              const isFree = item.subject === null;
              const color = getColor(item.class_type ? item.class_type : "");

              return (
                <div
                  key={`${item.time}-${item.auditorium || "free"}`}
                  onClick={() => !isFree && onSelect?.(item)}
                  className={cn(
                    "flex items-start rounded-xl p-2.5 transition",
                    isFree
                      ? "cursor-default border border-border/60"
                      : "cursor-pointer border border-border/60 hover:bg-primary/10"
                  )}
                >
                  {!isFree && (
                    <div className={cn("mr-2.5 rounded-lg p-1.5", color)}>
                      <BookText className="text-white" size={16} />
                    </div>
                  )}

                  <div className="flex w-full flex-col gap-1 text-sm">
                    {isFree ? (
                      <span className="text-muted-foreground">{item.time}</span>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <span
                            className={cn(
                              "rounded-md px-1.5 py-0.5 text-[11px] text-white",
                              color
                            )}
                          >
                            {item.class_type}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <CalendarClock size={12} /> {item.time}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin size={12} /> {item.auditorium}
                          </span>
                        </div>
                        <div className="text-sm font-medium">{item.subject}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User size={12} />{" "}
                          {formatTeacherName(item.teacher ?? "")}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
