import axios from 'axios';
import type {
  AuditoryFundCampus,
  AuditoryFundKorpus,
  AuditoryFundRoomType,
  AuditoryFundRoomsParams,
  AuditoryFundRoomsResponse,
} from '../types';

const QR_API_BASE = 'https://qr.kstu.kg/api';

const qrClient = axios.create({
  baseURL: QR_API_BASE,
  timeout: 20000,
  headers: { Accept: 'application/json' },
});

export const auditoryFundApi = {
  getCampuses: async (): Promise<AuditoryFundCampus[]> => {
    const { data } = await qrClient.get<unknown>('campuses/');
    return Array.isArray(data) ? (data as AuditoryFundCampus[]) : [];
  },

  getKorpuses: async (campusId: number): Promise<AuditoryFundKorpus[]> => {
    const { data } = await qrClient.get<unknown>('korpuses/', {
      params: { campus: campusId },
    });
    return Array.isArray(data) ? (data as AuditoryFundKorpus[]) : [];
  },

  getRoomTypes: async (): Promise<AuditoryFundRoomType[]> => {
    const { data } = await qrClient.get<unknown>('room-types/');
    return Array.isArray(data) ? (data as AuditoryFundRoomType[]) : [];
  },

  getRooms: async (
    params: AuditoryFundRoomsParams = {}
  ): Promise<AuditoryFundRoomsResponse> => {
    const { data } = await qrClient.get<AuditoryFundRoomsResponse>('qr-records/', {
      params: {
        page: params.page ?? 1,
        page_size: params.page_size ?? 50,
        ...(params.campus != null ? { campus: params.campus } : {}),
        ...(params.korpus != null ? { korpus: params.korpus } : {}),
        ...(params.room_type ? { room_type: params.room_type } : {}),
        ...(params.search?.trim() ? { search: params.search.trim() } : {}),
      },
    });

    return {
      count: Number(data?.count ?? 0),
      next: data?.next ?? null,
      previous: data?.previous ?? null,
      results: Array.isArray(data?.results) ? data.results : [],
    };
  },
};
