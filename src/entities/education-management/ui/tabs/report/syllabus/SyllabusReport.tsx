import { useParams } from "react-router-dom";

import { useSyllabusReport } from "entities/education-management/model/queries";
import { SyllabusReportSkeleton } from "./SyllabusReportSkeleton";
import { SyllabusPlanContent } from "./SyllabusPlanContent";

export const SyllabusReport = () => {
  const { syllabusId, profileId } = useParams();
  const role = "admin"; // mock

  const { data, isLoading, isError } = useSyllabusReport(
    syllabusId ? Number(syllabusId) : undefined,
    profileId ? Number(profileId) : undefined
  );

  if (isLoading) return <SyllabusReportSkeleton />;
  if (isError || !data) return <p>Ошибка загрузки данных</p>;

  return <SyllabusPlanContent data={data} role={role} showAddSemesterEmpty />;
};
