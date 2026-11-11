import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchOrganizations,
  fetchUdocLink,
  fetchUdocList,
  grantUdocAccess,
} from './api';
import type { GrantUdocAccessPayload, OrgUnitType } from './types';

export const udocKeys = {
  all: ['udoc'] as const,
  list: () => [...udocKeys.all, 'list'] as const,
  detail: (id: string) => [...udocKeys.all, 'detail', id] as const,
  orgs: (unitType: OrgUnitType) =>
    [...udocKeys.all, 'organizations', unitType] as const,
};

export function useUdocList() {
  return useQuery({
    queryKey: udocKeys.list(),
    queryFn: () => fetchUdocList(),
    staleTime: 30_000,
  });
}

export function useUdocLink(id: string | undefined) {
  return useQuery({
    queryKey: udocKeys.detail(id ?? ''),
    queryFn: () => fetchUdocLink(id!),
    enabled: Boolean(id),
  });
}

export function useOrganizations(unitType: OrgUnitType, enabled = true) {
  return useQuery({
    queryKey: udocKeys.orgs(unitType),
    queryFn: () => fetchOrganizations(unitType),
    enabled,
    staleTime: 5 * 60_000,
  });
}

export function useGrantUdocAccess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: GrantUdocAccessPayload) => grantUdocAccess(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: udocKeys.list() });
    },
  });
}
