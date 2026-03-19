import { Card, CardContent, CardHeader, CardTitle, Button, Table, TableHeader, TableBody, TableHead, TableRow, TableCell, Popover, PopoverTrigger, PopoverContent, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "shared/ui";
import { FileText, Download, Upload, Link2 } from "lucide-react";
import { useTaskDocuments } from "entities/task/model/queries";
import { useDocuments } from "entities/documents/model/queries";
import { useLocation } from "react-router-dom";
import { TaskFile } from "entities/task/model/types";
import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClientGo } from "shared/config";
import { TASK_DOCUMENTS_QUERY_KEY } from "entities/task/model/queries";

interface TaskDocumentsCardProps {
  canAddDocuments: boolean;
}

const TaskDocumentsCard = ({ canAddDocuments }: TaskDocumentsCardProps) => {
  const location = useLocation();
  const taskId = location.state?.taskId as string | undefined;
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("");

  const { data: task_docs } = useTaskDocuments(taskId);
  const { data: documentsData } = useDocuments({ tab: 'incoming', types: [], statuses: [], search: '' });

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

            {/* Кнопка прикрепления существующего документа */}
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  <Link2 className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Выберите документ</h4>
                    <p className="text-xs text-muted-foreground">
                      Прикрепите существующий документ к задаче
                    </p>
                  </div>
                  <Select value={selectedDocumentId} onValueChange={setSelectedDocumentId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите документ" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentsData?.documents.map((doc) => (
                        <SelectItem key={doc.id} value={String(doc.id)}>
                          <div className="flex flex-col">
                            <span className="font-medium">{doc.number}</span>
                            <span className="text-xs text-muted-foreground">{doc.type}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleAttachDocument}
                    disabled={!selectedDocumentId || attachDocumentMutation.isPending}
                    className="w-full"
                    size="sm"
                  >
                    {attachDocumentMutation.isPending ? 'Прикрепление...' : 'Прикрепить документ'}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {task_docs?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <FileText className="h-12 w-12 text-muted-foreground/50" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Нет документов
              </p>
              <p className="text-xs text-muted-foreground/70">
                Добавьте документы, используя кнопки выше
              </p>
            </div>
          </div>
        ) : (
    
  <div className="w-full overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead className="w-[100px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {task_docs?.map((file, index) => (
                  <TableRow key={file.id || index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {file.name || `Документ ${index + 1}`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleDownload(file)}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              
              </TableBody>
            </Table>
          </div>
     
       
        )}
      </CardContent>
    </Card>
  );
};

export default TaskDocumentsCard;

