import apiClient from "./apiClient";

export const orderApi = {
    getOrder: async (orderId) => {
         try {
            //
            const response = await apiClient.get(`/orders/user/${orderId}`)
            return response.data
        } catch  (error) {
            throw new Error(error?.response?.data?.message || error.message);
        }
    },

    getAllOrders: async() => {
        try {
            //
            const response = await apiClient.get(`/orders/user/all`)
            return response.data
        } catch  (error) {
            throw new Error(error?.response?.data?.message || error.message);
        }
    }
}