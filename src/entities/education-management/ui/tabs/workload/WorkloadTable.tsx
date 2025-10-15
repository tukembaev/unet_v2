import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "shared/ui";
import { WorkLoad } from "entities/education-management/model/types";

interface WorkloadTableProps {
  workLoadData?: WorkLoad;
}

export const WorkloadTable = ({ workLoadData }: WorkloadTableProps) => {
  // Don't render table if no data
  if (!workLoadData || !workLoadData.subjects || workLoadData.subjects.length === 0) {
    return null;
  }

  const subjects = workLoadData.subjects;
  const teachers = workLoadData.teachers;

  return (
    
        <div className="overflow-x-auto">
          <Table className="border-collapse border border-gray-300 text-xs">
            <TableHeader className="hover:bg-transparent">
              {/* Первый уровень заголовков */}
              <TableRow className="hover:bg-transparent h-8">
                <TableHead rowSpan={3} className="text-center align-middle border border-gray-300 px-1 py-1">
                  Наименование дисциплин и других видов учебной работы
                </TableHead>
                <TableHead rowSpan={3} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Количество кредитов
                  </div>
                </TableHead>
                <TableHead rowSpan={3} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Направление
                  </div>
                </TableHead>
                <TableHead rowSpan={3} className="text-center align-middle border border-gray-300 px-1 py-1 min-w-32">
                  <div className="writing-mode-vertical text-center text-xs flex items-center justify-center h-full">
                    Группа/Поток
                  </div>
                </TableHead>
                <TableHead rowSpan={3} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Кол.студ.бюджет
                  </div>
                </TableHead>
                <TableHead rowSpan={3} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Кол.студ. контракт
                  </div>
                </TableHead>
                <TableHead rowSpan={3} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Общее количество студентов
                  </div>
                </TableHead>
                <TableHead rowSpan={3} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Семестр
                  </div>
                </TableHead>
                <TableHead colSpan={16} className="text-center border border-gray-300 px-1 py-1">
                  Зачитывается в нагрузку кафедры (часов в неделю)
                </TableHead>
                <TableHead colSpan={teachers.length * 2} className="text-center border border-gray-300 px-1 py-1">
                  Распределение по преподавателям
                </TableHead>
              </TableRow>

              {/* Второй уровень заголовков */}
              <TableRow className="hover:bg-transparent h-8">
                <TableHead colSpan={3} className="text-center border border-gray-300 px-1 py-1">
                  Ауд. занятие
                </TableHead>
                <TableHead rowSpan={2} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Консультации и контроль
                  </div>
                </TableHead>
                <TableHead rowSpan={2} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    РГР, РГЗ/Контр.работа
                  </div>
                </TableHead>
                <TableHead rowSpan={2} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    КР/КП
                  </div>
                </TableHead>
                <TableHead rowSpan={2} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    ВКР
                  </div>
                </TableHead>
                <TableHead colSpan={7} className="text-center border border-gray-300 px-1 py-1">
                  Руководство
                </TableHead>
                <TableHead rowSpan={2} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Посещение занятий ППС
                  </div>
                </TableHead>
                <TableHead rowSpan={2} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Всего
                  </div>
                </TableHead>
                {/* Teacher columns */}
                {teachers.map((teacher) => (
                  <TableHead key={teacher} colSpan={2} className="text-center border border-gray-300 px-1 py-1">
                    <div className="writing-mode-vertical text-center text-xs">
                      {teacher}
                    </div>
                  </TableHead>
                ))}
              </TableRow>

              {/* Третий уровень заголовков */}
              <TableRow className="hover:bg-transparent h-8">
                <TableHead className="text-center border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Лекции
                  </div>
                </TableHead>
                <TableHead className="text-center border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Практика
                  </div>
                </TableHead>
                <TableHead className="text-center border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Лабораторное
                  </div>
                </TableHead>
                <TableHead className="text-center border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Маг-т/PhD докт-т
                  </div>
                </TableHead>
                <TableHead className="text-center border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Научный семинар
                  </div>
                </TableHead>
                <TableHead className="text-center border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Аспирантура
                  </div>
                </TableHead>
                <TableHead className="text-center border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Практика
                  </div>
                </TableHead>
                <TableHead className="text-center border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    ООП
                  </div>
                </TableHead>
                <TableHead className="text-center border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Секретарь ГАК
                  </div>
                </TableHead>
                <TableHead className="text-center border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Конс. соиск. ст. д.н.
                  </div>
                </TableHead>
                {/* Teacher sub-columns */}
                {teachers.map((teacher) => (
                  <React.Fragment key={teacher}>
                    <TableHead className="text-center border border-gray-300 px-1 py-1">
                      <div className="writing-mode-vertical text-center text-xs">
                        ауд.
                      </div>
                    </TableHead>
                    <TableHead className="text-center border border-gray-300 px-1 py-1">
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
                <TableRow key={index} className="h-6">
                  <TableCell className="border border-gray-300 px-1 py-1">{subject.name}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{subject.credit}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{subject.direction}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1 w-32">
                    {subject.streams.map((stream, i) => (
                      <div key={i}>{stream}</div>
                    ))}
                  </TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{subject.budget_stud}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{subject.contract_stud}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{subject.students_count}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{subject.semester}</TableCell>
                  {/* Аудиторные занятия */}
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{subject.lecture}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{subject.practice}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{subject.lab}</TableCell>
                  {/* Консультации и контроль */}
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{subject.consult_control}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{subject.rgr_rgz}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{subject.cw_cp}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{subject.vkr}</TableCell>
                  {/* Руководство */}
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{subject.phd}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{subject.seminar}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{subject.aspirant}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{subject.practice_supervise}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{subject.oop}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{subject.gak}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{subject.doct_consult}</TableCell>
                  {/* Посещение занятий ППС */}
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{subject.visit}</TableCell>
                  <TableCell className="text-center font-semibold border border-gray-300">{subject.total}</TableCell>
                  {/* Teacher columns */}
                  {teachers.map((teacher) => (
                    <React.Fragment key={teacher}>
                      <TableCell className="text-center border border-gray-300 px-1 py-1">
                        {subject.teachers_hours[teacher]?.aud || 0}
                      </TableCell>
                      <TableCell className="text-center border border-gray-300 px-1 py-1">
                        {subject.teachers_hours[teacher]?.out || 0}
                      </TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
    
  );
};
