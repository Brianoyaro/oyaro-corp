import apiClient from "./apiClient";

export const cartApi =  {

    getCart: async () => {
        try {
            //
            console.log("Fetching user's cart from the backend");
            const response = await apiClient.get("/cart")
            return response.data
        } catch  (error) {
            console.error("Failed to fetch user's cart");
            throw new Error(error);
        }
    },

    removeFromCart: async (productId) => {
        try {
            console.log(`removing product with id: ${productId} from user's cart`)
            const response = await apiClient.delete(`/cart/${productId}`)
            return response.data
        } catch (error) {
            console.error("Could not remove item from cart{BACKEND")
            throw new Error(error)
        }
    },

    clearCart: async () => {
        try {
            console.log("Clearing user's cart")
            const response = await apiClient.delete("/cart/clear/all")
            return response.data
        } catch (error) {
            console.error("Failed to clear user's cart")
            throw new Error(error)
        }
    },

    addToCart: async (data) => {
        try {
            console.log("adding item to cart")
            const response = await apiClient.post("/cart/add", data)
            console.log(response)
            return response.data
        } catch (error) {
            console.error("Failed to add product to cart")
            throw new Error(error)
        }
    },

    updateItem: async (productId, newQuantity) => {
        try {
            console.log("Updating product quantity in cart")
            const response = await apiClient.put(`/cart/update/${productId}`, { newQuantity: newQuantity})
            return response.data
        } catch (error) {
            console.error("Failed to update product item in the cart")
            throw new Error(error)
        }
    },
}