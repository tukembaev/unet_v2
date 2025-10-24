import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Skeleton } from 'shared/ui';

export const DocumentsTableSkeleton = () => {
  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px] min-w-[180px]">Номер</TableHead>
            <TableHead className="w-[200px] min-w-[200px]">Заявитель</TableHead>
            <TableHead className="w-[150px] min-w-[150px]">Тип</TableHead>
            <TableHead className="min-w-[250px]">Тема</TableHead>
            <TableHead className="w-[180px] min-w-[180px]">Статус</TableHead>
            <TableHead className="w-[150px] min-w-[150px]">Дата подачи</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-40" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-32 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

