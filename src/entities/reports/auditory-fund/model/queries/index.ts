import { useQuery } from '@tanstack/react-query';
import { auditoryFundApi } from '../api';
import type { AuditoryFundRoomsParams } from '../types';

export const auditoryFundKeys = {
  all: ['auditory-fund'] as const,
  campuses: () => [...auditoryFundKeys.all, 'campuses'] as const,
  korpuses: (campusId: number | null) =>
    [...auditoryFundKeys.all, 'korpuses', campusId] as const,
  roomTypes: () => [...auditoryFundKeys.all, 'room-types'] as const,
  rooms: (params: AuditoryFundRoomsParams) =>
    [...auditoryFundKeys.all, 'rooms', params] as const,
};

export function useAuditoryFundCampuses() {
  return useQuery({
    queryKey: auditoryFundKeys.campuses(),
    queryFn: () => auditoryFundApi.getCampuses(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useAuditoryFundKorpuses(campusId: number | null) {
  return useQuery({
    queryKey: auditoryFundKeys.korpuses(campusId),
    queryFn: () => auditoryFundApi.getKorpuses(campusId!),
    enabled: campusId != null,
    staleTime: 10 * 60 * 1000,
  });
}

export function useAuditoryFundRoomTypes() {
  return useQuery({
    queryKey: auditoryFundKeys.roomTypes(),
    queryFn: () => auditoryFundApi.getRoomTypes(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useAuditoryFundRooms(params: AuditoryFundRoomsParams) {
  return useQuery({
    queryKey: auditoryFundKeys.rooms(params),
    queryFn: () => auditoryFundApi.getRooms(params),
    staleTime: 60 * 1000,
    placeholderData: (previous) => previous,
  });
}
