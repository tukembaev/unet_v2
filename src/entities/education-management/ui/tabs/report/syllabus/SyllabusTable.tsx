import {
  SyllabusCourse,
  SyllabusSemester,
} from "entities/education-management/model/types";
import { CourseEditDialog } from "features/syllabus/index";
import { Plus } from "lucide-react";
import { Fragment, ReactNode, useCallback, useState } from "react";
import { FormQuery, useFormNavigation } from "shared/lib";
import { cn } from "shared/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "shared/ui";
import { SyllabusTotalsRows } from "./SyllabusTotalsRows";
import { SyllabusTableColumnHeaders } from "./SyllabusTableColumnHeaders";

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
      className={cn(
        "hover:bg-muted/30 border-b border-border",
        role === "admin" && "cursor-pointer"
      )}
      onClick={() => {
        if (role !== "admin") return;
        openEditor(course);
      }}
    >
      {indexCell}
      <TableCell className="py-2 px-3 border-r border-border">{course.code ?? "—"}</TableCell>
      <TableCell className="py-2 px-3 border-r border-border">{course.name_subject}</TableCell>
      <TableCell className="py-2 px-3 border-r border-border">{course.dep}</TableCell>
      <TableCell className="py-2 px-3 border-r border-border">{course.cycle ?? ""}</TableCell>
      <TableCell className="py-2 px-3 border-r border-border">{course.course_type}</TableCell>
      <TableCell className="py-2 px-3 border-r border-border">{course.control_form}</TableCell>
      <TableCell className="py-2 px-3 border-r border-border">
        {course.control_type?.trim() ? course.control_type : "—"}
      </TableCell>
      <TableCell className="py-2 px-3 border-r border-border">{course.credit}</TableCell>
      <TableCell className="py-2 px-3 border-r border-border">{course.amount_hours}</TableCell>
      <TableCell className="py-2 px-3 border-r border-border">{course.lecture_hours}</TableCell>
      <TableCell className="py-2 px-3 border-r border-border">{course.practice_hours}</TableCell>
      <TableCell className="py-2 px-3">{course.lab_hours}</TableCell>
    </TableRow>
  );

  return (
    <>
      <div className="w-full overflow-x-auto">
        <Table className="w-full min-w-[960px] text-[11px] leading-tight border border-border rounded-none">
          <SyllabusTableColumnHeaders />

          <TableBody>
          {/* Semester heading inside the table */}
          <TableRow className="border-b border-border">
            <TableCell colSpan={13} className="py-2 px-3 bg-muted/50 text-center font-medium text-base border-r-0">
              {semester.name_semester} — семестр
            </TableCell>
          </TableRow>
          <TableRow className="border-b border-border">
            <TableCell colSpan={13} className="py-2 px-3 border-r-0">
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
              <TableCell colSpan={13} className="py-2 px-3 border-r-0">
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
              <TableCell colSpan={13} className="py-2 px-3 bg-accent/30 text-center border-r-0">
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
                    <TableCell colSpan={13} className="py-2 px-3 border-r-0">
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
              <TableCell colSpan={13} className="py-2 px-3 border-r-0">
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
                  <TableCell colSpan={13} className="py-2 px-3 bg-muted/30 text-center font-medium border-r-0">
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
                          <TableCell colSpan={13} className="py-2 px-3 border-r-0">
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
                    <TableCell colSpan={13} className="py-2 px-3 border-r-0">
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

          <SyllabusTotalsRows
            sectionTitle="Отчёт по семестру"
            totals={{
              count_credit: semester.count_credit,
              amount_hours: semester.amount_hours,
              lecture_hours: semester.lecture_hours,
              practice_hours: semester.practice_hours,
              lab_hours: semester.lab_hours,
            }}
            variant="semester"
          />
          </TableBody>
        </Table>
      </div>

      <CourseEditDialog course={selected} />
    </>
  );
};
