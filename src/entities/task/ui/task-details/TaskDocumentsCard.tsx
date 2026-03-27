import { Card, CardContent, CardHeader, CardTitle, Button, Popover, PopoverTrigger, PopoverContent, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Separator } from "shared/ui";
import { FileText, Download, Upload, Link2, FileCheck } from "lucide-react";
import { useTaskDocuments, useTaskDetails } from "entities/task/model/queries";
import { useApplicationDocuments } from "entities/documents/model/queries";
import { useLocation, useNavigate } from "react-router-dom";
import { TaskFile } from "entities/task/model/types";
import { useState, useRef, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClientGo } from "shared/config";
import { TASK_DOCUMENTS_QUERY_KEY } from "entities/task/model/queries";

interface TaskDocumentsCardProps {
  canAddDocuments: boolean;
}

const TaskDocumentsCard = ({ canAddDocuments }: TaskDocumentsCardProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const taskId = location.state?.taskId as string | undefined;
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("");

  const { data: task } = useTaskDetails(taskId);
  const { data: task_docs } = useTaskDocuments(taskId);
  const { data: documentsData } = useApplicationDocuments('inbox');

  // Получаем список документов из inbox
  const documents = useMemo(() => {
    return documentsData || [];
  }, [documentsData]);

  // Mutation для загрузки файла
  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await apiClientGo.post(`tasks/${taskId}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_DOCUMENTS_QUERY_KEY, taskId] });
    },
  });

  // Mutation для прикрепления существующего документа
  const attachDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const { data } = await apiClientGo.post(`tasks/${taskId}/attach-document`, {
        document_id: documentId,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_DOCUMENTS_QUERY_KEY, taskId] });
      setIsPopoverOpen(false);
      setSelectedDocumentId("");
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && taskId) {
      uploadFileMutation.mutate(file);
    }
  };

  const handleAttachDocument = () => {
    if (selectedDocumentId && taskId) {
      attachDocumentMutation.mutate(selectedDocumentId);
    }
  };

  const handleDownload = (file: TaskFile) => {
    if (file.url) {
      window.open(file.url, '_blank');
    }
  };

  const handleDocumentClick = () => {
    if (task?.doc_id) {
      navigate(`/documents/applications/${task.doc_id}`);
    }
  };

  // Проверяем, есть ли закрепленный документ
  const hasAttachedDocument = task?.doc_id && task?.doc_title;

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Документы
        </CardTitle>
        {canAddDocuments && (
          <div className="flex items-center gap-2">
            {/* Кнопка загрузки файла */}
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="sm"
              variant="outline"
              disabled={uploadFileMutation.isPending}
              className="h-8 w-8 p-0"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept="*/*"
            />

       
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Закрепленный документ */}
        {hasAttachedDocument && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FileCheck className="h-4 w-4" />
              <span>Связанный документ</span>
            </div>
            <Card 
              className="border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
              onClick={handleDocumentClick}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {task?.doc_title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        ID: {task?.doc_id}
                      </span>
                      {task?.doc_type && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {task?.doc_type}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Separator />
          </div>
        )}

        {/* Файлы задачи */}
        <div className="space-y-3">
          {hasAttachedDocument && (
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Файлы задачи</span>
            </div>
          )}
          
          {task_docs?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <FileText className="h-10 w-10 text-muted-foreground/50" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Нет файлов
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Добавьте файлы, используя кнопки выше
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {task_docs?.map((file, index) => (
                <Card 
                  key={file.id || index}
                  className="border-muted hover:border-muted-foreground/30 transition-colors"
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-2 rounded-md bg-muted">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-medium truncate">
                          {file.name || `Документ ${index + 1}`}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleDownload(file)}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 shrink-0"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskDocumentsCard;

