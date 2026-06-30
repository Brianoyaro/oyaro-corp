import apiClient from "./apiClient";

// Categories API
export const categoriesAPI = {
    getAll: async () => {
        try {
            const response = await apiClient.get('/categories');
            return response.data;
        } catch (error) {
            const errorMessage =
            error.response?.data?.message ||
            error.message ||
            `Failed to fetch categories`;
            throw new Error(errorMessage);
        }},

    getOne: async (id) => {
        try {
            const response = await apiClient.get(`/categories/${id}`);
            return response.data;
        } catch (error) {
            const errorMessage =
            error.response?.data?.message ||
            error.message ||
            `Failed to fetch categories`;
            throw new Error(errorMessage);
        }},
    
    create: async (categoryData) => {
        try {
            const response = await apiClient.post('/categories/create', categoryData);
            return response.data;
        } catch (error) {
            const errorMessage =
            error.response?.data?.message ||
            error.message ||
            `Failed to create category`;
            throw new Error(errorMessage);
        }},

    delete: async (categoryId) => {
        try {
            const response = await apiClient.delete(`/categories/${categoryId}`);
            return response.data;
        } catch (error) {
            const errorMessage =
            error.response?.data?.message ||
            error.message ||
            `Failed to delete category`;
            throw new Error(errorMessage);
        }},
    
    update: async ({ id, data }) => {
        
        try {
            const response = await apiClient.put(
            `/categories/${id}`,
            data
            );

            return response.data;
        } catch (error) {
            const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to update category";

            throw new Error(errorMessage);
        }},
};