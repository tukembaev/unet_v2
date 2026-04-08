import { GitBranch, History, Paperclip, Download, FileText } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import GenericHistory, { BaseHistory } from "shared/components/history/GenericHistory";
import { Card, CardContent, Tabs, TabsContent, TabsList, TabsTrigger, Button, Badge } from "shared/ui";
import { cn } from "shared/lib/utils";
import DocumentApprovalFlow, { ApprovalParticipant } from "../approval-chain/DocumentApprovalFlow";

interface DocumentFile {
  file: string;
  filename: string;
}

interface DocumentTabsCardProps {
  participants: ApprovalParticipant[];
  currentUserId?: string;
  history?: BaseHistory[];
  isHistoryLoading?: boolean;
  files?: DocumentFile[];
  onApprove?: () => void;
  onReject?: () => void;
  onAddMembers?: () => void;
}

const DocumentTabsCard = ({ 
  participants, 
  currentUserId,
  history, 
  isHistoryLoading = false,
  files = [],
  onApprove, 
  onReject,
  onAddMembers 
}: DocumentTabsCardProps) => {
  const [activeTab, setActiveTab] = useState("approval");
  
  const participantsCount = participants.length;
  const filesCount = files.length;

  const tabs = [
    {
      name: 'Согласование',
      value: 'approval',
      icon: GitBranch,
      count: participantsCount
    },
    {
      name: 'Файлы',
      value: 'files',
      icon: Paperclip,
      count: filesCount
    },
    {
      name: 'История',
      value: 'history',
      icon: History,
      count: 0
    }
  ];

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-4">
          <TabsList className="h-auto gap-2 rounded-xl p-1 mb-4">
            {tabs.map(({ icon: Icon, name, value, count }) => {
              const isActive = activeTab === value;
              return (
                <motion.div
                  key={value}
                  layout
                  className={cn(
                    'flex h-9 items-center justify-center overflow-hidden rounded-md',
                    isActive ? 'flex-1' : 'flex-none'
                  )}
                  onClick={() => setActiveTab(value)}
                  initial={false}
                  animate={{
                    width: isActive ? 'auto' : 36
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 25
                  }}
                >
                  <TabsTrigger value={value} asChild>
                    <motion.div
                      className="flex h-9 w-full items-center justify-center gap-1.5 px-3"
                      animate={{ filter: 'blur(0px)' }}
                      exit={{ filter: 'blur(2px)' }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.span
                            className="font-medium whitespace-nowrap"
                            initial={{ opacity: 0, scaleX: 0.8 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            exit={{ opacity: 0, scaleX: 0.8 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            style={{ originX: 0 }}
                          >
                            {name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {count > 0 && isActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                            {count}
                          </Badge>
                        </motion.div>
                      )}
                    </motion.div>
                  </TabsTrigger>
                </motion.div>
              );
            })}
          </TabsList>

          <TabsContent value="approval" className="mt-0">
            <motion.div 
              className="pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DocumentApprovalFlow 
                participants={participants}
                currentUserId={currentUserId}
                onApprove={onApprove}
                onReject={onReject}
                onAddMembers={onAddMembers}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <motion.div 
              className="pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GenericHistory
                history={history}
                isLoading={isHistoryLoading}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="files" className="mt-0">
            <motion.div 
              className="pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {files.length > 0 ? (
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.filename}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0"
                        onClick={() => window.open(file.file, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                  <Paperclip className="h-12 w-12 text-muted-foreground/50" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Нет дополнительных файлов
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      К этому документу не прикреплены дополнительные файлы
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentTabsCard;
