import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getHttpErrorMessage } from 'shared/lib/http-error';

import {
  getSupportCategories,
  getSupportTicket,
  listSupportTickets,
  replySupportTicket,
  submitSupportRequest,
} from '../api';
import type {
  ListTicketsParams,
  SupportRequestPayload,
  TicketReplyPayload,
} from '../types';

export const supportKeys = {
  all: ['support'] as const,
  categories: () => [...supportKeys.all, 'categories'] as const,
  tickets: (params: ListTicketsParams) =>
    [...supportKeys.all, 'tickets', params] as const,
  ticket: (ticketNumber: string | null) =>
    [...supportKeys.all, 'ticket', ticketNumber] as const,
};

export function useSupportCategories() {
  return useQuery({
    queryKey: supportKeys.categories(),
    queryFn: getSupportCategories,
    staleTime: 10 * 60 * 1000,
  });
}

export function useSubmitSupportRequest() {
  return useMutation({
    mutationFn: (payload: SupportRequestPayload) =>
      submitSupportRequest(payload),
  });
}

export function useSupportTickets(params: ListTicketsParams = {}) {
  return useQuery({
    queryKey: supportKeys.tickets(params),
    queryFn: () => listSupportTickets(params),
  });
}

export function useSupportTicket(ticketNumber: string | null) {
  return useQuery({
    queryKey: supportKeys.ticket(ticketNumber),
    queryFn: () => getSupportTicket(ticketNumber!),
    enabled: Boolean(ticketNumber),
  });
}

export function useReplySupportTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ticketNumber,
      payload,
    }: {
      ticketNumber: string;
      payload: TicketReplyPayload;
    }) => replySupportTicket(ticketNumber, payload),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: supportKeys.ticket(variables.ticketNumber),
        }),
        queryClient.invalidateQueries({
          queryKey: [...supportKeys.all, 'tickets'],
        }),
      ]);
      toast.success('Ответ сохранён');
    },
    onError: (error) => {
      toast.error('Не удалось сохранить ответ', {
        description: getHttpErrorMessage(error),
      });
    },
  });
}
