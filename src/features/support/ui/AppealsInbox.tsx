import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Loader2, MessageSquareText, RefreshCcw } from 'lucide-react';
import { getHttpErrorMessage } from 'shared/lib/http-error';
import { cn } from 'shared/lib/utils';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Empty,
  EmptyDescription,
  EmptyTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from 'shared/ui';
import {
  useReplySupportTicket,
  useSupportTicket,
  useSupportTickets,
} from '../model/queries';
import type { TicketStatus } from '../model/types';

const STATUS_FILTERS: { value: '' | TicketStatus; label: string }[] = [
  { value: '', label: 'Все статусы' },
  { value: 'OPEN', label: 'Открыто' },
  { value: 'IN_PROGRESS', label: 'В работе' },
  { value: 'CLOSED', label: 'Закрыто' },
];

const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Открыто',
  IN_PROGRESS: 'В работе',
  CLOSED: 'Закрыто',
};

function statusBadgeClass(status: string): string {
  if (status === 'OPEN') {
    return 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300';
  }
  if (status === 'IN_PROGRESS') {
    return 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200';
  }
  if (status === 'CLOSED') {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
  }
  return '';
}

function formatDate(value: string): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return format(date, 'dd.MM.yyyy HH:mm', { locale: ru });
}

export function AppealsInbox() {
  const [status, setStatus] = useState<'' | TicketStatus>('');
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState<TicketStatus>('IN_PROGRESS');

  const ticketsQuery = useSupportTickets({
    status: status || undefined,
    limit: 100,
  });
  const ticketQuery = useSupportTicket(selectedNumber);
  const replyMutation = useReplySupportTicket();

  const tickets = ticketsQuery.data ?? [];
  const selected = ticketQuery.data;

  const sortedTickets = useMemo(
    () =>
      [...tickets].sort((a, b) =>
        String(b.updated_at).localeCompare(String(a.updated_at))
      ),
    [tickets]
  );

  const openTicket = (ticketNumber: string) => {
    setSelectedNumber(ticketNumber);
    setReplyText('');
    setReplyStatus('IN_PROGRESS');
  };

  const submitReply = async () => {
    if (!selectedNumber || !replyText.trim()) return;
    try {
      await replyMutation.mutateAsync({
        ticketNumber: selectedNumber,
        payload: {
          text: replyText.trim(),
          status: replyStatus,
        },
      });
      setReplyText('');
    } catch {
      /* toast уже в мутации */
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Обращения
          </h1>
          <p className="text-sm text-muted-foreground">
            Входящие обращения по приложению, учёбе, LMS и сервисам университета
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={status || 'all'}
            onValueChange={(value) =>
              setStatus(value === 'all' ? '' : (value as TicketStatus))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((item) => (
                <SelectItem
                  key={item.value || 'all'}
                  value={item.value || 'all'}
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            onClick={() => void ticketsQuery.refetch()}
            disabled={ticketsQuery.isFetching}
          >
            <RefreshCcw
              className={cn(
                'mr-2 h-4 w-4',
                ticketsQuery.isFetching && 'animate-spin'
              )}
            />
            Обновить
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,420px)]">
        <Card className="overflow-hidden border-border/70 shadow-sm">
          <CardHeader className="border-b bg-muted/20 py-3">
            <CardTitle className="text-base">Список</CardTitle>
            <CardDescription>
              {ticketsQuery.isLoading
                ? 'Загрузка…'
                : `Найдено: ${sortedTickets.length}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {ticketsQuery.isLoading ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            ) : ticketsQuery.isError ? (
              <Empty className="border-0 py-12">
                <EmptyTitle>Не удалось загрузить обращения</EmptyTitle>
                <EmptyDescription>
                  {getHttpErrorMessage(ticketsQuery.error)}
                </EmptyDescription>
              </Empty>
            ) : sortedTickets.length === 0 ? (
              <Empty className="border-0 py-12">
                <EmptyTitle>Обращений пока нет</EmptyTitle>
                <EmptyDescription>
                  Новые заявки появятся здесь после отправки с публичной страницы
                </EmptyDescription>
              </Empty>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Номер</TableHead>
                      <TableHead>Тема</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Обновлено</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTickets.map((ticket) => {
                      const active = selectedNumber === ticket.ticket_number;
                      return (
                        <TableRow
                          key={ticket.ticket_number}
                          className={cn(
                            'cursor-pointer',
                            active && 'bg-muted/60'
                          )}
                          onClick={() => openTicket(ticket.ticket_number)}
                        >
                          <TableCell className="font-medium tabular-nums">
                            {ticket.ticket_number}
                          </TableCell>
                          <TableCell className="max-w-[220px]">
                            <span className="line-clamp-2">{ticket.title}</span>
                          </TableCell>
                          <TableCell>{ticket.category || '—'}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={statusBadgeClass(ticket.status)}
                            >
                              {STATUS_LABELS[ticket.status] ?? ticket.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-muted-foreground">
                            {formatDate(ticket.updated_at)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit border-border/70 shadow-sm">
          <CardHeader className="border-b bg-muted/20 py-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquareText className="h-4 w-4" aria-hidden />
              Карточка обращения
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            {!selectedNumber ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Выберите обращение из списка
              </p>
            ) : ticketQuery.isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : ticketQuery.isError ? (
              <p className="text-sm text-destructive">
                {getHttpErrorMessage(
                  ticketQuery.error,
                  'Не удалось открыть обращение'
                )}
              </p>
            ) : selected ? (
              <>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className={statusBadgeClass(selected.status)}
                    >
                      {STATUS_LABELS[selected.status] ?? selected.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {selected.ticket_number}
                    </span>
                  </div>
                  <h2 className="text-base font-semibold leading-snug">
                    {selected.title}
                  </h2>
                  <dl className="grid gap-1.5 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">Категория</dt>
                      <dd>{selected.category || '—'}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">Создано</dt>
                      <dd>{formatDate(selected.created_at)}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">Обновлено</dt>
                      <dd>{formatDate(selected.updated_at)}</dd>
                    </div>
                  </dl>
                  {selected.description ? (
                    <p className="rounded-xl border bg-muted/20 p-3 text-sm leading-relaxed">
                      {selected.description}
                    </p>
                  ) : null}
                  {selected.files?.length ? (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        Файлы
                      </p>
                      <ul className="space-y-1 text-sm">
                        {selected.files.map((file) => (
                          <li key={file}>
                            <a
                              href={file}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:underline"
                            >
                              {file}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>

                <div className="space-y-2 border-t pt-4">
                  <p className="text-sm font-medium">Ответ / смена статуса</p>
                  <Select
                    value={replyStatus}
                    onValueChange={(value) =>
                      setReplyStatus(value as TicketStatus)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Открыто</SelectItem>
                      <SelectItem value="IN_PROGRESS">В работе</SelectItem>
                      <SelectItem value="CLOSED">Закрыто</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    rows={4}
                    value={replyText}
                    onChange={(event) => setReplyText(event.target.value)}
                    placeholder="Текст ответа"
                  />
                  <Button
                    type="button"
                    className="w-full"
                    disabled={
                      !replyText.trim() || replyMutation.isPending
                    }
                    onClick={() => void submitReply()}
                  >
                    {replyMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Сохранение…
                      </>
                    ) : (
                      'Сохранить ответ'
                    )}
                  </Button>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
