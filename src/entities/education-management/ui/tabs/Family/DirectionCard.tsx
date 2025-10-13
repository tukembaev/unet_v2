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
} from "shared/ui";

import { KindDirectionItem } from "entities/education-management/model/types";

interface DirectionCardProps {
  title: string;
  data: KindDirectionItem[];
}

export const DirectionCard = ({ title, data }: DirectionCardProps) => {
  const [value, setValue] = useState("");

  // Отдельный fetch для селекта (может быть из API)
  const fetchSelectData = useCallback(async (query?: string) => {
    // Здесь можно сделать запрос к API или использовать локальные данные
    const mockData = [
      { id: 1, cipher: "09.03.06", direction_name: "Новое IT направление", kind: 1 },
      {
        id: 2,
        cipher: "38.03.06",
        direction_name: "Новое экономическое направление",
        kind: 2,
      },
      { id: 3, cipher: "07.03.06", direction_name: "Новое дизайн направление", kind: 3 },
      { id: 4, cipher: "15.03.06", direction_name: "Новое техническое направление", kind: 4 },
    ];

    if (query) {
      return mockData.filter(
        (item) =>
          item.direction_name.toLowerCase().includes(query.toLowerCase()) ||
          item.cipher.toLowerCase().includes(query.toLowerCase())
      );
    }
    return mockData;
  }, []);

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
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.cipher}</TableCell>
                  <TableCell>{item.direction_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
