import { apiClient } from 'shared/config';
import { Document, DocumentsResponse, DocumentFilters, DocumentDetailResponse, DocumentHistoryResponse } from '../types';

export const documentsApi = {
  getDocuments: async (filters: DocumentFilters): Promise<DocumentsResponse> => {
    // Mock data for now
    const mockDocuments: Document[] = [
      {
        id: 1373,
        number: "DOC - 2025-07-317977",
        employee: {
          id: 71802,
          user: 69297,
          first_name: "Irina",
          surname: "Kairatova",
          surname_name: "Kairatova Irina",
          short_name: "Kairatova I.",
          number_phone: "0702020202",
          imeag: "https://utask.kstu.kg/media/avatars/download.jpg",
          email: "azamatkenje10245@gmail.com",
          division: "The Boys",
          position: "Уборщик туалетов",
          is_online: false
        },
        type_doc: "Заявление",
        type: "Заявление на отпуск с 01.11.2025",
        status: "В режиме ожидания",
        date_zayavki: "31.07.2025 20:01",
        application_status: [
          {
            id: 417,
            status: true,
            application: 1373,
            employee: 71803
          }
        ],
        is_watched: true
      },
      {
        id: 1374,
        number: "DOC - 2025-07-317978",
        employee: {
          id: 71803,
          user: 69298,
          first_name: "Петр",
          surname: "Петров",
          surname_name: "Петров Петр",
          short_name: "Петров П.",
          number_phone: "0703030303",
          imeag: "https://utask.kstu.kg/media/avatars/default.jpg",
          email: "petrov@example.com",
          division: "IT отдел",
          position: "Разработчик",
          is_online: true
        },
        type_doc: "Письмо",
        type: "Служебное письмо о согласовании мероприятий",
        status: "В работе",
        date_zayavki: "01.08.2025 10:30",
        application_status: [],
        is_watched: false
      },
      {
        id: 1375,
        number: "DOC - 2025-07-317979",
        employee: {
          id: 71804,
          user: 69299,
          first_name: "Мария",
          surname: "Сидорова",
          surname_name: "Сидорова Мария",
          short_name: "Сидорова М.",
          number_phone: "0704040404",
          imeag: "https://utask.kstu.kg/media/avatars/user3.jpg",
          email: "sidorova@example.com",
          division: "Учебное управление",
          position: "Методист",
          is_online: false
        },
        type_doc: "Рапорт",
        type: "Отчет о проделанной работе за первый квартал 2025",
        status: "Выполнено",
        date_zayavki: "02.08.2025 14:20",
        application_status: [
          {
            id: 418,
            status: true,
            application: 1375,
            employee: 71805
          }
        ],
        is_watched: true
      },
      {
        id: 1376,
        number: "DOC - 2025-07-317980",
        employee: {
          id: 71805,
          user: 69300,
          first_name: "Андрей",
          surname: "Козлов",
          surname_name: "Козлов Андрей",
          short_name: "Козлов А.",
          number_phone: "0705050505",
          imeag: "https://utask.kstu.kg/media/avatars/user4.jpg",
          email: "kozlov@example.com",
          division: "Бухгалтерия",
          position: "Бухгалтер",
          is_online: true
        },
        type_doc: "Рапорт",
        type: "Финансовый отчет за сентябрь 2025",
        status: "В режиме ожидания",
        date_zayavki: "03.08.2025 11:45",
        application_status: [],
        is_watched: false
      },
      {
        id: 1377,
        number: "DOC - 2025-07-317981",
        employee: {
          id: 71806,
          user: 69301,
          first_name: "Елена",
          surname: "Новикова",
          surname_name: "Новикова Елена",
          short_name: "Новикова Е.",
          number_phone: "0706060606",
          imeag: "https://utask.kstu.kg/media/avatars/user5.jpg",
          email: "novikova@example.com",
          division: "Отдел кадров",
          position: "Специалист по кадрам",
          is_online: false
        },
        type_doc: "Письмо",
        type: "Письмо-запрос информации о проведении конференции",
        status: "Отклонено",
        date_zayavki: "04.08.2025 16:10",
        application_status: [
          {
            id: 419,
            status: false,
            application: 1377,
            employee: 71807
          }
        ],
        is_watched: true
      },
      {
        id: 1378,
        number: "DOC - 2025-07-317982",
        employee: {
          id: 71807,
          user: 69302,
          first_name: "Дмитрий",
          surname: "Морозов",
          surname_name: "Морозов Дмитрий",
          short_name: "Морозов Д.",
          number_phone: "0707070707",
          imeag: "https://utask.kstu.kg/media/avatars/user6.jpg",
          email: "morozov@example.com",
          division: "Юридический отдел",
          position: "Юрист",
          is_online: true
        },
        type_doc: "Заявление",
        type: "Заявление о переводе на другую должность",
        status: "В работе",
        date_zayavki: "05.08.2025 13:30",
        application_status: [
          {
            id: 420,
            status: true,
            application: 1378,
            employee: 71808
          }
        ],
        is_watched: false
      },
    ];

    // Filter by tab
    let filteredDocs = mockDocuments;
    if (filters.tab === 'incoming') {
      filteredDocs = mockDocuments.filter((_, index) => index % 2 === 0);
    } else if (filters.tab === 'outgoing') {
      filteredDocs = mockDocuments.filter((_, index) => index % 2 !== 0);
    }

    // Filter by types
    if (filters.types && filters.types.length > 0 && !filters.types.includes('all')) {
      filteredDocs = filteredDocs.filter(doc => filters.types.includes(doc.type_doc));
    }

    // Filter by statuses
    if (filters.statuses && filters.statuses.length > 0 && !filters.statuses.includes('all')) {
      filteredDocs = filteredDocs.filter(doc => filters.statuses.includes(doc.status));
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredDocs = filteredDocs.filter(
        doc =>
          doc.number.toLowerCase().includes(searchLower) ||
          doc.employee.surname_name.toLowerCase().includes(searchLower) ||
          doc.type.toLowerCase().includes(searchLower)
      );
    }

    return {
      documents: filteredDocs,
      total: filteredDocs.length,
      page: 1,
      pageSize: 10,
    };
  },

  createDocument: async (data: Partial<Document>): Promise<Document> => {
    // Mock implementation
    const newDocument: Document = {
      id: Date.now(),
      number: `DOC - 2025-07-${String(Date.now()).slice(-6)}`,
      employee: data.employee || {
        id: 0,
        user: 0,
        first_name: '',
        surname: '',
        surname_name: '',
        short_name: '',
        number_phone: '',
        imeag: '',
        email: '',
        division: '',
        position: '',
        is_online: false,
      },
      type_doc: data.type_doc || 'Заявление',
      type: data.type || '',
      status: 'В режиме ожидания',
      date_zayavki: new Date().toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      application_status: [],
      is_watched: false,
    };

    return newDocument;
  },
};

export const getDocumentDetails = async (id: number): Promise<DocumentDetailResponse> => {
  const { data } = await apiClient.get(`conversion/raport/${id}/`);
  return data;
};

export const getDocumentHistory = async (id: number): Promise<DocumentHistoryResponse> => {
  const { data } = await apiClient.get(`conversion/conversion-history/${id}/`);
  return data;
};