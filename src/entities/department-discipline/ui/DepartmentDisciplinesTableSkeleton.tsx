import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Skeleton } from 'shared/ui';

export function DepartmentDisciplinesTableSkeleton() {
  return (
    <div className="w-full overflow-x-auto rounded-md border border-border bg-card">
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12 whitespace-nowrap">№</TableHead>
            <TableHead className="min-w-[220px]">Наименование</TableHead>
            <TableHead className="w-28 whitespace-nowrap">Кредиты</TableHead>
            <TableHead className="w-40 whitespace-nowrap">Уровень</TableHead>
            <TableHead className="min-w-[180px]">Пререквизиты</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-6" />
              </TableCell>
              <TableCell>
                <Skeleton className="mb-1 h-4 w-[85%]" />
                <Skeleton className="h-3 w-1/2" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-28 rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
