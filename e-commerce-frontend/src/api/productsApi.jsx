import apiClient from "./apiClient";

// Products API
export const productsAPI = {
  getAll: async () => {
    try {
        const response = await apiClient.get('/products');
        return response.data;
    } catch (error) {
        const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch all products';
        throw new Error(errorMessage);
    }
  },

  getById: async (id) => {
    try {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Failed to fetch product with ID: {id}`;
        throw new Error(errorMessage);
    }
  },

};