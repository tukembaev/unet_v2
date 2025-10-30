import { BaseHistory } from 'shared/components/history';

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

export interface OrderStatus {
  id: number;
  status: boolean;
  order: number;
  employee: number;
}

export interface InboxOrder {
  id: number;
  number: string;
  title: string;
  order_number: string | null;
  employee: Employee;
  addressee: number;
  status: string;
  date_zayavki: string;
  order_date: string | null;
  order_status: OrderStatus[];
  addressee_turn: boolean;
  is_watched: boolean;
}

export interface OrderMember {
  id: number;
  order: number;
  type_approval: number;
  name_approval: string;
  is_online: boolean;
  user: number;
  member: number;
  name: string;
  image: string;
  position: string;
  member_check: string;
  date_check_member: string;
  status: string;
  member_refusal: string | null;
  repeat_comment: string | null;
  member_queue: number;
  turn: boolean;
  sign: string;
  short_name: string;
}

export interface OrderDetail extends InboxOrder {
  photo: string;
  number_addressee: string;
  position: string;
  division: string;
  employee_name: string;
  ispolnpodcheck: string;
  ispolnpodsign: string;
  user_id_prorector: number;
  prorector: string;
  prorectorcheck: string;
  prorectorsign: string;
  prorector_date_check: string;
  agreement: string | null;
  agreement_comment: string | null;
  refuser: string | null;
  prich_pr_otkaz: string;
  date_refusal: string | null;
  file: string;
  file_2: string | null;
  file_sign: string;
  check_sign: boolean;
  ordermember: OrderMember[];
  short_name: string;
}

// Additional helper types
export type OrderTab = 'incoming' | 'outgoing' | 'history';

export interface OrderFilters {
  tab: OrderTab;
  statuses: string[];
  search?: string;
}

export interface OrdersResponse {
  orders: InboxOrder[];
  total: number;
  page: number;
  pageSize: number;
}

export interface OrderHistoryItem extends BaseHistory {
  order: number;
}

export type OrderHistoryResponse = OrderHistoryItem[];

