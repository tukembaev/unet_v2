import type { SyllabusSemester } from "entities/education-management/model/types";
import { Table, TableBody } from "shared/ui";
import {
  aggregateSemestersTotals,
  SyllabusTotalsRows,
} from "./SyllabusTotalsRows";
import { SyllabusTableColumnHeaders } from "./SyllabusTableColumnHeaders";

type Props = {
  semesters: SyllabusSemester[];
};

/** Таблица с теми же колонками, что у семестров: заголовок + общий итог. */
export function SyllabusGrandTotalTable({ semesters }: Props) {
  const totals = aggregateSemestersTotals(semesters);

  return (
    <div className="w-full overflow-x-auto">
      <Table className="w-full min-w-[960px] text-[11px] leading-tight border border-border rounded-none">
        <SyllabusTableColumnHeaders />
        <TableBody>
          <SyllabusTotalsRows
            sectionTitle="Общий отчёт по всем семестрам"
            totals={totals}
            variant="plan"
          />
        </TableBody>
      </Table>
    </div>
  );
}
