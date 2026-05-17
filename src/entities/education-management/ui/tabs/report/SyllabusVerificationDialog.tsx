import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Skeleton,
  Textarea,
} from "shared/ui";
import type { Syllabus } from "entities/education-management/model/types";
import {
  useSyllabusDetail,
  useUpdateSyllabusVerification,
} from "entities/curriculum/model";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "shared/lib/utils";
import { getHttpErrorMessage } from "shared/lib";
import { toast } from "sonner";

export function SyllabusVerificationBadge({
  isVerified,
  className,
}: {
  isVerified: boolean;
  className?: string;
}) {
  if (isVerified) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
          "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
          className
        )}
      >
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
        Подтверждено
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
        "border-amber-500/25 bg-amber-500/10 text-amber-800 dark:text-amber-400",
        className
      )}
    >
      <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
      В рассмотрении
    </Badge>
  );
}

type InfoRow = { label: string; value: string | number | null | undefined };

function InfoGrid({ rows }: { rows: InfoRow[] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {rows.map(({ label, value }) => (
        <div
          key={label}
          className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5"
        >
          <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
          <dd className="mt-1 text-sm font-medium text-foreground">
            {value != null && String(value).trim() !== "" ? value : "—"}
          </dd>
        </div>
      ))}
    </dl>
  );
}

interface SyllabusVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  syllabus: Syllabus | null;
  instituteName?: string;
}

export function SyllabusVerificationDialog({
  open,
  onOpenChange,
  syllabus,
  instituteName,
}: SyllabusVerificationDialogProps) {
  const syllabusId = syllabus?.id ?? null;
  const { data: detail, isLoading, isError, error } = useSyllabusDetail(
    syllabusId,
    open
  );
  const updateVerification = useUpdateSyllabusVerification(syllabusId);

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const isVerified = detail?.is_verified ?? syllabus?.is_verified ?? false;
  const reasonReject = detail?.reason_reject ?? null;

  useEffect(() => {
    if (!open) {
      setRejectOpen(false);
      setRejectReason("");
    }
  }, [open]);

  useEffect(() => {
    if (open && reasonReject) {
      setRejectReason(reasonReject.trim());
    }
  }, [open, reasonReject]);

  const infoRows = useMemo<InfoRow[]>(() => {
    if (!syllabus) return [];
    const years =
      detail?.start_year && detail?.end_year
        ? `${detail.start_year}–${detail.end_year}`
        : syllabus.years;

    return [
      { label: "Институт", value: instituteName ?? detail?.institute },
      { label: "Шифр", value: syllabus.cipher ?? detail?.cipher },
      { label: "Направление", value: detail?.direction ?? syllabus.direction },
      {
        label: "Форма обучения",
        value: detail?.form_education ?? syllabus.form_education,
      },
      {
        label: "Уровень образования",
        value: detail?.level_education ?? syllabus.level_education,
      },
      {
        label: "Длительность обучения",
        value:
          detail?.duration != null
            ? `${detail.duration} года`
            : syllabus.duration
              ? `${syllabus.duration} года`
              : null,
      },
      { label: "Годы обучения", value: years },
      {
        label: "Количество семестров",
        value: detail?.semester_count ?? syllabus.semesters,
      },
      {
        label: "Количество предметов",
        value: detail?.subjects_count ?? syllabus.subjects,
      },
    ];
  }, [syllabus, detail, instituteName]);

  const handleConfirm = async () => {
    if (!syllabusId) return;
    try {
      await updateVerification.mutateAsync({
        is_verified: true,
        reason_reject: null,
      });
      toast.success("Учебный план подтверждён");
      onOpenChange(false);
    } catch (e) {
      toast.error("Не удалось подтвердить", {
        description: getHttpErrorMessage(e),
      });
    }
  };

  const handleReject = async () => {
    const reason = rejectReason.trim();
    if (!reason) {
      toast.error("Укажите причину отправки на доработку");
      return;
    }
    if (!syllabusId) return;
    try {
      await updateVerification.mutateAsync({
        is_verified: false,
        reason_reject: reason,
      });
      toast.success("Учебный план отправлен на доработку");
      setRejectOpen(false);
      onOpenChange(false);
    } catch (e) {
      toast.error("Не удалось обновить статус", {
        description: getHttpErrorMessage(e),
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Проверка учебного плана</DialogTitle>
            <DialogDescription>
              Просмотр данных РУП и изменение статуса проверки.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
            <div>
              <p className="text-xs text-muted-foreground">Текущий статус</p>
              <div className="mt-1.5">
                <SyllabusVerificationBadge isVerified={isVerified} />
              </div>
            </div>
            {syllabus?.cipher ? (
              <p className="font-mono text-sm text-muted-foreground">
                {syllabus.cipher}
              </p>
            ) : null}
          </div>

          {reasonReject ? (
            <div className="flex gap-2 rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-800 dark:text-rose-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <div>
                <p className="font-medium">Причина доработки</p>
                <p className="mt-0.5 whitespace-pre-wrap">{reasonReject}</p>
              </div>
            </div>
          ) : null}

          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : isError ? (
            <p className="text-sm text-destructive">
              {getHttpErrorMessage(error, "Не удалось загрузить данные РУП")}
            </p>
          ) : (
            <InfoGrid rows={infoRows} />
          )}

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateVerification.isPending}
            >
              Закрыть
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setRejectOpen(true)}
              disabled={updateVerification.isPending || isLoading}
            >
              На доработку
            </Button>
            <Button
              type="button"
              onClick={() => void handleConfirm()}
              disabled={updateVerification.isPending || isLoading || isVerified}
            >
              Подтвердить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Причина доработки</DialogTitle>
            <DialogDescription>
              Укажите комментарий для отправки учебного плана на доработку.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Опишите, что нужно исправить"
            className="min-h-28"
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectOpen(false)}
              disabled={updateVerification.isPending}
            >
              Отмена
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleReject()}
              disabled={updateVerification.isPending}
            >
              Отправить на доработку
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
