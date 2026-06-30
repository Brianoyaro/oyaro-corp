import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { categoriesAPI } from '../api/categoriesApi';


export function useCategory(id) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoriesAPI.getOne(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesAPI.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoriesAPI.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoriesAPI.update,
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      await queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoriesAPI.delete,
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({queryKey: ["categories"],});
      await queryClient.removeQueries({ queryKey: ["category", id],});
      await queryClient.invalidateQueries({ queryKey: ["products"],});
    },
  });
}