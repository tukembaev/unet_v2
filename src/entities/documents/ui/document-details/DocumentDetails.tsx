import PageHeader from "widgets/page-header/page-header";
import { ApprovalParticipant } from "./approval-chain/DocumentApprovalFlow";
import DocumentDetailsSkeleton from "./DocumentDetailsSkeleton";
import PdfViewer from "shared/components/pdf-viewer/PdfViewer";
import DocFileCard from "./tabs/DocFileCard";
import DocumentTabsCard from "./tabs/DocumentTabsCard";
import { useDocumentDetails } from "../../model/queries";
import { useParams } from "react-router-dom";
import { Badge, Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "shared/ui";
import { LucideCookie } from "lucide-react";
import { FormQuery, useFormNavigation } from "shared/lib";
import { useMemo } from "react";
import { useUpdateDocumentStatus } from "features/create-document/model/queries";

const DocumentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const openForm = useFormNavigation();
  
  const { data: document, isLoading } = useDocumentDetails(id || '');
  const updateStatusMutation = useUpdateDocumentStatus();

  // Преобразуем members в формат ApprovalParticipant
  const participants: ApprovalParticipant[] = useMemo(() => {
    if (!document?.members) return [];
    
    return document.members.map((member) => ({
      id: member.id,
      name: `${member.sender_last_name} ${member.sender_first_name}`,
      photo: undefined,
      role: member.approve_name as ApprovalParticipant['role'],
      isSigned: member.status === 'approved',
      rejectionReason: member.reason_reject || undefined,
      isCurrent: member.turn,
      division: undefined,
      position: member.type_approval_name,
    }));
  }, [document?.members]);

  const handleApprove = async () => {
    if (!id) return;
    try {
      await updateStatusMutation.mutateAsync({
        id,
        payload: { status: 'Одобрено' },
      });
    } catch (error) {
      console.error('Error approving document:', error);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    try {
      await updateStatusMutation.mutateAsync({
        id,
        payload: { status: 'Отклонено' },
      });
    } catch (error) {
      console.error('Error rejecting document:', error);
    }
  };

  const handleCreateTask = () => {
    if (!document) return;
    
    openForm(FormQuery.CREATE_TASK, {
      documentName: document.title || 'Без названия',
      doc_id: document.id,
      documentType: document.type,
    });
  };

  if (isLoading) {
    return <DocumentDetailsSkeleton />;
  }

  if (!document) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Документ не найден</p>
        </div>
      </div>
    );
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

      {/* Информация о документе */}
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold">Информация о документе</h2>
          {document.status && (
            <Badge variant="outline">{document.status}</Badge>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">ID:</span> {document.id}
          </div>
          <div>
            <span className="text-muted-foreground">Отправитель:</span>{' '}
            {document.sender_full_name}
          </div>
          <div>
            <span className="text-muted-foreground">Дата создания:</span>{' '}
            {new Date(document.created_at).toLocaleDateString('ru-RU')}
          </div>
          <div>
            <span className="text-muted-foreground">Тип:</span> {document.type}
          </div>
        </div>
      </div>

      {/* Описание документа */}
      {document.title && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Описание документа</h2>
          <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
            {document.title}
          </p>
        </div>
      )}

      {/* Split layout: PDF слева, карточки справа */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Left side - PDF Viewer */}
        <div className="w-full space-y-4">
          {document.file && <PdfViewer url={document.file} />}
          {!document.file && (
            <div className="border rounded-lg p-8 text-center text-muted-foreground">
              Файл документа отсутствует
            </div>
          )}
        </div>

        {/* Right side - Cards */}
        <div className="w-full space-y-4 md:space-y-6">
          <DocumentTabsCard 
            participants={participants}
            history={[]}
            isHistoryLoading={false}
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
