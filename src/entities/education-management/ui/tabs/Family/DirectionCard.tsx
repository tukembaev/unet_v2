import { useDirections } from "entities/education-management/model/queries";
import { useCallback, useState } from "react";
import { AsyncSelect } from "shared/components/select";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
} from "shared/ui";

interface DirectionData {
  id: string;
  code: string;
  name: string;
}

interface DirectionCardProps {
  title: string;
  data: DirectionData[];
  isLoading?: boolean;
  error?: Error | null;
}

export const DirectionCard = ({ title, data, isLoading, error }: DirectionCardProps) => {
  const { data: directions } = useDirections();
  const [value, setValue] = useState("");

  const fetchSelectData = useCallback(async (query?: string) => {  
    if (query) {
      return (directions || []).filter(
        (item) =>
          item.direction_name.toLowerCase().includes(query.toLowerCase()) ||
          item.cipher.toLowerCase().includes(query.toLowerCase())
      );
    }
    return directions || [];
  }, [directions]);

  const handleAdd = () => {
    if (value) {
      // Здесь можно добавить логику для добавления выбранного элемента
      console.log("Adding:", value);
      setValue(""); // Очищаем селект после добавления
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-row gap-2">
          <AsyncSelect
            fetcher={fetchSelectData}
            label="Добавить направление"
            value={value}
            onChange={(v) => setValue(v)}
            renderOption={(option) => (
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{option.cipher}</span>
                <span>{option.direction_name}</span>
              </div>
            )}
            getOptionValue={(option) => option.id.toString()}
            getDisplayValue={(option) => `${option.cipher} - ${option.direction_name}`}
            placeholder="Выберите направление для добавления"
          />

          <Button onClick={handleAdd} disabled={!value}>
            Добавить
          </Button>
        </div>

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Шифр</TableHead>
                <TableHead>Название</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Skeleton для состояния загрузки
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                  </TableRow>
                ))
              ) : error ? (
                // Сообщение об ошибке
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-red-500 py-4">
                    Ошибка загрузки данных: {error.message}
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                // Сообщение о пустых данных
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-gray-500 py-4">
                    Нет данных для отображения
                  </TableCell>
                </TableRow>
              ) : (
                // Обычные данные
                data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
