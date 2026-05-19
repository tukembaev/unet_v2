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
import { AlertCircle, BookDown } from "lucide-react";
import { FormQuery, getHttpErrorMessage, useFormNavigation } from "shared/lib";
import { useAppendSemester, useDeleteSemester } from "entities/curriculum/model/queries";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import type { SyllabusSemester } from "entities/education-management/model/types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "shared/ui";
import { useNavigate, useSearchParams } from "react-router-dom";

export interface SyllabusPlanContentProps {
  data: SyllabusRoot;
  /** Роль для кнопок редактирования таблицы */
  role?: "admin" | "user" | string;
  /** Показывать блок «добавить семестр» (админ) */
  showAddSemesterEmpty?: boolean;
  /** Удаление семестра (только учебный план, не отчёты) */
  allowDeleteSemester?: boolean;
}

/**
 * Общий блок отображения РУП: шапка + таблицы семестров + диалоги.
 * Используется на странице отчёта и на карточке РУП из раздела «Учебный план».
 */
export function SyllabusPlanContent({
  data,
  role = "user",
  showAddSemesterEmpty = true,
  allowDeleteSemester = true,
}: SyllabusPlanContentProps) {
  const openForm = useFormNavigation();
  const appendSemester = useAppendSemester();
  const deleteSemester = useDeleteSemester(data.id);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [semesterToDelete, setSemesterToDelete] = useState<SyllabusSemester | null>(
    null
  );
  const semesters = data.semesters ?? [];
  const reasonReject = data.reason_reject?.trim() ?? "";

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

  const handleConfirmDeleteSemester = async () => {
    if (!semesterToDelete) return;
    try {
      await deleteSemester.mutateAsync(semesterToDelete.id);
      toast.success(`Семестр «${semesterToDelete.name_semester}» удалён`);
      setSemesterToDelete(null);
    } catch (e) {
      toast.error(getHttpErrorMessage(e, "Не удалось удалить семестр"));
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
              <b>Профиль:</b> {data.profile.map((p) => p).join(', ')}
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

        {reasonReject ? (
          <div className="flex gap-2 rounded-lg border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-800 dark:text-rose-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <div>
              <p className="font-semibold">Причина доработки</p>
              <p className="mt-1 whitespace-pre-wrap">{reasonReject}</p>
            </div>
          </div>
        ) : null}

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
                  onDeleteSemester={
                    allowDeleteSemester
                      ? () => setSemesterToDelete(s)
                      : undefined
                  }
                  isDeletingSemester={
                    allowDeleteSemester &&
                    deleteSemester.isPending &&
                    semesterToDelete?.id === s.id
                  }
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

        {allowDeleteSemester ? (
        <Dialog
          open={semesterToDelete != null}
          onOpenChange={(open) => !open && setSemesterToDelete(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Удалить семестр?</DialogTitle>
              <DialogDescription>
                {semesterToDelete ? (
                  <>
                    Будет удалён семестр «{semesterToDelete.name_semester}» и все
                    связанные дисциплины. Это действие нельзя отменить.
                  </>
                ) : null}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSemesterToDelete(null)}
                disabled={deleteSemester.isPending}
              >
                Отмена
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => void handleConfirmDeleteSemester()}
                disabled={deleteSemester.isPending}
              >
                {deleteSemester.isPending ? "Удаление..." : "Удалить"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        ) : null}
      </CardContent>
    </Card>
  );
}
