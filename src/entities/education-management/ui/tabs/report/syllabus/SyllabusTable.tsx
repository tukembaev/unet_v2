import {
  SyllabusCourse,
  SyllabusSemester,
} from "entities/education-management/model/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "shared/ui";
import { CourseEditModal } from "features/syllabus/index";
import { useState } from "react";
import { Plus } from "lucide-react";

interface Props {
  semester: SyllabusSemester;
  role?: "admin" | "user" | string;
  onAddElective?: () => void;
}

export const SyllabusTable = ({ semester, role = "user", onAddElective }: Props) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SyllabusCourse | null>(null);

  const mainCourses = semester.courses ?? [];
  const electiveGroups = semester.elective_course ?? [];

  let rowIndex = 1;

  const openEditor = (course: SyllabusCourse) => {
    setSelected(course);
    setOpen(true);
  };

  return (
    <>
      <Table className="text-[11px] leading-tight border border-border rounded-none">
        <TableHeader className="bg-muted/70">
          <TableRow className="border-b border-border">
            <TableHead className="w-8 text-center text-foreground font-semibold border-r border-border py-2 px-3">№</TableHead>
            <TableHead className="text-foreground font-semibold border-r border-border py-2 px-3">Код дисциплины</TableHead>
            <TableHead className="text-foreground font-semibold border-r border-border py-2 px-3">Наименование предмета</TableHead>
            <TableHead className="text-foreground font-semibold border-r border-border py-2 px-3">Кафедра</TableHead>
            <TableHead className="text-foreground font-semibold border-r border-border py-2 px-3">Цикл</TableHead>
            <TableHead className="text-foreground font-semibold border-r border-border py-2 px-3">Статус</TableHead>
            <TableHead className="text-foreground font-semibold border-r border-border py-2 px-3">Форма контроля</TableHead>
            <TableHead className="text-foreground font-semibold border-r border-border py-2 px-3">Кредит</TableHead>
            <TableHead className="text-foreground font-semibold border-r border-border py-2 px-3">Всего ауд.</TableHead>
            <TableHead className="text-foreground font-semibold border-r border-border py-2 px-3">Лек.</TableHead>
            <TableHead className="text-foreground font-semibold border-r border-border py-2 px-3">Пр.</TableHead>
            <TableHead className="text-foreground font-semibold py-2 px-3">Лаб.</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Semester heading inside the table */}
          <TableRow className="border-b border-border">
            <TableCell colSpan={12} className="py-2 px-3 bg-muted/50 text-center font-medium text-base border-r-0">
              {semester.name_semester} — семестр
            </TableCell>
          </TableRow>

          {mainCourses.map((c) => {
            const currentIndex = rowIndex++;
            return (
              <TableRow
                key={c.id}
                className="hover:bg-muted/30 cursor-pointer border-b border-border"
                onClick={() => openEditor(c)}
              >
                <TableCell className="text-center py-2 px-3 border-r border-border">{currentIndex}</TableCell>
                <TableCell className="py-2 px-3 border-r border-border">{c.code ?? "—"}</TableCell>
                <TableCell className="py-2 px-3 border-r border-border">{c.name_subject}</TableCell>
                <TableCell className="py-2 px-3 border-r border-border">{c.dep}</TableCell>
                <TableCell className="py-2 px-3 border-r border-border">{c.cycle ?? ""}</TableCell>
                <TableCell className="py-2 px-3 border-r border-border">{c.course_type}</TableCell>
                <TableCell className="py-2 px-3 border-r border-border">{c.control_form}</TableCell>
                <TableCell className="py-2 px-3 border-r border-border">{c.credit}</TableCell>
                <TableCell className="py-2 px-3 border-r border-border">{c.amount_hours}</TableCell>
                <TableCell className="py-2 px-3 border-r border-border">{c.lecture_hours}</TableCell>
                <TableCell className="py-2 px-3 border-r border-border">{c.practice_hours}</TableCell>
                <TableCell className="py-2 px-3">{c.lab_hours}</TableCell>
              </TableRow>
            );
          })}

          {/* Elective section header - separator between main and elective courses */}
          {electiveGroups.length > 0 && (
            <TableRow className="border-b border-border">
              <TableCell colSpan={12} className="py-2 px-3 bg-accent/30 text-center border-r-0">
                <span className="font-semibold text-base text-accent-foreground">Предметы по выбору</span>
              </TableCell>
            </TableRow>
          )}

          {/* Elective groups with shared index via rowSpan */}
          {electiveGroups.map((group) => {
            if (!group || group.length === 0) return null;
            const groupIndex = rowIndex++; // one number for the whole group
            return group.map((c, idx) => (
              <TableRow
                key={c.id}
                className="hover:bg-muted/30 cursor-pointer border-b border-border"
                onClick={() => openEditor(c)}
              >
                {idx === 0 && (
                  <TableCell rowSpan={group.length} className="text-center align-top py-2 px-3 border-r border-border">
                    {groupIndex}
                  </TableCell>
                )}
                <TableCell className="py-2 px-3 border-r border-border">{c.code ?? "—"}</TableCell>
                <TableCell className="py-2 px-3 border-r border-border">{c.name_subject}</TableCell>
                <TableCell className="py-2 px-3 border-r border-border">{c.dep}</TableCell>
                <TableCell className="py-2 px-3 border-r border-border">{c.cycle ?? ""}</TableCell>
                <TableCell className="py-2 px-3 border-r border-border">{c.course_type}</TableCell>
                <TableCell className="py-2 px-3 border-r border-border">{c.control_form}</TableCell>
                <TableCell className="py-2 px-3 border-r border-border">{c.credit}</TableCell>
                <TableCell className="py-2 px-3 border-r border-border">{c.amount_hours}</TableCell>
                <TableCell className="py-2 px-3 border-r border-border">{c.lecture_hours}</TableCell>
                <TableCell className="py-2 px-3 border-r border-border">{c.practice_hours}</TableCell>
                <TableCell className="py-2 px-3">{c.lab_hours}</TableCell>
              </TableRow>
            ));
          })}

          {/* Mini Empty for adding new elective course */}
          {electiveGroups.length > 0 && role === "admin" && (
            <TableRow className="border-b border-border">
              <TableCell colSpan={12} className="py-2 px-3 border-r-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddElective?.();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-accent/30 transition-colors group"
                >
                  <Plus size={16} className="text-muted-foreground group-hover:text-primary" />
                  <span className="text-xs text-muted-foreground group-hover:text-primary font-medium">
                    Добавить предмет по выбору
                  </span>
                </button>
              </TableCell>
            </TableRow>
          )}

          {/* Semester summary (report) */}
          <TableRow className="border-b border-border">
            <TableCell colSpan={12} className="bg-muted/40 font-medium py-2 px-3 text-center border-r-0">
              Отчет по семестру
            </TableCell>
          </TableRow>
          <TableRow className="bg-muted/40 font-semibold">
            <TableCell className="text-center py-2 px-3 border-r border-border"></TableCell>
            <TableCell className="py-2 px-3 border-r border-border"></TableCell>
            <TableCell colSpan={3} className="font-semibold py-2 px-3 border-r border-border">
              Итого
            </TableCell>
            <TableCell className="py-2 px-3 border-r border-border"></TableCell>
            <TableCell className="py-2 px-3 border-r border-border">{semester.count_credit}</TableCell>
            <TableCell className="py-2 px-3 border-r border-border">{semester.amount_hours}</TableCell>
            <TableCell className="py-2 px-3 border-r border-border">{semester.lecture_hours}</TableCell>
            <TableCell className="py-2 px-3 border-r border-border">{semester.practice_hours}</TableCell>
            <TableCell className="py-2 px-3">{semester.lab_hours}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <CourseEditModal open={open} onOpenChange={setOpen} course={selected} />
    </>
  );
};
