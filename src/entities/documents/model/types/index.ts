import { BaseHistory } from 'shared/components/history';

export type DocumentType = 'Рапорт' | 'Письмо' | 'Заявление' | 'all';

export type DocumentStatus = 'В режиме ожидания' | 'В работе' | 'Выполнено' | 'Отклонено' | 'all';

export type DocumentTab = 'incoming' | 'outgoing' | 'history';

export interface Employee {
  id: number;
  user: number;
  first_name: string;
  surname: string;
  surname_name: string;
  short_name: string;
  number_phone: string;
  imeag: string;
  email: string;
  division: string;
  position: string;
  is_online: boolean;
}

export interface ApplicationStatus {
  id: number;
  status: boolean;
  application: number;
  employee: number;
}

export interface Document {
  id: number;
  number: string;
  employee: Employee;
  type_doc: string;
  type: string;
  status: string;
  date_zayavki: string;
  application_status: ApplicationStatus[];
  is_watched: boolean;
}

export interface DocumentsResponse {
  documents: Document[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DocumentFilters {
  tab: DocumentTab;
  types: string[];
  statuses: string[];
  search?: string;
}

// export interface ApplicationMember {
//   // Define fields if applicationmember array has structure in other data
//   // Currently empty in dataDoc, so left as empty interface
// }

// export interface Task {
//   // Define fields if tasks array has structure in other data
//   // Currently empty in dataDoc, so left as empty interface
// }

export interface DocumentDetailResponse {
  id: number;
  employee: Employee;
  secretary: Employee | null;
  user_id_prorector: number;
  addressee: number;
  number_addressee: string;
  division: string;
  position: string;
  photo: string;
  type_doc: DocumentType | string; // Allow string for flexibility if other types exist
  prorector: string;
  prorector_name: string;
  number: string;
  type: string;
  podtypezayavki: string | null;
  status: DocumentStatus | string; // Allow string for flexibility if other statuses exist
  text: string;
  date_zayavki: string;
  prich_pr_otkaz: string | null;
  prorectorcheck: string | null;
  has_tasks: boolean;
  prorector_date_check: string | null;
  rukovpodcheck: string | null;
  rukovpod_date_check: string | null;
  ispolnpodcheck: string | null;
  agreement: string;
  agreement_comment: string | null;
  file: string;
  files: string[];
  applicationmember: string[];
  application_status: ApplicationStatus[];
  tasks: string[];
  very_urgent: boolean;
  service: string | null;
  is_watched: boolean;
}

export interface DocumentHistoryItem extends BaseHistory {
  application: number;
}

export type DocumentHistoryResponse = DocumentHistoryItem[];