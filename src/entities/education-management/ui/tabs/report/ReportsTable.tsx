import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Input,
} from "shared/ui";
import { Reports, Syllabus } from "entities/education-management/model/types";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getEducationManagementPath } from "entities/education-management/lib/use-education-tab-url";
import { getReportSyllabusPath } from "app/providers/routes";
import {
  SyllabusVerificationBadge,
  SyllabusVerificationDialog,
} from "./SyllabusVerificationDialog";

interface ReportsTableProps {
  data: Reports[];
}

function syllabusSearchHaystack(syllabus: Syllabus): string {
  const parts = [syllabus.cipher, syllabus.direction, syllabus.profile].map((value) => {
    if (value == null) return "";
    if (Array.isArray(value)) return value.map(String).join(" ");
    return String(value);
  });
  return parts.join(" ").toLowerCase();
}

export const ReportsTable = ({ data }: ReportsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [verificationSyllabus, setVerificationSyllabus] = useState<Syllabus | null>(
    null
  );
  const [verificationInstitute, setVerificationInstitute] = useState<string>();
  const navigate = useNavigate();

  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return data;

    return data
      .map((institute) => ({
        ...institute,
        syllabuses: institute.syllabuses.filter((syllabus) =>
          syllabusSearchHaystack(syllabus).includes(q)
        ),
      }))
      .filter((institute) => institute.syllabuses.length > 0);
  }, [data, searchQuery]);

  const openVerification = (syllabus: Syllabus, instituteName: string) => {
    setVerificationInstitute(instituteName);
    setVerificationSyllabus(syllabus);
  };

  return (
    <div className="space-y-4">
      <form
        className="flex gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <Input
          type="search"
          placeholder="Поиск по названию и шифру..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </form>

      {filteredData.map((institute) => (
        <div key={institute.id} className="space-y-4">
          <h2 className="text-xl font-semibold text-center mb-4">
            {institute.institute}
          </h2>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-center font-bold w-10">Nº</TableHead>
                  <TableHead className="text-center font-bold">Шифр</TableHead>
                  <TableHead className="text-center font-bold">Направление</TableHead>
                  <TableHead className="text-center font-bold">Предметов</TableHead>
                  <TableHead className="text-center font-bold">Семестров</TableHead>
                  <TableHead className="text-center font-bold">Длительность</TableHead>
                  <TableHead className="text-center font-bold">Форма обучения</TableHead>
                  <TableHead className="text-center font-bold">Уровень</TableHead>
                  <TableHead className="text-center font-bold min-w-[132px]">
                    Статус
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {institute.syllabuses.map((syllabus, index) => (
                  <TableRow
                    key={syllabus.id}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => {
                      navigate(getReportSyllabusPath(syllabus.id, syllabus.profile_id), {
                        state: {
                          returnTo: getEducationManagementPath("reports"),
                        },
                      });
                    }}
                  >
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="text-center font-mono text-sm">
                      {syllabus.cipher}
                    </TableCell>
                    <TableCell className="text-left">
                      {syllabus.direction}
                    </TableCell>
                    <TableCell className="text-center">
                      {syllabus.subjects}
                    </TableCell>
                    <TableCell className="text-center">
                      {syllabus.semesters}
                    </TableCell>
                    <TableCell className="text-center whitespace-nowrap">
                      {syllabus.duration} года
                    </TableCell>
                    <TableCell className="text-left">
                      {syllabus.form_education}
                    </TableCell>
                    <TableCell className="text-center">
                      {syllabus.level_education}
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-full outline-none ring-offset-background transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          openVerification(syllabus, institute.institute);
                        }}
                      >
                        <SyllabusVerificationBadge
                          isVerified={syllabus.is_verified}
                          className="cursor-pointer"
                        />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {searchQuery
            ? "По вашему запросу ничего не найдено"
            : "Нет данных для отображения"}
        </div>
      )}

      <SyllabusVerificationDialog
        open={verificationSyllabus != null}
        onOpenChange={(open) => {
          if (!open) {
            setVerificationSyllabus(null);
            setVerificationInstitute(undefined);
          }
        }}
        syllabus={verificationSyllabus}
        instituteName={verificationInstitute}
      />
    </div>
  );
};
