import { Skeleton } from "shared/ui/skeleton";

/**
 * Скелетон, повторяющий структуру открытого РУП (Рабочий Учебный План):
 * — Шапка министерства
 * — Блок с направлением / профилем / квалификацией
 * — Таблица семестра с заголовком + 6-7 строк дисциплин + секция «Предметы по выбору»
 */
export const SyllabusReportSkeleton = () => {
  return (
    <div className="max-w-full space-y-6 p-6">
      {/* ======== Ministry header ======== */}
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-3 w-80" />
        <Skeleton className="h-3 w-96" />
        <Skeleton className="h-5 w-52 mt-1" />
      </div>

      {/* ======== Three-column header block ======== */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {/* Left — Утверждаю */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-36" />
        </div>

        {/* Center — Направление / Профиль / etc */}
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-4 w-72" />
          <Skeleton className="h-3 w-64" />
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-56" />
          <Skeleton className="h-3 w-44" />
        </div>

        {/* Right — Для набора с */}
        <div className="flex flex-col items-end gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>

      {/* ======== Semester Table ======== */}
      <div className="rounded-lg border border-border overflow-hidden">
        {/* Table header row */}
        <div className="bg-muted/70 flex gap-0">
          {[32, 80, 140, 120, 50, 60, 80, 50, 60, 40, 40, 40].map((w, i) => (
            <div
              key={i}
              className="py-3 px-3 border-r border-border last:border-r-0 flex items-center"
              style={{ width: w, minWidth: w, flexShrink: 0 }}
            >
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>

        {/* Semester heading */}
        <div className="bg-muted/50 py-3 px-3 flex justify-center">
          <Skeleton className="h-4 w-36" />
        </div>

        {/* 7 course rows */}
        {Array.from({ length: 7 }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex gap-0 border-t border-border">
            {[32, 80, 140, 120, 50, 60, 80, 50, 60, 40, 40, 40].map(
              (w, colIdx) => (
                <div
                  key={colIdx}
                  className="py-3 px-3 border-r border-border last:border-r-0 flex items-center"
                  style={{ width: w, minWidth: w, flexShrink: 0 }}
                >
                  <Skeleton
                    className="h-3"
                    style={{ width: `${60 + ((rowIdx * 7 + colIdx * 13) % 40)}%` }}
                  />
                </div>
              )
            )}
          </div>
        ))}

        {/* «Предметы по выбору» section */}
        <div className="bg-accent/30 py-3 px-3 flex justify-center border-t border-border">
          <Skeleton className="h-4 w-44" />
        </div>

        {/* 2 elective rows */}
        {Array.from({ length: 2 }).map((_, rowIdx) => (
          <div key={`el-${rowIdx}`} className="flex gap-0 border-t border-border">
            {[32, 80, 140, 120, 50, 60, 80, 50, 60, 40, 40, 40].map(
              (w, colIdx) => (
                <div
                  key={colIdx}
                  className="py-3 px-3 border-r border-border last:border-r-0 flex items-center"
                  style={{ width: w, minWidth: w, flexShrink: 0 }}
                >
                  <Skeleton
                    className="h-3"
                    style={{ width: `${50 + ((rowIdx * 5 + colIdx * 11) % 50)}%` }}
                  />
                </div>
              )
            )}
          </div>
        ))}

        {/* Summary row */}
        <div className="bg-muted/40 py-3 px-3 flex justify-center border-t border-border">
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="flex gap-0 border-t border-border bg-muted/40">
          {[32, 80, 140, 120, 50, 60, 80, 50, 60, 40, 40, 40].map(
            (w, colIdx) => (
              <div
                key={colIdx}
                className="py-3 px-3 border-r border-border last:border-r-0 flex items-center"
                style={{ width: w, minWidth: w, flexShrink: 0 }}
              >
                {colIdx >= 4 ? (
                  <Skeleton className="h-3 w-full" />
                ) : colIdx === 2 ? (
                  <Skeleton className="h-3 w-12" />
                ) : null}
              </div>
            )
          )}
        </div>
      </div>

      {/* ======== Second Semester Table (shorter preview) ======== */}
      <div className="rounded-lg border border-border overflow-hidden">
        {/* Table header row */}
        <div className="bg-muted/70 flex gap-0">
          {[32, 80, 140, 120, 50, 60, 80, 50, 60, 40, 40, 40].map((w, i) => (
            <div
              key={i}
              className="py-3 px-3 border-r border-border last:border-r-0 flex items-center"
              style={{ width: w, minWidth: w, flexShrink: 0 }}
            >
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>

        {/* Semester heading */}
        <div className="bg-muted/50 py-3 px-3 flex justify-center">
          <Skeleton className="h-4 w-36" />
        </div>

        {/* 5 rows */}
        {Array.from({ length: 5 }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex gap-0 border-t border-border">
            {[32, 80, 140, 120, 50, 60, 80, 50, 60, 40, 40, 40].map(
              (w, colIdx) => (
                <div
                  key={colIdx}
                  className="py-3 px-3 border-r border-border last:border-r-0 flex items-center"
                  style={{ width: w, minWidth: w, flexShrink: 0 }}
                >
                  <Skeleton
                    className="h-3"
                    style={{ width: `${55 + ((rowIdx * 3 + colIdx * 9) % 45)}%` }}
                  />
                </div>
              )
            )}
          </div>
        ))}

        {/* Summary row */}
        <div className="bg-muted/40 py-3 px-3 flex justify-center border-t border-border">
          <Skeleton className="h-4 w-36" />
        </div>
      </div>
    </div>
  );
};
