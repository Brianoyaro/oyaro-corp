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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoriesAPI.update,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
    },
  });
}