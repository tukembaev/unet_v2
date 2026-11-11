import {
  Card,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'shared/ui';
import { cn } from 'shared/lib/utils';

export type DataTableSkeletonColumn = {
  key: string;
  label?: string;
  className?: string;
  cellClassName?: string;
  widthClassName?: string;
};

type DataTableSkeletonProps = {
  columns: DataTableSkeletonColumn[];
  rows?: number;
  className?: string;
  withCard?: boolean;
};

export function DataTableSkeleton({
  columns,
  rows = 8,
  className,
  withCard = true,
}: DataTableSkeletonProps) {
  const table = (
    <div className={cn('w-full overflow-x-auto rounded-md border bg-card', className)}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(column.className, column.widthClassName)}
              >
                {column.label ? (
                  column.label
                ) : (
                  <Skeleton className="h-4 w-20" />
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  <Skeleton
                    className={cn('h-4 w-full max-w-[180px]', column.cellClassName)}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  if (!withCard) return table;

  return <Card className="overflow-hidden rounded-2xl border-none shadow-sm">{table}</Card>;
}
