export type SupportCategory = {
  id: string;
  title: string;
};

export type SupportRequestPayload = {
  title: string;
  description: string;
  category_id: string;
  feedback_email: string;
  files?: File[];
};

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | string;

export type SupportTicketResponse = {
  ticket_number: string;
  title: string;
  status: TicketStatus;
  category: string;
  created_at: string;
  updated_at: string;
};

export type SupportTicketDetail = SupportTicketResponse & {
  files: string[];
  description?: string;
  feedback_email?: string;
};

export type ListTicketsParams = {
  status?: TicketStatus | '';
  limit?: number;
  offset?: number;
};

export type TicketReplyPayload = {
  text: string;
  status: TicketStatus;
};
