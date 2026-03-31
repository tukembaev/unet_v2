import {
  SyllabusCourse,
  SyllabusSemester,
} from "entities/education-management/model/types";
import { CourseEditDialog } from "features/syllabus/index";
import { Plus } from "lucide-react";
import { Fragment, ReactNode, useCallback, useState } from "react";
import { FormQuery, useFormNavigation } from "shared/lib";
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
  role?: "admin" | "user" | string;
  onAddCourse?: (profileId?: number | null) => void;
  onAddElective?: (group: string | null, profileId?: number | null) => void;
}

export const SyllabusTable = ({
  semester,
  role = "user",
  onAddCourse,
  onAddElective,
}: Props) => {
  const openForm = useFormNavigation();
  const [selected, setSelected] = useState<SyllabusCourse | null>(null);

  const mainCourses = semester.courses ?? [];
  const electiveGroups = semester.elective_course ?? [];

  let rowIndex = 1;

  const openEditor = useCallback((course: SyllabusCourse) => {
    setSelected(course);
    openForm(
      FormQuery.EDIT_COURSE,
      { courseId: course.id.toString() },
      { syncUrl: false }
    );
  }, [openForm]);

  const renderCourseRow = (course: SyllabusCourse, indexCell?: ReactNode) => (
    <TableRow
      key={course.id}
      className="hover:bg-muted/30 cursor-pointer border-b border-border"
      onClick={() => openEditor(course)}
    >
      {indexCell}
      <TableCell className="py-2 px-3 border-r border-border">{course.code ?? "—"}</TableCell>
      <TableCell className="py-2 px-3 border-r border-border">{course.name_subject}</TableCell>
      <TableCell className="py-2 px-3 border-r border-border">{course.dep}</TableCell>
      <TableCell className="py-2 px-3 border-r border-border">{course.cycle ?? ""}</TableCell>
      <TableCell className="py-2 px-3 border-r border-border">{course.course_type}</TableCell>
      <TableCell className="py-2 px-3 border-r border-border">{course.control_form}</TableCell>
      <TableCell className="py-2 px-3 border-r border-border">{course.credit}</TableCell>
      <TableCell className="py-2 px-3 border-r border-border">{course.amount_hours}</TableCell>
      <TableCell className="py-2 px-3 border-r border-border">{course.lecture_hours}</TableCell>
      <TableCell className="py-2 px-3 border-r border-border">{course.practice_hours}</TableCell>
      <TableCell className="py-2 px-3">{course.lab_hours}</TableCell>
    </TableRow>
  );

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
          <TableRow className="border-b border-border">
            <TableCell colSpan={12} className="py-2 px-3 border-r-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Профили:</span>
                {(semester.profiles_name ?? []).length > 0 ? (
                  semester.profiles_name?.map((profile) => (
                    <span
                      key={`${semester.id}:${profile.id}`}
                      className="inline-flex rounded-md bg-muted px-2 py-1 text-[11px]"
                    >
                      {profile.title}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">не добавлены</span>
                )}
              </div>
            </TableCell>
          </TableRow>

          {mainCourses.map((c) => {
            const currentIndex = rowIndex++;
            return renderCourseRow(
              c,
              <TableCell className="text-center py-2 px-3 border-r border-border">{currentIndex}</TableCell>
            );
          })}

          {role === "admin" && (
            <TableRow className="border-b border-border">
              <TableCell colSpan={12} className="py-2 px-3 border-r-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddCourse?.(null);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-accent/30 transition-colors group"
                >
                  <Plus size={16} className="text-muted-foreground group-hover:text-primary" />
                  <span className="text-xs text-muted-foreground group-hover:text-primary font-medium">
                    Добавить предмет
                  </span>
                </button>
              </TableCell>
            </TableRow>
          )}

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
            const groupId = group[0]?.group ?? null;
            return (
              <Fragment key={`group-${groupId ?? groupIndex}`}>
                {group.map((c, idx) => (
                  renderCourseRow(
                    c,
                    idx === 0 ? (
                      <TableCell rowSpan={group.length} className="text-center align-top py-2 px-3 border-r border-border">
                        {groupIndex}
                      </TableCell>
                    ) : undefined
                  )
                ))}

                {role === "admin" && (
                  <TableRow className="border-b border-border">
                    <TableCell colSpan={12} className="py-2 px-3 border-r-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddElective?.(groupId, null);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-accent/30 transition-colors group"
                      >
                        <Plus size={16} className="text-muted-foreground group-hover:text-primary" />
                        <span className="text-xs text-muted-foreground group-hover:text-primary font-medium">
                          Добавить предмет по выбору в эту группу
                        </span>
                      </button>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}

          {/* Add new elective group */}
          {role === "admin" && (
            <TableRow className="border-b border-border">
              <TableCell colSpan={12} className="py-2 px-3 border-r-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddElective?.(null, null);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-accent/30 transition-colors group"
                >
                  <Plus size={16} className="text-muted-foreground group-hover:text-primary" />
                  <span className="text-xs text-muted-foreground group-hover:text-primary font-medium">
                    Добавить новую группу предметов по выбору
                  </span>
                </button>
              </TableCell>
            </TableRow>
          )}

          {(semester.profiles_name ?? []).map((profileBlock) => {
            const profileCourses = profileBlock.courses ?? [];
            const profileElectives = profileBlock.elective_courses ?? [];
            let profileRowIndex = 1;

            return (
              <Fragment key={`profile-${profileBlock.id}`}>
                <TableRow className="border-b border-border">
                  <TableCell colSpan={12} className="py-2 px-3 bg-muted/30 text-center font-medium border-r-0">
                    {profileBlock.title}
                  </TableCell>
                </TableRow>

                {profileCourses.map((course) => {
                  const currentIndex = profileRowIndex++;
                  return renderCourseRow(
                    course,
                    <TableCell className="text-center py-2 px-3 border-r border-border">{currentIndex}</TableCell>
                  );
                })}

                {profileElectives.map((group) => {
                  if (!group || group.length === 0) return null;
                  const groupIndex = profileRowIndex++;
                  const groupId = group[0]?.group ?? null;
                  return (
                    <Fragment key={`profile-group-${profileBlock.id}-${groupId ?? groupIndex}`}>
                      {group.map((course, idx) =>
                        renderCourseRow(
                          course,
                          idx === 0 ? (
                            <TableCell rowSpan={group.length} className="text-center align-top py-2 px-3 border-r border-border">
                              {groupIndex}
                            </TableCell>
                          ) : undefined
                        )
                      )}
                      {role === "admin" && (
                        <TableRow className="border-b border-border">
                          <TableCell colSpan={12} className="py-2 px-3 border-r-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddElective?.(groupId, profileBlock.id);
                              }}
                              className="w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-accent/30 transition-colors group"
                            >
                              <Plus size={16} className="text-muted-foreground group-hover:text-primary" />
                              <span className="text-xs text-muted-foreground group-hover:text-primary font-medium">
                                Добавить предмет по выбору в эту группу профиля
                              </span>
                            </button>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })}

                {role === "admin" && (
                  <TableRow className="border-b border-border">
                    <TableCell colSpan={12} className="py-2 px-3 border-r-0">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddCourse?.(profileBlock.id);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-accent/30 transition-colors group"
                        >
                          <Plus size={16} className="text-muted-foreground group-hover:text-primary" />
                          <span className="text-xs text-muted-foreground group-hover:text-primary font-medium">
                            Добавить предмет в профиль
                          </span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddElective?.(null, profileBlock.id);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-accent/30 transition-colors group"
                        >
                          <Plus size={16} className="text-muted-foreground group-hover:text-primary" />
                          <span className="text-xs text-muted-foreground group-hover:text-primary font-medium">
                            Добавить новую группу по выбору в профиль
                          </span>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}

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

      <CourseEditDialog course={selected} />
    </>
  );
};
