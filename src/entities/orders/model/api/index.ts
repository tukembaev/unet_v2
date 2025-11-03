import { apiClient } from 'shared/config';
import { InboxOrder, OrderDetail, OrdersResponse, OrderFilters, OrderHistoryResponse } from '../types';

export const ordersApi = {
  getOrders: async (filters: OrderFilters): Promise<OrdersResponse> => {
    // TODO: Implement real API call when backend is ready
    // const { data } = await apiClient.get('/inbox-orders', { params: filters });
    
    // Mock data for now
    const mockOrders: InboxOrder[] = [
      {
        id: 1,
        number: 'ORD-2025-001',
        title: 'Приказ о назначении комиссии по аттестации',
        order_number: '123-П',
        employee: {
          id: 1,
          user: 1,
          first_name: 'Иван',
          surname: 'Иванов',
          surname_name: 'Иванов Иван',
          short_name: 'Иванов И.',
          number_phone: '0700000001',
          imeag: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
          email: 'ivanov@example.com',
          division: 'Отдел кадров',
          position: 'Специалист',
          is_online: true,
        },
        addressee: 2,
        status: 'В режиме ожидания',
        date_zayavki: '24.10.2025 10:00',
        order_date: '25.10.2025',
        order_status: [],
        addressee_turn: true,
        is_watched: false,
      },
      {
        id: 2,
        number: 'ORD-2025-002',
        title: 'Приказ о проведении научной конференции',
        order_number: '124-П',
        employee: {
          id: 2,
          user: 2,
          first_name: 'Петр',
          surname: 'Петров',
          surname_name: 'Петров Петр',
          short_name: 'Петров П.',
          number_phone: '0700000002',
          imeag: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Petr',
          email: 'petrov@example.com',
          division: 'Научный отдел',
          position: 'Заведующий',
          is_online: false,
        },
        addressee: 3,
        status: 'В работе',
        date_zayavki: '23.10.2025 14:30',
        order_date: null,
        order_status: [
          {
            id: 1,
            status: true,
            order: 2,
            employee: 3,
          },
        ],
        addressee_turn: false,
        is_watched: true,
      },
    ];

    // Filter logic
    let filteredOrders = mockOrders;

    // Filter by tab
    if (filters.tab === 'incoming') {
      filteredOrders = mockOrders.filter((_, index) => index % 2 === 0);
    } else if (filters.tab === 'outgoing') {
      filteredOrders = mockOrders.filter((_, index) => index % 2 !== 0);
    }

    // Filter by statuses
    if (filters.statuses && filters.statuses.length > 0 && !filters.statuses.includes('all')) {
      filteredOrders = filteredOrders.filter(order => filters.statuses.includes(order.status));
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredOrders = filteredOrders.filter(
        order =>
          order.number.toLowerCase().includes(searchLower) ||
          order.title.toLowerCase().includes(searchLower) ||
          order.employee.surname_name.toLowerCase().includes(searchLower) ||
          (order.order_number && order.order_number.toLowerCase().includes(searchLower))
      );
    }

    return {
      orders: filteredOrders,
      total: filteredOrders.length,
      page: 1,
      pageSize: 10,
    };
  },

  createOrder: async (data: Partial<InboxOrder>): Promise<InboxOrder> => {
    // TODO: Implement real API call
    // const response = await apiClient.post('/inbox-orders', data);
    
    // Mock implementation
    const newOrder: InboxOrder = {
      id: Date.now(),
      number: `ORD-2025-${String(Date.now()).slice(-3)}`,
      title: data.title || '',
      order_number: null,
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
      addressee: data.addressee || 0,
      status: 'В режиме ожидания',
      date_zayavki: new Date().toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      order_date: null,
      order_status: [],
      addressee_turn: true,
      is_watched: false,
    };

    return newOrder;
  },
};

export const getOrderDetails = async (id: number): Promise<OrderDetail> => {
  const { data } = await apiClient.get(`/order/${id}`);
  return data;
};

export const getOrderHistory = async (id: number): Promise<OrderHistoryResponse> => {
  const { data } = await apiClient.get(`/order-history/${id}/`);
  return data;
};

