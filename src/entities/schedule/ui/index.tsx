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
    <Card className=" border  rounded-2xl backdrop-blur-sm ">
      <CardHeader>
        <h2 className="text-lg font-semibold ">{title}</h2>
      </CardHeader>

      <CardContent>
        {!data ? (
          <div className="flex justify-center py-8">
            <ScaleLoader color="#fff" />
          </div>
        ) : data.length === 0 ? (
          <p className="text-gray-400 text-center py-6">Нет занятий</p>
        ) : (
          <div className="flex flex-col gap-3">
            {data.map((item) => {
              const isFree = item.subject === null;
              const color = getColor(item.class_type ? item.class_type : "");

              return (
                <div
                  key={`${item.time}-${item.auditorium || "free"}`}
                  onClick={() => !isFree && onSelect?.(item)}
                  className={cn(
                    "flex items-start p-3 rounded-xl transition cursor-pointer",
                    isFree
                      ? " border  cursor-default"
                      : " border hover:bg-primary/10"
                  )}
                >
                  {!isFree && (
                    <div className={cn("p-2 rounded-md mr-3", color)}>
                      <BookText className="text-white" size={18} />
                    </div>
                  )}

                  <div className="flex flex-col gap-1 w-full text-sm ">
                    {isFree ? (
                      <span>{item.time}</span>
                    ) : (
                      <>
                        <div className="flex items-center justify-between ">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-xs text-white ",
                              color
                            )}
                          >
                            {item.class_type}
                          </span>
                          <span className="flex items-center gap-1 ">
                            <CalendarClock size={14} /> {item.time}
                          </span>
                          <span className="flex items-center gap-1 ">
                            <MapPin size={14} /> {item.auditorium}
                          </span>
                        </div>
                        <div className="font-medium ">{item.subject}</div>
                        <div className="flex items-center gap-1">
                          <User size={14} /> {formatTeacherName(item.teacher ?? "")}
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
