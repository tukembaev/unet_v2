import PageHeader from "widgets/page-header/page-header";
import DocumentApprovalFlow, {
  ApprovalParticipant,
} from "./approval-chain/DocumentApprovalFlow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "shared/ui";
import { ClipboardList, FileText, History } from "lucide-react";
import PdfViewer from "shared/components/pdf-viewer/PdfViewer";
import DocFileCard from "./tabs/DocFileCard";
import DocTaskSection from "./tabs/DocTaskSection";
import { Separator } from "shared/ui/separator";
import DocumentHistory from "./tabs/DocumentHistory";
import { useState } from "react";

// Моковые данные участников подписания документа
const mockParticipants: ApprovalParticipant[] = [
  {
    id: "1",
    name: "Иванов Иван Иванович",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan",
    role: "Отправитель",
    isSigned: true,
  },
  {
    id: "2",
    name: "Петров Петр Петрович",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Petr",
    role: "Согласующий",
    isSigned: true,
  },
  {
    id: "3",
    name: "Сидорова Мария Александровна",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    role: "Согласующий",
    isSigned: false,
    rejectionReason: "Необходимо уточнить пункт 3.2 договора",
  },
  {
    id: "4",
    name: "Козлов Алексей Сергеевич",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexey",
    role: "Согласующий",
    isSigned: false,
  },
  {
    id: "5",
    name: "Смирнова Елена Викторовна",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    role: "Получатель",
    isSigned: false,
  },
];

const DocumentDetails = () => {
  const [activeTab, setActiveTab] = useState("pdf");
  // const;
  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="Детали документа"
        description="Просмотр процесса согласования и подписания документа"
      />
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-3 w-fit">
          <TabsTrigger value="pdf">
            <FileText className="w-4 h-4 mr-2" /> Документ
          </TabsTrigger>
          <TabsTrigger value="card">
            <ClipboardList className="w-4 h-4 mr-2" /> Карточка
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <History className="w-4 h-4 mr-2" /> Задачи
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pdf">
          <PdfViewer url="https://utask.kstu.kg/media/media/zayavki/order_iEWwAIU.pdf" />
        </TabsContent>

        <TabsContent value="card">
          <DocFileCard />
        </TabsContent>

        <TabsContent value="tasks">
          <DocTaskSection />
        </TabsContent>
      </Tabs>

      <Separator />

      <DocumentHistory />

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-6">Цепочка согласования</h2>
        <DocumentApprovalFlow participants={mockParticipants} />
      </div>
    </div>
  );
};

export default DocumentDetails;
