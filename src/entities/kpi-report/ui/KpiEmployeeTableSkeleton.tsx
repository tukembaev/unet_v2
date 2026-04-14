import { Skeleton } from "shared/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "shared/ui";

const COLS = 8;

export function KpiEmployeeTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/60 hover:bg-transparent">
            {Array.from({ length: COLS }).map((_, i) => (
              <TableHead key={i} className="h-11 px-4">
                <Skeleton className="mx-auto h-3 w-12" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, ri) => (
            <TableRow key={ri} className="border-b border-border/40 hover:bg-transparent">
              <TableCell className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </TableCell>
              {Array.from({ length: COLS - 1 }).map((_, ci) => (
                <TableCell key={ci} className="px-4 py-3 text-center">
                  <Skeleton className="mx-auto h-4 w-8" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
