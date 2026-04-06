import {
  TableHead,
  TableHeader,
  TableRow,
} from "shared/ui";

/** Заголовки колонок РУП — общие для таблицы семестра и блока общего итога. */
export function SyllabusTableColumnHeaders() {
  return (
    <TableHeader className="bg-muted/70">
      <TableRow className="border-b border-border">
        <TableHead className="w-8 min-w-[2rem] text-center text-foreground font-semibold border-r border-border py-2 px-3">
          №
        </TableHead>
        <TableHead className="min-w-[6rem] text-foreground font-semibold border-r border-border py-2 px-3">
          Код дисциплины
        </TableHead>
        <TableHead className="min-w-[10rem] text-foreground font-semibold border-r border-border py-2 px-3">
          Наименование предмета
        </TableHead>
        <TableHead className="min-w-[7rem] text-foreground font-semibold border-r border-border py-2 px-3">
          Кафедра
        </TableHead>
        <TableHead className="w-12 text-foreground font-semibold border-r border-border py-2 px-3">
          Цикл
        </TableHead>
        <TableHead className="min-w-[6rem] text-foreground font-semibold border-r border-border py-2 px-3">
          Статус
        </TableHead>
        <TableHead className="min-w-[6rem] text-foreground font-semibold border-r border-border py-2 px-3">
          Форма контроля
        </TableHead>
        <TableHead className="min-w-[5rem] text-foreground font-semibold border-r border-border py-2 px-3">
          Тип контроля
        </TableHead>
        <TableHead className="w-14 text-right tabular-nums text-foreground font-semibold border-r border-border py-2 px-3">
          Кредит
        </TableHead>
        <TableHead className="w-14 text-right tabular-nums text-foreground font-semibold border-r border-border py-2 px-3">
          Всего ауд.
        </TableHead>
        <TableHead className="w-12 text-right tabular-nums text-foreground font-semibold border-r border-border py-2 px-3">
          Лек.
        </TableHead>
        <TableHead className="w-12 text-right tabular-nums text-foreground font-semibold border-r border-border py-2 px-3">
          Пр.
        </TableHead>
        <TableHead className="w-12 text-right tabular-nums text-foreground font-semibold py-2 px-3">
          Лаб.
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
