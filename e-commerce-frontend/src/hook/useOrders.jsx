import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { orderApi } from '../api/ordersApi';
import { useAuth } from './useAuth';

export function useOrder(id) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderApi.getOrder(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: orderApi.getAllOrders,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}