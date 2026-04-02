import { GitBranch, History, MessageSquare } from "lucide-react";
import { useState } from "react";
import GenericHistory, { BaseHistory } from "shared/components/history/GenericHistory";
import { Card, CardContent, Tabs, TabsContent, TabsList, TabsTrigger } from "shared/ui";
import DocumentApprovalFlow, { ApprovalParticipant } from "../approval-chain/DocumentApprovalFlow";

interface DocumentTabsCardProps {
  participants: ApprovalParticipant[];
  currentUserId?: string;
  history?: BaseHistory[];
  isHistoryLoading?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onAddMembers?: () => void;
}

const DocumentTabsCard = ({ 
  participants, 
  currentUserId,
  history, 
  isHistoryLoading = false, 
  onApprove, 
  onReject,
  onAddMembers 
}: DocumentTabsCardProps) => {
  const [activeTab, setActiveTab] = useState("approval");

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="approval" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <GitBranch className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Согласование</span>
              <span className="sm:hidden">Согл.</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <History className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">История</span>
              <span className="sm:hidden">История</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Чат</span>
              <span className="sm:hidden">Чат</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="approval" className="mt-0">
            <div className="pt-2">
              <DocumentApprovalFlow 
                participants={participants}
                currentUserId={currentUserId}
                onApprove={onApprove}
                onReject={onReject}
                onAddMembers={onAddMembers}
              />
            </div>
          </TabsContent>
          <TabsContent value="history" className="mt-0">
            <div className="pt-2">
              <GenericHistory
                history={history}
                isLoading={isHistoryLoading}
                title="История документа"
                emptyMessage="История отсутствует"
              />
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-0">
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Чат в разработке
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Функционал чата будет доступен в ближайшее время
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentTabsCard;
