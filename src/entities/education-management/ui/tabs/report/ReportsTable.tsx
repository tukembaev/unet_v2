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
  normalizeSyllabusStatus,
  SyllabusStatusBadge,
} from "./SyllabusStatusBadge";
import { SyllabusVerificationDialog } from "./SyllabusVerificationDialog";

interface ReportsTableProps {
  data: Reports[];
  /** Путь назад с сохранёнными фильтрами отчёта. */
  returnTo?: string;
  /** Перед уходом на карточку РУП — записать фильтры в URL. */
  onBeforeOpen?: () => void;
}

function syllabusSearchHaystack(syllabus: Syllabus): string {
  const parts = [syllabus.cipher, syllabus.direction, syllabus.profile].map((value) => {
    if (value == null) return "";
    if (Array.isArray(value)) return value.map(String).join(" ");
    return String(value);
  });
  return parts.join(" ").toLowerCase();
}

export const ReportsTable = ({
  data,
  returnTo,
  onBeforeOpen,
}: ReportsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [verificationSyllabus, setVerificationSyllabus] = useState<Syllabus | null>(
    null
  );
  const [verificationInstitute, setVerificationInstitute] = useState<string>();
  const navigate = useNavigate();

  const returnToReports = returnTo ?? getEducationManagementPath("reports");

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
    <div className="space-y-5">
      <form
        className="flex gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <Input
          type="search"
          placeholder="Поиск по шифру и направлению…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 max-w-md"
        />
      </form>

      {filteredData.map((institute) => (
        <div key={institute.id} className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-muted/30 px-4 py-2.5">
            <h2 className="text-base font-semibold tracking-tight">
              {institute.institute}
            </h2>
            <span className="text-xs font-medium text-muted-foreground">
              {institute.syllabuses.length} РУП
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-10 text-center font-semibold">№</TableHead>
                  <TableHead className="text-center font-semibold">Шифр</TableHead>
                  <TableHead className="min-w-[220px] font-semibold">
                    Направление
                  </TableHead>
                  <TableHead className="text-center font-semibold">Форма</TableHead>
                  <TableHead className="text-center font-semibold">Уровень</TableHead>
                  <TableHead className="text-center font-semibold">Годы</TableHead>
                  <TableHead className="text-center font-semibold">
                    Длительность
                  </TableHead>
                  <TableHead className="min-w-[132px] text-center font-semibold">
                    Статус
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    Семестры
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    Предметы
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {institute.syllabuses.map((syllabus, index) => (
                  <TableRow
                    key={syllabus.id}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => {
                      onBeforeOpen?.();
                      navigate(getReportSyllabusPath(syllabus.id, syllabus.profile_id), {
                        state: {
                          returnTo: returnToReports,
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
                    <TableCell className="text-center text-sm">
                      {syllabus.form_education}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {syllabus.level_education}
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      {syllabus.years}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-center">
                      {syllabus.duration} г.
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
                        <SyllabusStatusBadge
                          status={normalizeSyllabusStatus(
                            syllabus.status,
                            syllabus.is_verified
                          )}
                          className="cursor-pointer"
                        />
                      </button>
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      {syllabus.semesters}
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      {syllabus.subjects}
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
