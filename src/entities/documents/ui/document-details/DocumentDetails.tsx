import PageHeader from "widgets/page-header/page-header";
import DocumentApprovalFlow, {
  ApprovalParticipant,
} from "./approval-chain/DocumentApprovalFlow";
import DocumentDetailsSkeleton from "./DocumentDetailsSkeleton";
import PdfViewer from "shared/components/pdf-viewer/PdfViewer";
import DocFileCard from "./tabs/DocFileCard";
import DocTaskSection from "./tabs/DocTaskSection";
import { Separator } from "shared/ui/separator";
import { GenericHistory } from "shared/components";
import { useDocumentHistory } from "../../model/queries";
import { useState, useEffect } from "react";

// Моковые данные участников подписания документа
const mockParticipants: ApprovalParticipant[] = [
  {
    id: "1",
    name: "Иванов Иван Иванович",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan",
    role: "Отправитель",
    isSigned: true,
    position: "Менеджер отдела",
    division: "Отдел кадров",
  },
  {
    id: "2",
    name: "Петров Петр Петрович",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Petr",
    role: "Согласующий",
    isSigned: true,
    position: "Начальник отдела",
    division: "Юридический отдел",
  },
  {
    id: "3",
    name: "Сидорова Мария Александровна",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    role: "Согласующий",
    isSigned: true,
    // rejectionReason: "Необходимо уточнить пункт 3.2 договора",
    position: "Главный бухгалтер",
    division: "Бухгалтерия",
  },
  {
    id: "4",
    name: "Козлов Алексей Сергеевич",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexey",
    role: "Согласующий",
    isSigned: false,
    rejectionReason: "Необходимо уточнить пункт 3.2 договора",

    position: "Заместитель директора",
    division: "Административный отдел",
  },
  {
    id: "5",
    name: "Крутой типчик",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    role: "Согласующий",
    isSigned: false,
    // rejectionReason: "Необходимо уточнить пункт 3.2 договора",

    position: "Директор",
    division: "Программное обеспечение компьютерных систем",
  },
  {
    id: "6",
    name: "Смирнова Елена Викторовна",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    role: "Получатель",
    isSigned: false,
    position: "Директор",
    division: "Программное обеспечение компьютерных систем",
  },
];

const DocumentDetails = () => {
  // TODO: Получить documentId из URL params или props
  // Для примера используем hardcoded ID
  const documentId = 1395;

  // Simulate loading state
  const [isLoading, setIsLoading] = useState(true);
  const { data: history, isLoading: isHistoryLoading } = useDocumentHistory(documentId);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DocumentDetailsSkeleton />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <PageHeader
        title="Детали документа"
        description="Просмотр процесса согласования и подписания документа"
      />

      {/* Секция описания документа */}
      <div className="space-y-3">
        <h2 className="text-lg  font-bold flex items-center gap-2">
    
          Описание документа
        </h2>
        <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
          Заявление на отпуск с 01.11.2025 по 15.11.2025. В связи с необходимостью личного отдыха прошу предоставить 
          ежегодный оплачиваемый отпуск продолжительностью 14 календарных дней. Все текущие проекты переданы коллегам 
          на период отсутствия. Контактная информация на случай срочной необходимости будет предоставлена.
        </p>
      </div>

      {/* Split layout: PDF слева, карточки справа */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Left side - PDF Viewer (50% на десктопе) */}
        <div className="w-full flex flex-col gap-4">
          <PdfViewer url="https://utask.kstu.kg/media/media/zayavki/order_iEWwAIU.pdf" />
          <DocumentApprovalFlow participants={mockParticipants} />
        </div>

        {/* Right side - Cards (50% на десктопе) */}
        <div className="w-full space-y-4 md:space-y-6">
          <DocFileCard />
          <DocTaskSection />
        </div>
      </div>

      <Separator className="my-6" />

      <GenericHistory
        history={history}
        isLoading={isHistoryLoading}
        title="История документа"
        emptyMessage="История отсутствует"
      />
    </div>
  );
};

export default DocumentDetails;
