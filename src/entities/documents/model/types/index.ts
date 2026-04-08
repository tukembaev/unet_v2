
export type DocumentType = 'ORDER_STUD' | 'ORDER_EMPL' | 'APPLICATION' | 'MAIL' | 'REPORT';

export type DocumentTab = 'inbox' | 'outbox' | 'history';

export type DocumentScope = 'inbox' | 'outbox' | 'history';



// API Request Types
export interface DocumentListParams {
  offset?: number;
  limit?: number;
  scope: DocumentScope;
}

// API Response Types
export interface Document {
  id: string;
  sender_id: string;
  sender_full_name: string;
  type: DocumentType;
  title: string | null;
  status: string | null;
  created_at: string;
}

export type DocumentListResponse = Document[];

export interface DocumentMember {
  id: string;
  type_approval_id: string;
  type_approval_name: string;
  approve_name: string;
  member_id: string;
  member_full_name: string;
  queue: number;
  status: string;
  signature: string | null;
  reason_reject: string | null;
  turn: boolean;
}

export interface DocumentDetailResponse {
  id: string;
  sender_id: string;
  sender_full_name: string;
  type: DocumentType;
  title: string | null;
  status: string;
  created_at: string;
  file: string | null;
  members: DocumentMember[];
  files: {
    file:string;
    filename:string
  }[]
}

// Type Approval Types
export interface TypeApproval {
  id: string;
  title: string;
  approve_name: string;
}
