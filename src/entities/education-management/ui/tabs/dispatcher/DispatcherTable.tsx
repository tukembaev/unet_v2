import type { WorkPlanItem } from 'entities/education-management/model/types';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'shared/ui';

interface DispatcherTableProps {
  data: WorkPlanItem[];
  onScheduleAction: (item: WorkPlanItem) => void;
}

export const DispatcherTable = ({
  data,
  onScheduleAction,
}: DispatcherTableProps) => {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>№</TableHead>
            <TableHead>Номер потока</TableHead>
            <TableHead>Наименование предмета</TableHead>
            <TableHead>Вид</TableHead>
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
              <TableCell>
                {item.students_count}
                {item.capacity != null ? ` / ${item.capacity}` : ''}
              </TableCell>
              <TableCell>{item.teacher_name || '—'}</TableCell>
              <TableCell>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onScheduleAction(item)}
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
