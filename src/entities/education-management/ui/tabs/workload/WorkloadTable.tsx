import React, { RefObject } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "shared/ui";
import type { Subject, WorkLoad } from "entities/education-management/model/types";

interface WorkloadTableProps {
  workLoadData?: WorkLoad;
  printRef?: RefObject<HTMLDivElement | null>;
}

type WorkloadSection = {
  title: string;
  subjects: Subject[];
  teachers: string[];
  total?: Subject | null;
};

function teacherNames(
  subjects: Subject[],
  listed: string[] = []
): string[] {
  const names: string[] = [];
  const seen = new Set<string>();
  const add = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || seen.has(trimmed)) return;
    seen.add(trimmed);
    names.push(trimmed);
  };
  listed.forEach(add);
  subjects.forEach((subject) => {
    Object.keys(subject.teachers_hours ?? {}).forEach(add);
  });
  return names;
}

function toSection(
  title: string,
  subjects: Subject[] | undefined,
  total?: Subject | null
): WorkloadSection | null {
  if (!subjects?.length) return null;
  return {
    title,
    subjects,
    total,
    teachers: teacherNames(subjects),
  };
}

function workloadSections(data?: WorkLoad): WorkloadSection[] {
  if (!data) return [];

  const grouped = [
    toSection("Очная форма", data.full_time?.subjects, data.full_time?.total),
    toSection(
      "Заочная форма",
      data.part_time?.subjects,
      data.part_time?.total
    ),
  ].filter((section): section is WorkloadSection => section !== null);

  if (grouped.length) return grouped;

  if (data.subjects?.length) {
    return [
      {
        title: "",
        subjects: data.subjects,
        teachers: teacherNames(data.subjects, data.teachers),
      },
    ];
  }

  return [];
}

function SubjectRow({
  subject,
  teachers,
  strong = false,
}: {
  subject: Subject;
  teachers: string[];
  strong?: boolean;
}) {
  const cellClass = strong
    ? "border border-border px-1 py-1 font-semibold bg-muted/40"
    : "border border-border px-1 py-1";

  return (
    <TableRow className={strong ? "h-7 bg-muted/30" : "h-6"}>
      <TableCell className={cellClass}>{subject.name}</TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.credit || "—"}
      </TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.direction && subject.direction !== "-"
          ? subject.direction
          : "—"}
      </TableCell>
      <TableCell className={`text-center w-32 ${cellClass}`}>
        {(subject.streams ?? []).length
          ? (subject.streams ?? []).map((stream, i) => (
              <div key={i}>{stream}</div>
            ))
          : "—"}
      </TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.budget_stud}
      </TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.contract_stud}
      </TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.students_count}
      </TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.semester && subject.semester !== "-"
          ? subject.semester
          : "—"}
      </TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.lecture}
      </TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.practice}
      </TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.lab}
      </TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.consult_control}
      </TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.rgr_rgz}
      </TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.cw_cp}
      </TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.vkr}
      </TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.phd}
      </TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.seminar}
      </TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.aspirant}
      </TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.practice_supervise}
      </TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.oop}
      </TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.gak}
      </TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.doct_consult}
      </TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.visit}
      </TableCell>
      <TableCell className={`text-center ${cellClass}`}>
        {subject.total}
      </TableCell>
      {teachers.map((teacher) => (
        <React.Fragment key={teacher}>
          <TableCell className={`text-center ${cellClass}`}>
            {subject.teachers_hours?.[teacher]?.aud || 0}
          </TableCell>
          <TableCell className={`text-center ${cellClass}`}>
            {subject.teachers_hours?.[teacher]?.out || 0}
          </TableCell>
        </React.Fragment>
      ))}
    </TableRow>
  );
}

export const WorkloadTable = ({ workLoadData, printRef }: WorkloadTableProps) => {
  const sections = workloadSections(workLoadData);
  if (!sections.length) {
    return (
      <p className="text-sm text-muted-foreground">Нет данных по нагрузке</p>
    );
  }

  return (
    <div ref={printRef} className="space-y-8">
      {sections.map((section) => (
        <WorkloadFormTable key={section.title || "workload"} section={section} />
      ))}
    </div>
  );
};

function WorkloadFormTable({ section }: { section: WorkloadSection }) {
  const subjects = section.subjects;
  const teachers = section.teachers;

  return (
    <div className="space-y-2">
      {section.title ? (
        <h3 className="text-sm font-semibold">{section.title}</h3>
      ) : null}
      <div className="overflow-x-auto">
        <Table className="border-collapse border border-border text-xs">
          <TableHeader className="hover:bg-transparent">
            <TableRow className="hover:bg-transparent h-8">
              <TableHead rowSpan={3} className="text-center align-middle border border-border px-1 py-1">
                Наименование дисциплин и других видов учебной работы
              </TableHead>
              <TableHead rowSpan={3} className="text-center align-middle border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  Количество кредитов
                </div>
              </TableHead>
              <TableHead rowSpan={3} className="text-center align-middle border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  Направление
                </div>
              </TableHead>
              <TableHead rowSpan={3} className="text-center align-middle border border-border px-1 py-1 min-w-32">
                <div className="writing-mode-vertical text-center text-xs flex items-center justify-center h-full">
                  Группа/Поток
                </div>
              </TableHead>
              <TableHead rowSpan={3} className="text-center align-middle border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  Кол.студ.бюджет
                </div>
              </TableHead>
              <TableHead rowSpan={3} className="text-center align-middle border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  Кол.студ. контракт
                </div>
              </TableHead>
              <TableHead rowSpan={3} className="text-center align-middle border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  Общее количество студентов
                </div>
              </TableHead>
              <TableHead rowSpan={3} className="text-center align-middle border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  Семестр
                </div>
              </TableHead>
              <TableHead colSpan={16} className="text-center border border-border px-1 py-1">
                Зачитывается в нагрузку кафедры (часов в неделю)
              </TableHead>
              <TableHead
                colSpan={Math.max(teachers.length * 2, 1)}
                className="text-center border border-border px-1 py-1"
              >
                Распределение по преподавателям
              </TableHead>
            </TableRow>

            <TableRow className="hover:bg-transparent h-8">
              <TableHead colSpan={3} className="text-center border border-border px-1 py-1">
                Ауд. занятие
              </TableHead>
              <TableHead rowSpan={2} className="text-center align-middle border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  Консультации и контроль
                </div>
              </TableHead>
              <TableHead rowSpan={2} className="text-center align-middle border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  РГР, РГЗ/Контр.работа
                </div>
              </TableHead>
              <TableHead rowSpan={2} className="text-center align-middle border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  КР/КП
                </div>
              </TableHead>
              <TableHead rowSpan={2} className="text-center align-middle border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  ВКР
                </div>
              </TableHead>
              <TableHead colSpan={7} className="text-center border border-border px-1 py-1">
                Руководство
              </TableHead>
              <TableHead rowSpan={2} className="text-center align-middle border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  Посещение занятий ППС
                </div>
              </TableHead>
              <TableHead rowSpan={2} className="text-center align-middle border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  Всего
                </div>
              </TableHead>
              {teachers.map((teacher) => (
                <TableHead
                  key={teacher}
                  colSpan={2}
                  className="text-center border border-border px-1 py-1"
                >
                  <div className="writing-mode-vertical text-center text-xs">
                    {teacher}
                  </div>
                </TableHead>
              ))}
            </TableRow>

            <TableRow className="hover:bg-transparent h-8">
              <TableHead className="text-center border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  Лекции
                </div>
              </TableHead>
              <TableHead className="text-center border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  Практика
                </div>
              </TableHead>
              <TableHead className="text-center border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  Лабораторное
                </div>
              </TableHead>
              <TableHead className="text-center border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  Маг-т/PhD докт-т
                </div>
              </TableHead>
              <TableHead className="text-center border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  Научный семинар
                </div>
              </TableHead>
              <TableHead className="text-center border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  Аспирантура
                </div>
              </TableHead>
              <TableHead className="text-center border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  Практика
                </div>
              </TableHead>
              <TableHead className="text-center border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  ООП
                </div>
              </TableHead>
              <TableHead className="text-center border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  Секретарь ГАК
                </div>
              </TableHead>
              <TableHead className="text-center border border-border px-1 py-1">
                <div className="writing-mode-vertical text-center text-xs">
                  Конс. соиск. ст. д.н.
                </div>
              </TableHead>
              {teachers.map((teacher) => (
                <React.Fragment key={teacher}>
                  <TableHead className="text-center border border-border px-1 py-1">
                    <div className="writing-mode-vertical text-center text-xs">
                      ауд.
                    </div>
                  </TableHead>
                  <TableHead className="text-center border border-border px-1 py-1">
                    <div className="writing-mode-vertical text-center text-xs">
                      вне ауд.
                    </div>
                  </TableHead>
                </React.Fragment>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject, index) => (
              <SubjectRow
                key={`${subject.name}-${subject.semester}-${index}`}
                subject={subject}
                teachers={teachers}
              />
            ))}
            {section.total ? (
              <SubjectRow
                subject={section.total}
                teachers={teachers}
                strong
              />
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
