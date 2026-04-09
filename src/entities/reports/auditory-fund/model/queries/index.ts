import { useQuery } from '@tanstack/react-query';
import { auditoryFundApi } from '../api';

export const auditoryFundKeys = {
  all: ['auditory-fund'] as const,
  rooms: () => [...auditoryFundKeys.all, 'rooms'] as const,
};

export function useAuditoryFundRooms() {
  return useQuery({
    queryKey: auditoryFundKeys.rooms(),
    queryFn: () => auditoryFundApi.getRooms(),
    staleTime: 5 * 60 * 1000,
  });
}
