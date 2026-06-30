import apiClient from "./apiClient";

export const cartApi =  {

    getCart: async () => {
        try {
            //
            const response = await apiClient.get("/cart")
            return response.data
        } catch  (error) {
            throw new Error(error);
        }
    },

    removeFromCart: async (productId) => {
        try {
            const response = await apiClient.delete(`/cart/${productId}`)
            return response.data
        } catch (error) {
            throw new Error(error)
        }
    },

    clearCart: async () => {
        try {
            const response = await apiClient.delete("/cart/clear/all")
            return response.data
        } catch (error) {
            throw new Error(error)
        }
    },

    addToCart: async (data) => {
        try {
            const response = await apiClient.post("/cart/add", data)
            return response.data
        } catch (error) {
            throw new Error(error)
        }
    },

    updateItem: async (productId, newQuantity) => {
        try {
            const response = await apiClient.put(`/cart/update/${productId}`, { newQuantity: newQuantity})
            return response.data
        } catch (error) {
            throw new Error(error)
        }
    },
}