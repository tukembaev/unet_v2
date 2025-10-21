import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "shared/ui/card";
import { Skeleton } from "shared/ui/skeleton";

import { SyllabusRoot } from "entities/education-management/model/types";
import { getSyllabusReport } from "entities/education-management/model/api";
import { SyllabusTable } from "./SyllabusTable";

export const SyllabusReport = () => {
  const { syllabusId, profileId } = useParams();
  const [data, setData] = useState<SyllabusRoot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!syllabusId || !profileId) return;
    getSyllabusReport(Number(syllabusId), Number(profileId))
      .then(setData)
      .finally(() => setLoading(false));
  }, [syllabusId, profileId]);

  if (loading) return <Skeleton className="h-64 w-full" />;
  if (!data) return <p>Ошибка загрузки данных</p>;

  const semester = data.semesters?.[0]; // берём 1 семестр для примера
  console.log(semester);
  return (
    <Card className="max-w-full border-none shadow-none">
      <CardContent className="space-y-6">
        <div className="text-sm leading-6">
          <p>
            <b>Направление:</b> {data.direction}
          </p>
          <p>
            <b>Профиль:</b> {data.profile}
          </p>
          <p>
            <b>Форма обучения:</b> {data.form_education}
          </p>
          <p>
            <b>Нормативный срок:</b> {data.duration} года
          </p>
          <p>
            <b>Для набора:</b> {data.start_year}-{data.end_year} учебного года
          </p>
        </div>

        {semester ? (
          <>
            <p className="font-semibold text-sm">
              Семестр {semester.name_semester}
            </p>
            <SyllabusTable semester={semester} />
          </>
        ) : (
          <p>Нет данных по семестрам</p>
        )}
      </CardContent>
    </Card>
  );
};
