import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "shared/ui";
import type { KpiReportTableRow } from "../model/types";

const PREFERRED_KEYS = [
  "id",
  "full_name",
  "name",
  "fio",
  "department",
  "departament_name",
  "department_name",
  "title_faculty",
  "scores",
  "passed",
  "passed_percent",
  "no_passed",
  "phone_number",
];

function pickColumns(rows: KpiReportTableRow[], max = 10): string[] {
  const keys = new Set<string>();
  rows.slice(0, 30).forEach((r) => Object.keys(r).forEach((k) => keys.add(k)));
  const ordered = PREFERRED_KEYS.filter((k) => keys.has(k));
  const rest = [...keys].filter((k) => !ordered.includes(k)).sort();
  return [...ordered, ...rest].slice(0, max);
}

function formatCell(value: unknown): string {
  if (value == null) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

type Props = {
  title: string;
  description?: string;
  rows: KpiReportTableRow[];
  isLoading: boolean;
  errorMessage?: string;
  emptyText?: string;
};

export function KpiReportDataTable({
  title,
  description,
  rows,
  isLoading,
  errorMessage,
  emptyText = "Нет данных.",
}: Props) {
  const columns = pickColumns(rows);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}
        {isLoading && !rows.length && (
          <div className="space-y-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        )}
        {!isLoading && !errorMessage && rows.length === 0 && (
          <p className="text-sm text-muted-foreground">{emptyText}</p>
        )}
        {rows.length > 0 && (
          <div className="max-h-[min(60vh,520px)] overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col} className="whitespace-nowrap">
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, i) => (
                  <TableRow key={i}>
                    {columns.map((col) => (
                      <TableCell key={col} className="max-w-[240px] truncate text-sm">
                        {formatCell(row[col])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
