import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'shared/ui';
import { daysInMonth } from '../model/types';

type AttendanceMatrixSkeletonProps = {
  year: number;
  month: number;
  rows?: number;
};

export function AttendanceMatrixSkeleton({
  year,
  month,
  rows = 10,
}: AttendanceMatrixSkeletonProps) {
  const dayCount = daysInMonth(year, month);
  const dayNumbers = Array.from({ length: dayCount }, (_, i) => i + 1);

  return (
    <div className="rounded-md border bg-card">
      <Table className="w-max text-xs">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="sticky left-0 z-20 w-9 bg-background px-2">
              №
            </TableHead>
            <TableHead className="sticky left-9 z-20 w-40 bg-background px-2">
              Сотрудник
            </TableHead>
            <TableHead className="w-40 px-2">Должность</TableHead>
            <TableHead className="w-14 px-1 text-center">Ставка</TableHead>
            <TableHead className="w-12 px-1 text-center">Дней</TableHead>
            <TableHead className="w-16 px-1 text-center">Часов</TableHead>
            {dayNumbers.map((day) => (
              <TableHead
                key={day}
                className="w-8 px-0 text-center text-[11px]"
              >
                {day}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="hover:bg-transparent">
              <TableCell className="sticky left-0 z-10 bg-background px-2">
                <Skeleton className="mx-auto h-3 w-4" />
              </TableCell>
              <TableCell className="sticky left-9 z-10 bg-background px-2">
                <Skeleton
                  className="h-3"
                  style={{ width: `${96 + ((rowIndex * 13) % 40)}px` }}
                />
              </TableCell>
              <TableCell className="px-2">
                <Skeleton className="h-3 w-28" />
              </TableCell>
              <TableCell className="px-1">
                <Skeleton className="mx-auto h-3 w-6" />
              </TableCell>
              <TableCell className="px-1">
                <Skeleton className="mx-auto h-3 w-6" />
              </TableCell>
              <TableCell className="px-1">
                <Skeleton className="mx-auto h-3 w-10" />
              </TableCell>
              {dayNumbers.map((day) => (
                <TableCell key={day} className="px-0">
                  <Skeleton className="mx-auto h-3 w-3 rounded-sm" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
