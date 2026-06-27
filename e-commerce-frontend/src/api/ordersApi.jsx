import apiClient from "./apiClient";

export const orderApi = {
    getOrder: async (orderId) => {
         try {
            //
            console.log("Fetching user's order from the backend");
            const response = await apiClient.get(`/orders/user/${orderId}`)
            return response.data
        } catch  (error) {
            console.error("Failed to fetch user's order");
            throw new Error(error?.response?.data?.message || error.message);
        }
    },

    getAllOrders: async() => {
        try {
            //
            console.log("Fetching user's orders from the backend");
            const response = await apiClient.get(`/orders/user/all`)
            return response.data
        } catch  (error) {
            console.error("Failed to fetch user's orders");
            throw new Error(error?.response?.data?.message || error.message);
        }
    }
}