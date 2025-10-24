import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "shared/ui/card";
import { Skeleton } from "shared/ui/skeleton";
import { Empty, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from "shared/ui";

import { useSyllabusReport } from "entities/education-management/model/queries";
import { SyllabusTable } from "./SyllabusTable";
import { CreateSemesterDialog, CreateElectiveDialog } from "features/syllabus/index";
import { BookDown } from "lucide-react";

export const SyllabusReport = () => {
  const { syllabusId, profileId } = useParams();
  const role = "admin"; // mock
  const [createOpen, setCreateOpen] = useState(false);
  const [createElectiveOpen, setCreateElectiveOpen] = useState(false);

  const { data, isLoading, isError } = useSyllabusReport(
    syllabusId ? Number(syllabusId) : undefined,
    profileId ? Number(profileId) : undefined
  );

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (isError || !data) return <p>Ошибка загрузки данных</p>;

  const semesters = data.semesters ?? [];
  return (
    <Card className="max-w-full border-none shadow-none">
      <CardContent className="space-y-6">
        {/* Ministry header */}
        <div className="text-center text-sm mb-4">
          <p className="text-xs mb-1">Министерство образования и науки Кыргызской Республики</p>
          <p className="text-xs text-primary mb-2">Кыргызский государственный технический университет им. И.Раззакова</p>
          <p className="text-sm font-bold mb-3">РАБОЧИЙ УЧЕБНЫЙ ПЛАН</p>
        </div>

        {/* Header block similar to the image */}
        <div className="text-[13px] leading-6 grid grid-cols-3 gap-4">
          <div>
            <p className="font-semibold mb-2">Утверждаю:</p>
            <p>Проектор по</p>
            <p>академической работе</p>
          </div>
          <div className="text-center space-y-1">
            <p><b>Направление:</b> {data.direction}</p>
            <p><b>Профиль:</b> {data.profile}</p>
            <p><b>Квалификация:</b> Бакалавр</p>
            <p><b>Нормативный срок обучения:</b> {data.duration} года</p>
            <p><b>Форма обучения:</b> {data.form_education}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold mb-2">Для набора с :</p>
            <p>{data.start_year} - {data.end_year} учебного года</p>
          </div>
        </div>

        {semesters.length > 0 ? (
          <div className="space-y-4">
            {semesters.map((s) => (
              <div key={s.id} className="rounded-lg overflow-hidden border border-border">
                <SyllabusTable semester={s} role={role} onAddElective={() => setCreateElectiveOpen(true)} />
              </div>
            ))}
          </div>
        ) : (
          <p>Нет данных по семестрам</p>
        )}

        {/* Empty state for adding new semester */}
        {role === "admin" && (
          <Empty className="border border-dashed border-border bg-background rounded-lg">
            <EmptyContent>
            <EmptyMedia variant="icon">
              <BookDown size={24} />
        </EmptyMedia>
              <EmptyTitle>Добавить новый семестр</EmptyTitle>
              <EmptyDescription>
                Нажмите кнопку ниже, чтобы добавить новый семестр к учебному плану
              </EmptyDescription>
              <button
                onClick={() => setCreateOpen(true)}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Создать семестр
              </button>
            </EmptyContent>
          </Empty>
        )}
        <CreateSemesterDialog open={createOpen} onOpenChange={setCreateOpen} />
        <CreateElectiveDialog open={createElectiveOpen} onOpenChange={setCreateElectiveOpen} />
      </CardContent>
    </Card>
  );
};
