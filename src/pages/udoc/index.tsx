import { PageHeader } from 'widgets/page-header';
import { UdocContent } from 'entities/udoc';

export default function UdocPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="UDOC"
        description="Рассылка приказов сотрудникам и подразделениям"
      />
      <UdocContent />
    </div>
  );
}
