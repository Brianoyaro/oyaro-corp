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
    }
  },
};