import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, getOrderDetails, getOrderHistory } from '../api';
import { OrderFilters, InboxOrder } from '../types';

export const ORDERS_QUERY_KEY = 'orders';
export const ORDER_DETAILS_QUERY_KEY = 'order-details';
export const ORDER_HISTORY_QUERY_KEY = 'order-history';

export const useOrders = (filters: OrderFilters) => {
  return useQuery({
    queryKey: [ORDERS_QUERY_KEY, filters],
    queryFn: () => ordersApi.getOrders(filters),
  });
};

export const useOrderDetails = (id: number) => {
  return useQuery({
    queryKey: [ORDER_DETAILS_QUERY_KEY, id],
    queryFn: () => getOrderDetails(id),
    enabled: !!id,
  });
};

export const useOrderHistory = (id: number) => {
  return useQuery({
    queryKey: [ORDER_HISTORY_QUERY_KEY, id],
    queryFn: () => getOrderHistory(id),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<InboxOrder>) => ordersApi.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
    },
  });
};

