import { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getHttpErrorMessage } from 'shared/lib';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
} from 'shared/ui';
import { useRegenerateShareToken } from '../model/queries';
import type { SurveyOut } from '../model/types';

type Props = {
  survey: SurveyOut | null;
  onOpenChange: (open: boolean) => void;
};

export function getPublicSurveyUrl(shareToken: string): string {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/s/${shareToken}`;
}

export function SurveyShareDialog({ survey, onOpenChange }: Props) {
  const regenerate = useRegenerateShareToken();
  const [current, setCurrent] = useState<SurveyOut | null>(null);

  const shown = current && survey && current.id === survey.id ? current : survey;
  const url = shown ? getPublicSurveyUrl(shown.share_token) : '';
  const qrUrl = url
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(url)}`
    : '';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Ссылка скопирована');
    } catch {
      toast.error('Не удалось скопировать ссылку');
    }
  };

  const handleRegenerate = async () => {
    if (!shown) return;
    try {
      const updated = await regenerate.mutateAsync(shown.id);
      setCurrent(updated);
      toast.success('Ссылка обновлена, старая перестала работать');
    } catch (e) {
      toast.error(getHttpErrorMessage(e, 'Не удалось обновить ссылку'));
    }
  };

  return (
    <Dialog
      open={Boolean(survey)}
      onOpenChange={(open) => {
        if (!open) {
          setCurrent(null);
          onOpenChange(false);
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ссылка и QR анкеты</DialogTitle>
          <DialogDescription>{shown?.title}</DialogDescription>
        </DialogHeader>

        {shown ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input value={url} readOnly />
              <Button type="button" variant="outline" onClick={() => void copy()}>
                <Copy className="mr-1 h-4 w-4" />
                Копировать
              </Button>
            </div>

            <div className="flex flex-col items-center gap-2">
              <img
                src={qrUrl}
                alt="QR-код анкеты"
                width={220}
                height={220}
                className="rounded-md border"
              />
              <p className="text-center text-xs text-muted-foreground">
                QR ведёт на публичную страницу прохождения на UNET
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={regenerate.isPending}
              onClick={() => void handleRegenerate()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {regenerate.isPending
                ? 'Обновление…'
                : 'Перевыпустить ссылку (старая перестанет работать)'}
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
