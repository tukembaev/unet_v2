import { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { useSyllabusReport } from "entities/education-management/model/queries";
import { parseSyllabusProfileId } from "entities/education-management/lib/parse-profile-id";
import { getEducationManagementPath } from "entities/education-management/lib/use-education-tab-url";
import { getReportSyllabusPath } from "app/providers/routes";
import { Button } from "shared/ui";
import { SyllabusReportSkeleton } from "./SyllabusReportSkeleton";
import { SyllabusPlanContent } from "./SyllabusPlanContent";

type ReportLocationState = { returnTo?: string };

export const SyllabusReport = () => {
  const { syllabusId, profileId: profileIdParam } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const numericSyllabusId = syllabusId ? Number(syllabusId) : undefined;
  const profileId = parseSyllabusProfileId(profileIdParam);
  const role = "user";

  const returnTo =
    (location.state as ReportLocationState | null)?.returnTo ??
    getEducationManagementPath("reports");

  useEffect(() => {
    if (!numericSyllabusId || !Number.isFinite(numericSyllabusId)) return;
    if (profileIdParam == null) return;
    if (profileId != null) return;
    navigate(getReportSyllabusPath(numericSyllabusId), {
      replace: true,
      state: location.state,
    });
  }, [
    numericSyllabusId,
    profileId,
    profileIdParam,
    navigate,
    location.state,
  ]);

  const { data, isLoading, isError } = useSyllabusReport(
    numericSyllabusId,
    profileId
  );

  if (isLoading) return <SyllabusReportSkeleton />;

  if (isError || !data) {
    return (
      <div className="space-y-4 p-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to={returnTo} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            К отчётам
          </Link>
        </Button>
        <p className="text-destructive">Ошибка загрузки данных</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild className="ml-2 mt-2">
        <Link to={returnTo} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          К отчётам
        </Link>
      </Button>
      <SyllabusPlanContent
        data={data}
        role={role}
        showAddSemesterEmpty={false}
        allowDeleteSemester={false}
      />
    </div>
  );
};
