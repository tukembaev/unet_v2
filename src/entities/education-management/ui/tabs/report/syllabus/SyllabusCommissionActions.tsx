import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useUpdateSyllabusVerification } from 'entities/curriculum/model';
import { getHttpErrorMessage } from 'shared/lib/http-error';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Textarea,
} from 'shared/ui';
import type { SyllabusReviewStatus } from '../SyllabusStatusBadge';

type Props = {
  syllabusId: number;
  status: SyllabusReviewStatus;
  reasonReject?: string | null;
};

/**
 * Смена статуса РУП через PATCH /all-syllabus/{id}/ —
 * только для комиссии в отчётах учебного управления.
 */
export function SyllabusCommissionActions({
  syllabusId,
  status,
  reasonReject,
}: Props) {
  const updateVerification = useUpdateSyllabusVerification(syllabusId);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (rejectOpen) {
      setRejectReason(reasonReject?.trim() ?? '');
    }
  }, [rejectOpen, reasonReject]);

  const handleConfirm = async () => {
    try {
      await updateVerification.mutateAsync({ status: 'confirmed' });
      toast.success('Учебный план подтверждён');
    } catch (error) {
      toast.error('Не удалось подтвердить', {
        description: getHttpErrorMessage(error),
      });
    }
  };

  const handleReject = async () => {
    const reason = rejectReason.trim();
    if (!reason) {
      toast.error('Укажите причину отправки на доработку');
      return;
    }
    try {
      await updateVerification.mutateAsync({
        status: 'revision',
        reason_reject: reason,
      });
      toast.success('Учебный план отправлен на доработку');
      setRejectOpen(false);
    } catch (error) {
      toast.error('Не удалось обновить статус', {
        description: getHttpErrorMessage(error),
      });
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
        <p className="mr-auto text-sm text-muted-foreground">
          Проверка комиссии: статус меняется сразу в отчёте
        </p>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={updateVerification.isPending}
          onClick={() => setRejectOpen(true)}
        >
          На доработку
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={
            updateVerification.isPending || status === 'confirmed'
          }
          onClick={() => void handleConfirm()}
        >
          Подтвердить
        </Button>
      </div>

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
            onChange={(event) => setRejectReason(event.target.value)}
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
