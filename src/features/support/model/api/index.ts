import {
  apiSupportClient,
  apiSupportPublicClient,
} from 'shared/config/support_axios';

import type {
  ListTicketsParams,
  SupportCategory,
  SupportRequestPayload,
  SupportTicketDetail,
  SupportTicketResponse,
  TicketReplyPayload,
  TicketStatus,
} from '../types';

function asList(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (
    raw &&
    typeof raw === 'object' &&
    Array.isArray((raw as { results?: unknown }).results)
  ) {
    return (raw as { results: unknown[] }).results;
  }
  return [];
}

function toCategory(raw: unknown): SupportCategory | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  const id = String(item.id ?? '').trim();
  const title = String(item.title ?? item.label ?? item.name ?? '').trim();
  if (!id || !title) return null;
  return { id, title };
}

function toTicket(raw: unknown): SupportTicketResponse | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  const ticket_number = String(item.ticket_number ?? '').trim();
  if (!ticket_number) return null;
  return {
    ticket_number,
    title: String(item.title ?? ''),
    status: String(item.status ?? '') as TicketStatus,
    category: String(item.category ?? ''),
    created_at: String(item.created_at ?? ''),
    updated_at: String(item.updated_at ?? ''),
  };
}

function toTicketDetail(raw: unknown): SupportTicketDetail | null {
  const base = toTicket(raw);
  if (!base || !raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  const files = Array.isArray(item.files)
    ? item.files.map((file) => String(file))
    : [];
  return {
    ...base,
    files,
    description:
      item.description != null ? String(item.description) : undefined,
    feedback_email:
      item.feedback_email != null ? String(item.feedback_email) : undefined,
  };
}

/** GET /category — публичный справочник тем обращений. */
export async function getSupportCategories(): Promise<SupportCategory[]> {
  const { data } = await apiSupportPublicClient.get<unknown>('/category');
  return asList(data)
    .map(toCategory)
    .filter((item): item is SupportCategory => item != null);
}

/** POST /ticket/create — публичная отправка обращения (multipart). */
export async function submitSupportRequest(
  payload: SupportRequestPayload
): Promise<SupportTicketResponse> {
  const formData = new FormData();
  formData.append('title', payload.title.trim());
  formData.append('description', payload.description.trim());
  formData.append('category_id', payload.category_id);
  formData.append('feedback_email', payload.feedback_email.trim());

  for (const file of payload.files ?? []) {
    formData.append('file', file);
  }

  const { data } = await apiSupportPublicClient.post<unknown>(
    '/ticket/create',
    formData
  );

  return (
    toTicket(data) ?? {
      ticket_number: '',
      title: payload.title,
      status: 'OPEN',
      category: '',
      created_at: '',
      updated_at: '',
    }
  );
}

/** GET /tickets — список обращений (для сотрудников). */
export async function listSupportTickets(
  params: ListTicketsParams = {}
): Promise<SupportTicketResponse[]> {
  const { data } = await apiSupportClient.get<unknown>('/tickets', {
    params: {
      ...(params.status ? { status: params.status } : {}),
      ...(params.limit != null ? { limit: params.limit } : {}),
      ...(params.offset != null ? { offset: params.offset } : {}),
    },
  });
  return asList(data)
    .map(toTicket)
    .filter((item): item is SupportTicketResponse => item != null);
}

/** GET /ticket/{ticket_number} */
export async function getSupportTicket(
  ticketNumber: string
): Promise<SupportTicketDetail> {
  const { data } = await apiSupportClient.get<unknown>(
    `/ticket/${encodeURIComponent(ticketNumber)}`
  );
  const ticket = toTicketDetail(data);
  if (!ticket) throw new Error('Не удалось прочитать обращение');
  return ticket;
}

/** PATCH /ticket/{ticket_number}/reply */
export async function replySupportTicket(
  ticketNumber: string,
  payload: TicketReplyPayload
): Promise<void> {
  await apiSupportClient.patch(
    `/ticket/${encodeURIComponent(ticketNumber)}/reply`,
    payload
  );
}
