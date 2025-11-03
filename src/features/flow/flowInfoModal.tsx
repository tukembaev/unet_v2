import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "shared/ui/dialog";
import { Badge } from "shared/ui/badge";
import { Separator } from "shared/ui/separator";
import { FlowInfo } from "entities/streams";
import { AsyncSelect } from "shared/components";
import { useState } from "react";
import { useSelectEmployees } from "entities/streams/model/queries";


interface FlowInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flow: FlowInfo | null;
}

export const FlowInfoModal = ({ open, onOpenChange, flow }: FlowInfoModalProps) => {
  if (!flow) return null;
    const [selectedTeacher, setSelectedTeacher] = useState("" as any);
    const { data: selectEmployees } = useSelectEmployees();
      const fetchEmployees = async (query?: string) => {
    if (!selectEmployees) return [];
    if (!query) return selectEmployees;
    return selectEmployees.filter((faculty) =>
      faculty.label.toLowerCase().includes(query.toLowerCase())
    );
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Поток #{flow.number}
          </DialogTitle>
          <DialogDescription>
            Подробная информация о выбранном потоке
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Предмет:</span>
            <span className="font-medium">{flow.name_subject}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Тип потока:</span>
            <Badge variant="secondary">{flow.stream_type}</Badge>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Статус:</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border font-medium transition-colors ${
                flow.status === "Открыт"
                  ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                  : flow.status === "В ожидании"
                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800"
                  : flow.status === "В диспетчерской"
                  ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800"
                  : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800"
              }`}
            >
              {flow.status}
            </span>
          </div>

          <Separator />

          <div className="flex justify-between">
            <span className="text-muted-foreground">Преподаватель:</span>
            <div>{flow.teacher_name || (
                <AsyncSelect
                      fetcher={fetchEmployees}
                      label="Преподаватель"
                      value={selectedTeacher }
                      onChange={setSelectedTeacher}
                      renderOption={(option) => <span>{option.label}</span>}
                      getOptionValue={(option) => option.value.toString()}
                      getDisplayValue={(option) => option.label}
                      placeholder="Выберите преподавателя"
                    //   disabled={isLoading}
                    />
            )}</div>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Вместимость:</span>
            <span>{flow.capacity}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
