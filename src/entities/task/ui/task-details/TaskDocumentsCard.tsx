import { Card, CardContent, CardHeader, CardTitle, Button, Table, TableHeader, TableBody, TableHead, TableRow, TableCell, FileDragDrop } from "shared/ui";
import { Plus, FileText, Download } from "lucide-react";
import { useTaskDocuments } from "entities/task/model/queries";
import { useLocation } from "react-router-dom";
import { TaskFile } from "entities/task/model/types";
import { EmptyState } from "shared/components/EmptyState";

const TaskDocumentsCard = () => {
  const location = useLocation();
  const taskId = location.state?.taskId as string | undefined;

  const { data: task_docs } = useTaskDocuments(taskId);
  
  const handleAddDocument = () => {
    // TODO: Implement add document logic
    console.log('Add document');
  };

  const handleDownload = (file: TaskFile) => {
    // TODO: Implement download logic
    console.log('Download file:', file);
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Документы
        </CardTitle>
       
      </CardHeader>
      <CardContent>
        {task_docs?.length === 0 ? (
          <FileDragDrop 
            files={[]}
            onFilesChange={() => {}}
            maxFiles={10}
            maxFileSize={10 * 1024 * 1024}
            description="Перетащите файлы сюда или нажмите для выбора"
            multiple={true}
          />
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

