
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Skeleton, Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "shared/ui";


interface FlowItem {
  id: number;
  code: string | null;
  name_subject: string;
  semester: string | number;
  direction: string;
  profile_name?: string | null;
}

interface Props {
  data?: FlowItem[];
  isLoading?: boolean;
}

export const StreamsTable: FC<Props> = ({ data = [], isLoading }) => {
  const navigate = useNavigate();
  const onSelect = (id: number) => {
    navigate(`/education/stream/`,{state: { streamId: id }});
  }
  if (isLoading) {
    return (
      <Card className="p-4 space-y-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="flex items-center justify-center h-40 text-muted-foreground">
        Список предметов пуст
      </Card>
    );
  }





  return (
    <Card className="overflow-hidden rounded-2xl shadow-sm">
      <Table>
        <TableCaption>Список предметов кафедры</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] text-center">№</TableHead>
            <TableHead>Код предмета</TableHead>
            <TableHead>Наименование дисциплины</TableHead>
            <TableHead>Семестр</TableHead>
            <TableHead>Направление</TableHead>
            <TableHead>Профиль</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="cursor-pointer hover:bg-muted/40 transition-colors"
            >
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>{item.code}</TableCell>
              <TableCell className="font-medium">
                {item.name_subject}
              </TableCell>
              <TableCell>{item.semester}</TableCell>
              <TableCell>{item.direction}</TableCell>
              <TableCell>
                {item.profile_name ? item.profile_name : "Не указан"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
     </Card>
  );
};
