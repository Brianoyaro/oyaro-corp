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

  create: async (formData) => {
    try {
        const response = await apiClient.post('/products/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to create product';
        throw new Error(errorMessage);
    }
  },

  update: async ({id, formData}) => {
    try {
        const response = await apiClient.put(`/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Failed to update product with ID: {id}`;
        throw new Error(errorMessage);
    }
  },

  delete: async (id) => {
    try {
        const response = await apiClient.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Failed to delete product with ID: {id}`;
        throw new Error(errorMessage);
    }
  },

};