import { Card, CardContent, CardDescription, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "shared/ui";

export const WorkloadTable = () => {
  
  const mockData = [
    {
      id: 1,
      discipline: "Программирование",
      credits: 6,
      direction: "09.03.01",
      group: "ИВТ-21-1",
      budgetStudents: 25,
      contractStudents: 5,
      totalStudents: 30,
      semester: 3,
      lectures: 2,
      practice: 1,
      laboratory: 1,
      consultations: 0.5,
      rgz: 0,
      kr: 0,
      vkr: 0,

      magistracy: 0,
      seminar: 0,
      postgraduate: 0,
      practiceSupervision: 0,
      oop: 0,
      secretaryGAK: 0,
      consultationPhD: 0,
      attendance: 0,
      totalWorkload: 4.5,
      audHours: 72,
      nonAudHours: 36,
      vkrReview: 0,
      overviewLectures: 0,
      gakParticipation: 0,
      postgraduateExams: 0,
      phdExams: 0,
      internSupervision: 0,
      totalHours: 108,
    },
    {
      id: 2,
      discipline: "Математический анализ",
      credits: 5,
      direction: "09.03.01",
      group: "ИВТ-21-1",
      budgetStudents: 30,
      contractStudents: 0,
      totalStudents: 30,
      semester: 1,
      lectures: 2,
      practice: 1,
      laboratory: 0,
      consultations: 0.5,
      rgz: 0,
      kr: 0,
      vkr: 0,
      magistracy: 0,
      seminar: 0,
      postgraduate: 0,
      practiceSupervision: 0,
      oop: 0,
      secretaryGAK: 0,
      consultationPhD: 0,
      attendance: 0,
      totalWorkload: 3.5,
      audHours: 60,
      nonAudHours: 30,
      vkrReview: 0,
      overviewLectures: 0,
      gakParticipation: 0,
      postgraduateExams: 0,
      phdExams: 0,
      internSupervision: 0,
      totalHours: 90,
    },
  ];

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
                <TableHead rowSpan={3} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
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
                <TableHead colSpan={11} className="text-center border border-gray-300 px-1 py-1">
                  Зачитывается в нагрузку кафедры (часов в неделю)
                </TableHead>
                <TableHead colSpan={9} className="text-center border border-gray-300 px-1 py-1">
                  Почасовой фонд (час)
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
                <TableHead rowSpan={2} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    ауд.
                  </div>
                </TableHead>
                <TableHead rowSpan={2} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    вне ауд.
                  </div>
                </TableHead>
                <TableHead rowSpan={2} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Рецензирование ВКР
                  </div>
                </TableHead>
                <TableHead rowSpan={2} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Обзорные лекции
                  </div>
                </TableHead>
                <TableHead rowSpan={2} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Участие в ГАК
                  </div>
                </TableHead>
                <TableHead rowSpan={2} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Экзамены аспирантуры
                  </div>
                </TableHead>
                <TableHead rowSpan={2} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Экзамены диссертации PhD
                  </div>
                </TableHead>
                <TableHead rowSpan={2} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Руководство стажерами
                  </div>
                </TableHead>
                <TableHead rowSpan={2} className="text-center align-middle border border-gray-300 px-1 py-1">
                  <div className="writing-mode-vertical text-center text-xs">
                    Всего
                  </div>
                </TableHead>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((row) => (
                <TableRow key={row.id} className="h-6">
                  <TableCell className="border border-gray-300 px-1 py-1">{row.discipline}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.credits}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.direction}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.group}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.budgetStudents}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.contractStudents}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.totalStudents}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.semester}</TableCell>
                  {/* Аудиторные занятия */}
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.lectures}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.practice}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.laboratory}</TableCell>
                  {/* Консультации и контроль */}
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.consultations}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.rgz}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.kr}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.vkr}</TableCell>
                  {/* Руководство */}
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.magistracy}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.seminar}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.postgraduate}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.practiceSupervision}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.oop}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.secretaryGAK}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.consultationPhD}</TableCell>
                  {/* Посещение занятий ППС */}
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.attendance}</TableCell>
                  <TableCell className="text-center font-semibold border border-gray-300">{row.totalWorkload}</TableCell>
                  {/* Почасовой фонд */}
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.audHours}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.nonAudHours}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.vkrReview}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.overviewLectures}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.gakParticipation}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.postgraduateExams}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.phdExams}</TableCell>
                  <TableCell className="text-center border border-gray-300 px-1 py-1">{row.internSupervision}</TableCell>
                  <TableCell className="text-center font-semibold border border-gray-300">{row.totalHours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
    
  );
};
