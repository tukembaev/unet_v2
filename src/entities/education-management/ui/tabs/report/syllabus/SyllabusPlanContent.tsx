import { Card, CardContent } from "shared/ui/card";
import {
  Empty,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "shared/ui";
import type { SyllabusRoot } from "entities/education-management/model/types";
import { SyllabusTable } from "./SyllabusTable";
import { SyllabusGrandTotalTable } from "./SyllabusGrandTotalTable";
import { CreateElectiveDialog, CreateCourseDialog, ManageProfilesDialog } from "features/syllabus/index";
import { BookDown } from "lucide-react";
import { FormQuery, getHttpErrorMessage, useFormNavigation } from "shared/lib";
import { useAppendSemester } from "entities/curriculum/model/queries";
import { toast } from "sonner";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export interface SyllabusPlanContentProps {
  data: SyllabusRoot;
  /** Роль для кнопок редактирования таблицы */
  role?: "admin" | "user" | string;
  /** Показывать блок «добавить семестр» (админ) */
  showAddSemesterEmpty?: boolean;
}

/**
 * Общий блок отображения РУП: шапка + таблицы семестров + диалоги.
 * Используется на странице отчёта и на карточке РУП из раздела «Учебный план».
 */
export function SyllabusPlanContent({
  data,
  role = "user",
  showAddSemesterEmpty = true,
}: SyllabusPlanContentProps) {
  const openForm = useFormNavigation();
  const appendSemester = useAppendSemester();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const semesters = data.semesters ?? [];

  const handleAddSemester = async () => {
    try {
      await appendSemester.mutateAsync({
        syllabusId: data.id,
      });
      toast.success("Семестр добавлен");
    } catch (e) {
      toast.error(getHttpErrorMessage(e, "Не удалось добавить семестр"));
    }
  };

  useEffect(() => {
    if (!searchParams.has("courseId")) return;
    const params = new URLSearchParams(searchParams);
    params.delete("courseId");
    navigate(`?${params.toString()}`, { replace: true });
  }, [navigate, searchParams]);

  return (
    <Card className="max-w-full border-none shadow-none">
      <CardContent className="space-y-6">
        <div
          className="text-center text-sm mb-4"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <p className="text-[12px] mb-1">
            Министерство образования и науки Кыргызской Республики
          </p>
          <p className="text-[12px] mb-2">
            Кыргызский государственный технический университет им. И.Раззакова
          </p>
          <p className="text-base font-bold uppercase tracking-wide">РАБОЧИЙ УЧЕБНЫЙ ПЛАН</p>
        </div>

        <div
          className="grid grid-cols-3 gap-6 text-[14px] leading-6"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <div>
            <p className="font-semibold mb-2">Утверждаю:</p>
            <p>Проректор по</p>
            <p>академической работе</p>
          </div>
          <div className="text-center space-y-1">
            <p>
              <b>Направление:</b> {data.direction}
            </p>
            <p>
              <b>Профиль:</b> {data.profile}
            </p>
            <p>
              <b>Квалификация:</b> {data.level_education}
            </p>
            <p>
              <b>Нормативный срок обучения:</b> {data.duration} года
            </p>
            <p>
              <b>Форма обучения:</b> {data.form_education}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold mb-2">Для набора с:</p>
            <p>
              {data.start_year} - {data.end_year} учебного года
            </p>
          </div>
        </div>
        {role === "admin" && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => openForm(FormQuery.MANAGE_PROFILES)}
              className="px-3 py-2 text-xs border border-border rounded-md hover:bg-accent"
            >
              Управление профилями семестров
            </button>
          </div>
        )}

        {semesters.length > 0 ? (
          <div className="space-y-4">
            {semesters.map((s) => (
              <div
                key={s.id}
                className="rounded-lg overflow-hidden border border-border"
              >
                <SyllabusTable
                  semester={s}
                  role={role}
                  onAddCourse={(profileId) =>
                    openForm(FormQuery.CREATE_COURSE, {
                      semesterId: s.id.toString(),
                      profile: profileId == null ? "null" : String(profileId),
                    })
                  }
                  onAddElective={(group, profileId) =>
                    openForm(FormQuery.CREATE_ELECTIVE, {
                      semesterId: s.id.toString(),
                      group: group == null ? "null" : String(group),
                      profile: profileId == null ? "null" : String(profileId),
                    })
                  }
                />
              </div>
            ))}

            <div className="rounded-lg overflow-hidden border border-border bg-card">
              <SyllabusGrandTotalTable semesters={semesters} />
            </div>
          </div>
        ) : (
          <p>Нет данных по семестрам</p>
        )}

        {showAddSemesterEmpty && role === "admin" && (
          <Empty className="border border-dashed border-border bg-background rounded-lg">
            <EmptyContent>
              <EmptyMedia variant="icon">
                <BookDown size={24} />
              </EmptyMedia>
              <EmptyTitle>Добавить новый семестр</EmptyTitle>
              <EmptyDescription>
                Нажмите кнопку ниже, чтобы добавить новый семестр к учебному
                плану
              </EmptyDescription>
              <button
                type="button"
                onClick={() => void handleAddSemester()}
                disabled={appendSemester.isPending}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
              >
                Создать семестр
              </button>
            </EmptyContent>
          </Empty>
        )}
        {role === "admin" ? (
          <>
            <CreateCourseDialog />
            <CreateElectiveDialog />
            <ManageProfilesDialog
              semesters={semesters}
              directionId={data.id}
            />
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
