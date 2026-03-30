import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge, Button } from "shared/ui";
import { PageHeader } from "widgets/page-header";
import { useSyllabusCourse } from "entities/curriculum/model/queries";
import {
  SyllabusPlanContent,
  SyllabusReportSkeleton,
} from "entities/education-management";
import { ROUTES } from "app/providers/routes";

/** Карточка одного РУП: данные GET /courses/{id}/ */
export function CurriculumDetailPage() {
  const { syllabusId } = useParams();
  const id = syllabusId ? Number(syllabusId) : undefined;
  const { data, isLoading, isError, error } = useSyllabusCourse(id);

  if (isLoading) {
    return <SyllabusReportSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to={ROUTES.CURRICULUM} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            К списку планов
          </Link>
        </Button>
        <p className="text-destructive">
          {error instanceof Error ? error.message : "Не удалось загрузить учебный план"}
        </p>
      </div>
    );
  }

  const statusLabel = data.status;

  return (
    <div className="space-y-6">
      <PageHeader
        title={data.direction}
        description={
          data.profile
            ? `${data.profile} · ${data.start_year}–${data.end_year} уч. г.`
            : `${data.start_year}–${data.end_year} уч. г.`
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          {statusLabel ? (
            <Badge variant="secondary">{statusLabel}</Badge>
          ) : null}
          <Button variant="outline" size="sm" asChild>
            <Link to={ROUTES.CURRICULUM} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Назад к списку
            </Link>
          </Button>
        </div>
      </PageHeader>

      <SyllabusPlanContent data={data} role="admin" showAddSemesterEmpty />
    </div>
  );
}
