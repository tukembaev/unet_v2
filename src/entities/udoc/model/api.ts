import { apiDocsClient } from 'shared/config/docs_axios';
import { apiUserClient } from 'shared/config';
import type {
  GrantUdocAccessPayload,
  OrganizationUnit,
  OrgUnitType,
  UdocLink,
  UdocListItem,
} from './types';

export async function fetchOrganizations(
  unitType: OrgUnitType
): Promise<OrganizationUnit[]> {
  const { data } = await apiUserClient.get<OrganizationUnit[]>(
    'organizations',
    {
      params: { unit_type: unitType },
      timeout: 30000,
    }
  );
  return Array.isArray(data) ? data : [];
}

export async function fetchUdocList(params?: {
  offset?: number;
  limit?: number;
}): Promise<UdocListItem[]> {
  const { data } = await apiDocsClient.get<UdocListItem[]>(
    'v1/docshare/docs/',
    { params: { offset: params?.offset ?? 0, limit: params?.limit ?? 50 } }
  );
  return Array.isArray(data) ? data : [];
}

export async function fetchUdocLink(id: string): Promise<UdocLink> {
  const { data } = await apiDocsClient.get<UdocLink>(`v1/docshare/docs/${id}/`);
  return data;
}

export async function grantUdocAccess(
  payload: GrantUdocAccessPayload
): Promise<UdocListItem> {
  const formData = new FormData();
  formData.append('file', payload.file);
  if (payload.title?.trim()) formData.append('title', payload.title.trim());
  if (payload.description?.trim()) {
    formData.append('description', payload.description.trim());
  }
  if (payload.access_scope) {
    formData.append('access_scope', payload.access_scope);
  }
  if (payload.department_ids?.length) {
    formData.append('department_ids', payload.department_ids.join(','));
  }
  if (payload.user_ids?.length) {
    formData.append('user_ids', payload.user_ids.join(','));
  }

  const { data } = await apiDocsClient.post<UdocListItem>(
    'v1/docshare/granting_access/',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    }
  );
  return data;
}
