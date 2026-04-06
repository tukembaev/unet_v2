import { useMemo } from 'react';
import { PageHeader } from 'widgets/page-header';
import { DepartmentDisciplinesContent } from 'entities/department-discipline';
import { useCurrentUser } from 'entities/user/model/queries';

const DepartmentDisciplinesPage = () => {
  const { data: me } = useCurrentUser();
  const departmentLabel = useMemo(() => {
    const active = me?.employee_profile?.employments?.find((e) => e.is_active);
    return active?.organization_name ?? 'кафедра';
  }, [me]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Дисциплины кафедры"
        description={`Подразделение: «${departmentLabel}». Создание и редактирование дисциплин кафедры.`}
      />
      <DepartmentDisciplinesContent />
    </div>
  );
};

export default DepartmentDisciplinesPage;
