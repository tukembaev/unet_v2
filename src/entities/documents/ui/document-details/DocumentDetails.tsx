import PageHeader from "widgets/page-header/page-header";
import { ApprovalParticipant } from "./approval-chain/DocumentApprovalFlow";
import DocumentDetailsSkeleton from "./DocumentDetailsSkeleton";
import PdfViewer from "shared/components/pdf-viewer/PdfViewer";
import DocFileCard from "./tabs/DocFileCard";
import DocumentTabsCard from "./tabs/DocumentTabsCard";
import { useDocumentHistory } from "../../model/queries";
import { useState, useEffect } from "react";
import { Badge, Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "shared/ui";
import { ClipboardList, ExternalLink, LucideCookie } from "lucide-react";
import { FormQuery, useFormNavigation } from "shared/lib";

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

// Моковые данные задачи (если есть)
const mockTask = {
  id: "TSK-2024-001",
  name: "Согласование заявления на отпуск",
  status: "В процессе" as const,
  taskId: 12345
};

const DocumentDetails = () => {
  // TODO: Получить documentId из URL params или props
  // Для примера используем hardcoded ID
  const documentId = 1395;

  // Simulate loading state
  const [isLoading, setIsLoading] = useState(true);
  const { data: history, isLoading: isHistoryLoading } = useDocumentHistory(documentId);
  const openForm = useFormNavigation();

  // Моковые данные для создания задачи
  const mockDocumentData = {
    name: "Заявление на отпуск с 01.11.2025 по 15.11.2025",
    doc_id: documentId.toString(),
    type: "Заявление на отпуск"
  };

  const handleApprove = () => {
    // TODO: Implement approve logic
    console.log("Document approved");
  };

  const handleReject = () => {
    // TODO: Implement reject logic
    console.log("Document rejected");
  };

  const handleTaskClick = () => {
    // TODO: Navigate to task details
    console.log("Navigate to task:", mockTask.taskId);
  };

  const handleCreateTask = () => {
    // Открываем диалог создания задачи с передачей данных документа
    console.log("Opening create task dialog with data:", {
      documentName: mockDocumentData.name,
      doc_id: mockDocumentData.doc_id,
      documentType: mockDocumentData.type
    });
    
    openForm(FormQuery.CREATE_TASK, {
      documentName: mockDocumentData.name,
      doc_id: mockDocumentData.doc_id,
      documentType: mockDocumentData.type
    });
  };

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
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={'outline'} onClick={handleCreateTask}>
                <LucideCookie />
                Сформировать задачу
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Сформировать задачу на основе этого документа</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PageHeader>



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
        {/* Left side - Task card + PDF Viewer (50% на десктопе) */}
        <div className="w-full space-y-4">
          {/* Карточка задачи выше PDF */}
          {mockTask && (
            <div 
              onClick={handleTaskClick}
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-sm transition-all duration-200 bg-background cursor-pointer group"
            >
              <ClipboardList className="h-5 w-5 text-primary shrink-0" />
              <div className="space-y-1 min-w-0 flex-1">
                <p className="font-medium text-base">{mockTask.name}</p>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-sm">
                    {mockTask.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">ID: #{mockTask.taskId}</span>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
            </div>
          )}
          
          {/* PDF Viewer */}
          <PdfViewer url="https://utask.kstu.kg/media/media/zayavki/order_iEWwAIU.pdf" />
        </div>

        {/* Right side - Cards (50% на десктопе) */}
        <div className="w-full space-y-4 md:space-y-6">
          <DocumentTabsCard 
            participants={mockParticipants}
            history={history}
            isHistoryLoading={isHistoryLoading}
            onApprove={handleApprove}
            onReject={handleReject}
          />
          <DocFileCard />
     
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
