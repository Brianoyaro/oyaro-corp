import apiClient from "./apiClient";

export const paystackApi = {
    initialize: async (data) => {
        try {
            const response = await apiClient.post('/paystack/initialize', data)
            return response.data
        } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'Failed to fetch all products';
            throw new Error(errorMessage);
        }
    },

    verify: async (reference) => {
        try {
            const response = await apiClient.post(`/paystack/verify/${reference}`)
            return response.data
        } catch (error) {
            const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'Failed to fetch all products';
            throw new Error(errorMessage);
        }
    },

}