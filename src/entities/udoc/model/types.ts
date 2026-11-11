export type OrgUnitType =
  | 'UNIVERSITY'
  | 'COLLEGE'
  | 'BRANCH'
  | 'INSTITUTE'
  | 'DEPARTMENT'
  | 'DIVISION';

export type UdocAccessScope = 'employee' | 'student' | 'public';

export interface OrganizationUnit {
  id: string;
  name: string;
  abbreviation: string | null;
  unit_type: OrgUnitType | string;
  parent_id: string | null;
  has_children?: boolean;
  children_count?: number;
}

export interface UdocListItem {
  id: string;
  title: string | null;
  description: string | null;
}

export interface UdocLink {
  link: string;
}

export interface GrantUdocAccessPayload {
  file: File;
  title?: string;
  description?: string;
  department_ids?: string[];
  user_ids?: string[];
  access_scope?: UdocAccessScope;
}

export const ORG_UNIT_TYPE_OPTIONS: { value: OrgUnitType; label: string }[] = [
  { value: 'DEPARTMENT', label: 'Кафедра' },
  { value: 'INSTITUTE', label: 'Институт' },
  { value: 'DIVISION', label: 'Отдел' },
  { value: 'COLLEGE', label: 'Колледж' },
  { value: 'BRANCH', label: 'Филиал' },
  { value: 'UNIVERSITY', label: 'Университет' },
];
