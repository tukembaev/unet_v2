import { useState } from "react";
import { Edit } from "lucide-react";
import { Card } from "shared/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "shared/ui/table";
import { Skeleton } from "shared/ui/skeleton";
import { useFlowsSchedules } from "../model/queries";
import { FlowInfo } from "../model/types";
import { FlowInfoModal } from "features/flow/flowInfoModal";
import { useLocation } from "react-router-dom";


export const StreamsInfo = () => {
  const [selectedFlow, setSelectedFlow] = useState<FlowInfo | null>(null);
  const flowId: any = useLocation().state?.streamId;
  const { data: flowInfo, isLoading } = useFlowsSchedules(flowId as number);
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
    <>
      <Card className="overflow-hidden rounded-2xl shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] text-center">№</TableHead>
              <TableHead>Номер потока</TableHead>
              <TableHead>Предмет</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Преподаватель</TableHead>
              <TableHead className="text-right">Действие</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {flowInfo?.map((item, index) => (
              <TableRow key={item.id} className="transition-colors hover:bg-muted/40">
                <TableCell className="text-center font-medium">{index + 1}</TableCell>
                <TableCell>{item.number}</TableCell>
                <TableCell>{item.name_subject}</TableCell>
                <TableCell>{item.stream_type}</TableCell>
                <TableCell>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-medium transition-colors ${
                      item.status === "Открыт"
                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                        : item.status === "В ожидании"
                        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800"
                        : item.status === "В диспетчерской"
                        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800"
                        : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell>{item.teacher_name || "Не указан"}</TableCell>
                <TableCell className="relative">
                  <Edit
                    size={18}
                    onClick={() => setSelectedFlow(item)}
                    className="text-gray-500 absolute right-10 hover:text-blue-600 cursor-pointer "
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <FlowInfoModal
        open={!!selectedFlow}
        onOpenChange={() => setSelectedFlow(null)}
        flow={selectedFlow}
      />
    </>
  );
};
