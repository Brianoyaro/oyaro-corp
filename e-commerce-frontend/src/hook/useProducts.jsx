import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { productsAPI } from '../api/productsApi';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsAPI.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function  useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productsAPI.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productsAPI.update,
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      await queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productsAPI.delete,
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      await queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    },
  });
}