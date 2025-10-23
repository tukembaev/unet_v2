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
