import { Check, X, Edit, UserPlus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "shared/ui/table";
import { Skeleton } from "shared/ui/skeleton";
import { Button } from "shared/ui/button";
import { useState } from "react";
import {
  useFlowsSchedules,
  useSelectEmployees,
  useUpdateTeacher,
} from "../model/queries";
import { FlowInfo } from "../model/types";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "shared/ui";
import { AsyncSelect } from "shared/components";

export const StreamsInfo = () => {
  const [activeFlow, setActiveFlow] = useState<number | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState("" as any);
  const flowId: any = useLocation().state?.streamId;
  const { mutate ,isPending} = useUpdateTeacher(flowId);
  const { data: flowInfo , isLoading } = useFlowsSchedules(flowId as number);
  const { data: selectEmployees } = useSelectEmployees();

  const fetchEmployees = async (query?: string) => {
    if (!selectEmployees) return [];
    if (!query) return selectEmployees;
    return selectEmployees.filter((faculty) =>
      faculty.label.toLowerCase().includes(query.toLowerCase())
    );
  };
  const navigate = useNavigate()
  const handleSave = (flowId: number) => {
    if (!selectedTeacher) return;
    mutate({ flowId, teacher: +selectedTeacher });
    isPending
    setActiveFlow(null);
    setSelectedTeacher(null);
  };
  const onBack = () => {
    navigate(-1);
  }
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Card className="overflow-hidden rounded-2xl shadow-sm">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={onBack}
      >
        <X size={16} className="mr-2" />

      </Button>
      <Table>
        <TableCaption>Расписание потоков</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] text-center">№</TableHead>
            <TableHead>Номер потока</TableHead>
            <TableHead>Предмет</TableHead>
            <TableHead>Вид</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Кол-во</TableHead>
            <TableHead>Преподаватель</TableHead>
            <TableHead className="text-right">Действие</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {flowInfo?.map((item: FlowInfo, index: number) => {
            const isEditing = activeFlow === item.id;

            return (
              <TableRow
                key={item.id}
                className={`transition-colors ${
                  isEditing
                    ? "bg-blue-50/50 hover:bg-blue-100"
                    : "hover:bg-muted/40"
                }`}
              >
                <TableCell className="text-center font-medium">
                  {index + 1}
                </TableCell>
                <TableCell>{item.number}</TableCell>
                <TableCell className="font-medium">
                  {item.name_subject}
                </TableCell>
                <TableCell>{item.stream_type}</TableCell>
                <TableCell>
                  <span
                    className={
                      item.status === "Открыт"
                        ? "text-green-600"
                        : item.status === "В ожидании"
                        ? "text-amber-500"
                        : item.status === "В диспетчерской"
                        ? "text-blue-600"
                        : "text-red-500"
                    }
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell>0/{item.capacity}</TableCell>

                <TableCell>
                  {isEditing ? (
                    <AsyncSelect
                      fetcher={fetchEmployees}
                      label="Преподаватель"
                      value={selectedTeacher}
                      onChange={setSelectedTeacher}
                      renderOption={(option) => <span>{option.label}</span>}
                      getOptionValue={(option) => option.value.toString()}
                      getDisplayValue={(option) => option.label}
                      placeholder="Выберите преподавателя"
                      disabled={isLoading}
                    />
                  ) : item.teacher_name ? (
                    <span className="text-gray-700">{item.teacher_name}</span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveFlow(item.id)}
                      className="flex items-center gap-2"
                    >
                      <UserPlus size={16} />
                      Добавить
                    </Button>
                  )}
                </TableCell>

                <TableCell className="flex justify-end gap-2">
                  {isEditing ? (
                    <>
                      <Check
                        size={18}
                        onClick={() => handleSave(item.id)}
                        className=" hover:text-green-700 cursor-pointer"
                      />
                      <X
                        size={18}
                        onClick={() => setActiveFlow(null)}
                        className=" hover:text-red-600 cursor-pointer"
                      />
                    </>
                  ) : (
                    <>
                      <Edit
                        size={18}
                        onClick={() => setActiveFlow(item.id)}
                        className="text-gray-500 hover:text-blue-600 cursor-pointer"
                      />
                      <X
                        size={18}
                        onClick={() => setActiveFlow(null)}
                        className="text-gray-400 hover:text-red-500 cursor-pointer"
                      />
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
};
