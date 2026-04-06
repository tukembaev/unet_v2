import { SyllabusSemester } from "entities/education-management/model/types";
import { TableCell, TableRow } from "shared/ui";

/** Число колонок данных в таблице РУП (№ … Лаб.) */
export const SYLLABUS_TABLE_COL_COUNT = 13;

export type SyllabusHoursTotals = {
  count_credit: number;
  amount_hours: number;
  lecture_hours: number;
  practice_hours: number;
  lab_hours: number;
};

export function aggregateSemestersTotals(
  semesters: SyllabusSemester[]
): SyllabusHoursTotals {
  return semesters.reduce(
    (acc, s) => ({
      count_credit: acc.count_credit + (Number(s.count_credit) || 0),
      amount_hours: acc.amount_hours + (Number(s.amount_hours) || 0),
      lecture_hours: acc.lecture_hours + (Number(s.lecture_hours) || 0),
      practice_hours: acc.practice_hours + (Number(s.practice_hours) || 0),
      lab_hours: acc.lab_hours + (Number(s.lab_hours) || 0),
    }),
    {
      count_credit: 0,
      amount_hours: 0,
      lecture_hours: 0,
      practice_hours: 0,
      lab_hours: 0,
    }
  );
}

type TotalsRowsProps = {
  sectionTitle: string;
  totals: SyllabusHoursTotals;
  /** Визуально выделить блок (например общий итог) */
  variant?: "semester" | "plan";
};

/**
 * Две строки: заголовок секции отчёта + строка «Итого» с часами.
 * Вставляется внутрь существующего TableBody.
 */
export function SyllabusTotalsRows({
  sectionTitle,
  totals,
  variant = "semester",
}: TotalsRowsProps) {
  const titleClass =
    variant === "plan"
      ? "bg-muted/50 py-2.5 px-3 text-center border-r-0 text-sm font-semibold text-foreground border-b border-border"
      : "bg-muted/40 font-medium py-2 px-3 text-center border-r-0";

  const rowClass =
    variant === "plan"
      ? "bg-muted/30 font-semibold border-b-0"
      : "bg-muted/40 font-semibold";

  const numCell =
    "py-2 px-3 text-right tabular-nums border-r border-border last:border-r-0";

  return (
    <>
      <TableRow className={variant === "plan" ? "border-b-0" : "border-b border-border"}>
        <TableCell colSpan={SYLLABUS_TABLE_COL_COUNT} className={titleClass}>
          {sectionTitle}
        </TableCell>
      </TableRow>
      <TableRow className={rowClass}>
        <TableCell className="w-8 min-w-[2rem] py-2 px-3 text-center border-r border-border" />
        <TableCell className="min-w-[6rem] py-2 px-3 border-r border-border" />
        <TableCell
          colSpan={3}
          className="min-w-[10rem] py-2 px-3 text-left font-semibold border-r border-border"
        >
          Итого
        </TableCell>
        <TableCell className="w-12 py-2 px-3 border-r border-border" />
        <TableCell className="min-w-[6rem] py-2 px-3 border-r border-border" />
        <TableCell className="min-w-[6rem] py-2 px-3 border-r border-border" />
        <TableCell className={`${numCell} w-14`}>{totals.count_credit}</TableCell>
        <TableCell className={`${numCell} w-14`}>{totals.amount_hours}</TableCell>
        <TableCell className={`${numCell} w-12`}>{totals.lecture_hours}</TableCell>
        <TableCell className={`${numCell} w-12`}>{totals.practice_hours}</TableCell>
        <TableCell className="py-2 px-3 text-right tabular-nums w-12">{totals.lab_hours}</TableCell>
      </TableRow>
    </>
  );
}
