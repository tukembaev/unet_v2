import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from 'shared/ui';
import { Clock, CircleDot, CheckCircle2, XCircle } from 'lucide-react';
import { Document } from '../model/types';
import { useNavigate } from 'react-router-dom';

interface DocumentsTableProps {
  documents: Document[];
}

// const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
//   'В режиме ожидания': 'secondary',
//   'В работе': 'default',
//   'Выполнено': 'outline',
//   'Отклонено': 'destructive',
// };

const statusIcons: Record<string, React.ReactNode> = {
  'В режиме ожидания': <Clock className="h-3 w-3 text-yellow-500" />,
  'В работе': <CircleDot className="h-3 w-3" />,
  'Выполнено': <CheckCircle2 className="h-3 w-3 text-green-500" />,
  'Отклонено': <XCircle className="h-3 w-3 text-red-500" />,
};

export const DocumentsTable = ({ documents }: DocumentsTableProps) => {
  const navigate = useNavigate();
  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px] min-w-[180px]">Номер</TableHead>
            <TableHead className="w-[200px] min-w-[200px]">Заявитель</TableHead>
            <TableHead className="w-[150px] min-w-[150px]">Тип</TableHead>
            <TableHead className="min-w-[250px]">Тема</TableHead>
            <TableHead className="w-[180px] min-w-[180px]">Статус</TableHead>
            <TableHead className="w-[150px] min-w-[150px]">Дата подачи</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Документы не найдены
              </TableCell>
            </TableRow>
          ) : (
            documents.map((doc) => (
              <TableRow key={doc.id} className="cursor-pointer" onClick={() => navigate(`/documents/applications/${doc.id}`)}>
                <TableCell className="font-medium whitespace-nowrap">{doc.number}</TableCell>
                <TableCell className="whitespace-nowrap">{doc.employee.surname_name}</TableCell>
                <TableCell className="whitespace-nowrap">{doc.type_doc}</TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>
                  <Badge variant={'outline'} className="gap-1.5 whitespace-nowrap">
                    {statusIcons[doc.status]}
                    {doc.status}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">{doc.date_zayavki}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
