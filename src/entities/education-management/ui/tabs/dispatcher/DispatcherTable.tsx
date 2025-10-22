import { WorkPlanItem } from "entities/education-management/model/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button } from "shared/ui";

interface DispatcherTableProps {
  data: WorkPlanItem[];
  onScheduleAction: (id: number) => void;
}

export const DispatcherTable = ({ data, onScheduleAction }: DispatcherTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>№</TableHead>
            <TableHead>Номер</TableHead>
            <TableHead>Наименование предмета</TableHead>
            <TableHead>Вид потока</TableHead>
            <TableHead>Кол-во студентов</TableHead>
            <TableHead>Преподаватель</TableHead>
            <TableHead>Действие</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.number}</TableCell>
              <TableCell>{item.name_subject}</TableCell>
              <TableCell>{item.stream_type}</TableCell>
              <TableCell>{item.students_count}</TableCell>
              <TableCell>{item.teacher_name}</TableCell>
              <TableCell>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => onScheduleAction(item.id)}
                >
                  Составить расписание
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
