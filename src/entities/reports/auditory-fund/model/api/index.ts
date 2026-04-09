import axios from 'axios';
import type { AuditoryFundRoom } from '../types';

const QR_CODES_URL = 'https://qr.kstu.kg/qrcodes/';

export const auditoryFundApi = {
  getRooms: async (): Promise<AuditoryFundRoom[]> => {
    const { data } = await axios.get<unknown>(QR_CODES_URL, {
      timeout: 20000,
      headers: { Accept: 'application/json' },
    });

    return Array.isArray(data) ? (data as AuditoryFundRoom[]) : [];
  },
};
