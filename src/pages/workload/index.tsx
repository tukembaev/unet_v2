import { EducationManagementTabsShell } from "entities/education-management/ui/EducationManagementTabsShell";

/** URL `/education/workload` — приоритет вкладки «Нагрузка». */
export default function WorkloadPage() {
  return (
    <EducationManagementTabsShell
      prefer="workload"
      description="Нагрузка — КГТУ им. И. Раззакова"
    />
  );
}
