import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
} from "shared/ui";
import { Reports, Syllabus } from "entities/education-management/model/types";
import { useState, useMemo } from "react";
import { Input } from "shared/ui";
import { Link } from "react-router-dom";

interface ReportsTableProps {
  data: Reports[];
}

export const ReportsTable = ({ data }: ReportsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Функция для фильтрации данных по поисковому запросу
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    return data
      .map((institute) => ({
        ...institute,
        syllabuses: institute.syllabuses.filter(
          (syllabus) =>
            syllabus.direction
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            syllabus.profile
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            syllabus.cipher.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((institute) => institute.syllabuses.length > 0);
  }, [data, searchQuery]);

  const handleDownloadExcel = (syllabus: Syllabus) => {
    // Здесь будет логика скачивания Excel файла
    console.log("Downloading Excel for syllabus:", syllabus);
  };

  return (
    <div className="space-y-4">
      {/* Поиск */}
      <div className="flex gap-4">
        <Input
          placeholder="Поиск по названию и шифру..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Таблицы для каждого института */}
      {filteredData.map((institute) => (
        <div key={institute.id} className="space-y-4">
          <h2 className="text-xl font-semibold text-center mb-4">
            {institute.institute}
          </h2>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-center font-bold">Nº</TableHead>
                  <TableHead className="text-center font-bold" colSpan={2}>
                    Название специальности
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    Профиль
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    Длит.обучения
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    Годы обучения
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    Кл.Семестров
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    Кл.Предметов
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    Скачать Excel
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {institute.syllabuses.map((syllabus, index) => (
                  <Link
                    to={`/report-syllabus/${syllabus.id}/${syllabus.profile_id}`}
                  >
                    <TableRow key={syllabus.id} className="hover:bg-gray-50">
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center font-mono text-sm">
                        {syllabus.cipher}
                      </TableCell>
                      <TableCell className="text-left">
                        {syllabus.direction}
                      </TableCell>
                      <TableCell className="text-left">
                        {syllabus.profile}
                      </TableCell>
                      <TableCell className="text-center">
                        {syllabus.duration} года
                      </TableCell>
                      <TableCell className="text-center">
                        {syllabus.years}
                      </TableCell>
                      <TableCell className="text-center">
                        {syllabus.semesters}
                      </TableCell>
                      <TableCell className="text-center">
                        {syllabus.subjects}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadExcel(syllabus)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 p-1"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
                              fill="currentColor"
                            />
                            <path
                              d="M14 2V8H20"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M16 13H8"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M16 17H8"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M10 9H9H8"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Button>
                      </TableCell>
                    </TableRow>
                  </Link>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}

      {/* Сообщение если нет данных */}
      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchQuery
            ? "По вашему запросу ничего не найдено"
            : "Нет данных для отображения"}
        </div>
      )}
    </div>
  );
};
