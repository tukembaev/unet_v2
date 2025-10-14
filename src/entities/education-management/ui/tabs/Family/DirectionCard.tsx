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

interface DirectionData {
  id: string;
  code: string;
  name: string;
}

interface DirectionCardProps {
  title: string;
  data: DirectionData[];
}

export const DirectionCard = ({ title, data }: DirectionCardProps) => {
  const [value, setValue] = useState("");

  // Отдельный fetch для селекта (может быть из API)
  const fetchSelectData = useCallback(async (query?: string) => {
    // Здесь можно сделать запрос к API или использовать локальные данные
    const mockData = [
      { id: "NEW001", code: "09.03.06", name: "Новое IT направление" },
      {
        id: "NEW002",
        code: "38.03.06",
        name: "Новое экономическое направление",
      },
      { id: "NEW003", code: "07.03.06", name: "Новое дизайн направление" },
      { id: "NEW004", code: "15.03.06", name: "Новое техническое направление" },
    ];

    if (query) {
      return mockData.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.code.toLowerCase().includes(query.toLowerCase())
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
                <span className="font-mono text-sm">{option.code}</span>
                <span>{option.name}</span>
              </div>
            )}
            getOptionValue={(option) => option.id}
            getDisplayValue={(option) => `${option.code} - ${option.name}`}
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
                  <TableCell className="font-mono">{item.code}</TableCell>
                  <TableCell>{item.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
