import { Tabs } from "shared/ui";
import { PageHeader } from "widgets/page-header";
import { EducationManagementTabsList, EducationManagementTabsContent } from "entities/education-management/ui/tabs";

const EducationManagementPage = () => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="families" className="w-full">
        <PageHeader
          title="Учебное управление"
          description="Кыргызский Государственный Технический Университет имени И.Раззакова"
        >
          <EducationManagementTabsList />
        </PageHeader>
        
        <EducationManagementTabsContent />
      </Tabs>
    </div>
  );
};

export default EducationManagementPage;
