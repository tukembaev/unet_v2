import { useUpdateDocumentStatus } from "features/create-document/model/queries";
import { LucideCookie } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PdfViewer from "shared/components/pdf-viewer/PdfViewer";
import { FormQuery, useFormNavigation } from "shared/lib";
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "shared/ui";
import PageHeader from "widgets/page-header/page-header";
import { useDocumentDetails } from "../../model/queries";
import { ApprovalParticipant } from "./approval-chain/DocumentApprovalFlow";
import DocumentDetailsSkeleton from "./DocumentDetailsSkeleton";
import DocFileCard from "./tabs/DocFileCard";
import DocumentTabsCard from "./tabs/DocumentTabsCard";
import { AddMembersDialog } from "./AddMembersDialog";
import { documentsActionApi } from "features/create-document/model/api";
import { useCurrentUser } from "entities/user/model/queries";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const DocumentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const openForm = useFormNavigation();
  const queryClient = useQueryClient();
  
  const { data: document, isLoading } = useDocumentDetails(id || '');
  const { data: currentUser } = useCurrentUser();
  const updateStatusMutation = useUpdateDocumentStatus();
  
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  
  console.log(document);
  // Преобразуем members в формат ApprovalParticipant
  const participants: ApprovalParticipant[] = useMemo(() => {
    if (!document?.members) return [];
    
    return document.members.map((member) => ({
      id: member.member_id,
      name: member.member_full_name,
      photo: undefined,
      status: member.status,
      isSigned: member.approve_name === member.status,
      rejectionReason: member.reason_reject || undefined,
      isCurrent: member.turn,
      type_approval: member.type_approval_name
    }));
  }, [document?.members]);

  // Находим текущего участника (чья очередь подписывать)
  const currentParticipant = useMemo(() => {
    if (!document?.members || !currentUser?.id) return null;
    return document.members.find(m => m.turn && m.member_id === currentUser.id);
  }, [document?.members, currentUser?.id]);

  const handleApprove = async () => {
    if (!id || !currentParticipant) return;
    try {
      await updateStatusMutation.mutateAsync({
        id,
        payload: { status: currentParticipant.approve_name },
      });
      
      toast.success("Документ одобрен", {
        description: `Статус изменен на: ${currentParticipant.approve_name}`,
      });
      
      // Обновляем данные документа и списки документов
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['documentDetails', id] }),
        queryClient.invalidateQueries({ queryKey: ['documents'] }),
      ]);
    } catch (error) {
      console.error('Error approving document:', error);
      toast.error("Ошибка при одобрении", {
        description: "Не удалось одобрить документ. Попробуйте снова.",
      });
    }
  };

  const handleReject = async () => {
    if (!id) return;
    try {
      await updateStatusMutation.mutateAsync({
        id,
        payload: { status: 'Доработать' },
      });
      
      toast.success("Документ отправлен на доработку", {
        description: "Статус изменен на: Доработать",
      });
      
      // Обновляем данные документа и списки документов
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['documentDetails', id] }),
        queryClient.invalidateQueries({ queryKey: ['documents'] }),
      ]);
    } catch (error) {
      console.error('Error rejecting document:', error);
      toast.error("Ошибка при отказе", {
        description: "Не удалось отклонить документ. Попробуйте снова.",
      });
    }
  };

  const handleAddMembers = async (members: { user_id: string; type_approval_id: string }[]) => {
    if (!id) return;
    
    setIsAddingMembers(true);
    try {
      await documentsActionApi.addDocumentMembers(id, members);
      
      // Обновляем данные документа и списки документов
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['documentDetails', id] }),
        queryClient.invalidateQueries({ queryKey: ['documents'] }),
      ]);
      
      toast.success("Согласующие добавлены", {
        description: `Успешно добавлено участников: ${members.length}`,
      });
      
      setIsAddMembersOpen(false);
    } catch (error) {
      console.error('Error adding members:', error);
      toast.error("Ошибка при добавлении согласующих", {
        description: "Не удалось добавить участников. Попробуйте снова.",
      });
    } finally {
      setIsAddingMembers(false);
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
        <div className="flex items-center gap-3">
          
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
        </div>
      </PageHeader>

      {/* Информация о документе */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold">Информация о документе</h2>
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
            {new Intl.DateTimeFormat('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }).format(new Date(document.created_at))}
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
          {document.file && <PdfViewer url={document.file} status={document.status} />}
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
            currentUserId={currentUser?.id}
            history={[]}
            isHistoryLoading={false}
            onApprove={handleApprove}
            onReject={handleReject}
            onAddMembers={() => setIsAddMembersOpen(true)}
          />
          <DocFileCard />
        </div>
      </div>

      {/* Диалог добавления согласующих */}
      <AddMembersDialog
        open={isAddMembersOpen}
        onOpenChange={setIsAddMembersOpen}
        onAddMembers={handleAddMembers}
        isSubmitting={isAddingMembers}
      />
    </div>
  );
};

export default DocumentDetails;
