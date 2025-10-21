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

interface Props {
  semester: SyllabusSemester;
}

export const SyllabusTable = ({ semester }: Props) => {
  // Основные курсы
  const mainCourses = semester.courses ?? [];

  // Элективные курсы (разворачиваем и объединяем в один массив)
  const electiveCourses = semester.elective_course
    ? semester.elective_course.flat()
    : [];

  // Объединяем в один список, сначала основные, потом элективные
  const allCourses: SyllabusCourse[] = [...mainCourses, ...electiveCourses];

  return (
    <Table className="text-xs border">
      <TableHeader className="bg-muted">
        <TableRow>
          <TableHead className="w-8 text-center">№</TableHead>
          <TableHead>Код дисциплины</TableHead>
          <TableHead>Наименование предмета</TableHead>
          <TableHead>Кафедра</TableHead>
          <TableHead>Цикл</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Форма контроля</TableHead>
          <TableHead>Кредит</TableHead>
          <TableHead>Всего ауд.</TableHead>
          <TableHead>Лек.</TableHead>
          <TableHead>Пр.</TableHead>
          <TableHead>Лаб.</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {mainCourses.map((c, i) => (
          <TableRow key={c.id}>
            <TableCell className="text-center">{i + 1}</TableCell>
            <TableCell>{c.code}</TableCell>
            <TableCell>{c.name_subject}</TableCell>
            <TableCell>{c.dep}</TableCell>
            <TableCell>{c.cycle}</TableCell>
            <TableCell>{c.course_type}</TableCell>
            <TableCell>{c.control_form}</TableCell>
            <TableCell>{c.credit}</TableCell>
            <TableCell>{c.amount_hours}</TableCell>
            <TableCell>{c.lecture_hours}</TableCell>
            <TableCell>{c.practice_hours}</TableCell>
            <TableCell>{c.lab_hours}</TableCell>
          </TableRow>
        ))}

        {electiveCourses.map((c, i) => (
          <TableRow key={c.id}>
            <TableCell className="text-center">
              {mainCourses.length + 1}
            </TableCell>
            <TableCell>{c.code}</TableCell>
            <TableCell>{c.name_subject}</TableCell>
            <TableCell>{c.dep}</TableCell>
            <TableCell>{c.cycle}</TableCell>
            <TableCell>{c.course_type}</TableCell>
            <TableCell>{c.control_form}</TableCell>
            <TableCell>{c.credit}</TableCell>
            <TableCell>{c.amount_hours}</TableCell>
            <TableCell>{c.lecture_hours}</TableCell>
            <TableCell>{c.practice_hours}</TableCell>
            <TableCell>{c.lab_hours}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
