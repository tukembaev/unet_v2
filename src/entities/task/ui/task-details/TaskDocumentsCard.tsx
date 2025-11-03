import { Card, CardContent, CardHeader, CardTitle, Button, Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "shared/ui";
import { Plus, FileText, Download } from "lucide-react";
import { File } from "../../model/types";

interface TaskDocumentsCardProps {
  files: File[];
}

const TaskDocumentsCard = ({ files }: TaskDocumentsCardProps) => {
  const handleAddDocument = () => {
    // TODO: Implement add document logic
    console.log('Add document');
  };

  const handleDownload = (file: File) => {
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
        <Button onClick={handleAddDocument} size="sm" variant="outline">
          <Plus className="h-4 w-4" />
          Добавить
        </Button>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Документы отсутствуют
          </p>
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
                {files.map((file, index) => (
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

