import api from './apiService';

const cartService = {
  // Get user's cart from backend
  async getCart() {
    return api.get('/cart');
  },

  // Add item to cart
  async addToCart(productId, quantity = 1) {
    return api.post('/cart/add', { productId, quantity });
  },

  // Update cart item quantity
  async updateCartItem(productId, quantity) {
    return api.put(`/cart/items/${productId}`, { quantity });
  },

  // Remove item from cart
  async removeFromCart(productId) {
    return api.delete(`/cart/items/${productId}`);
  },

  // Clear entire cart
  async clearCart() {
    return api.delete('/cart');
  },

  // ===== LOCAL STORAGE FALLBACK FOR UNAUTHENTICATED USERS =====
  
  // Get local cart (when not logged in)
  getLocalCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },

  // Add to local cart
  addToLocalCart(product, quantity = 1) {
    const cart = this.getLocalCart();
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images?.[0]?.imageUrl,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },

  // Update local cart item
  updateLocalCartItem(productId, quantity) {
    const cart = this.getLocalCart();
    const item = cart.find((item) => item.id === productId);

    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        cart = cart.filter((item) => item.id !== productId);
      }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },

  // Remove from local cart
  removeFromLocalCart(productId) {
    const cart = this.getLocalCart().filter((item) => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },

  // Clear local cart
  clearLocalCart() {
    localStorage.removeItem('cart');
  },

  // Sync local cart to backend (on login)
  async syncLocalCartToBackend() {
    const localCart = this.getLocalCart();
    if (localCart.length === 0) return;

    // Add each local cart item to backend
    for (const item of localCart) {
      try {
        await this.addToCart(item.id, item.quantity);
      } catch (error) {
        console.error(`Failed to sync item ${item.id}:`, error);
      }
    }

    // Clear local cart after sync
    this.clearLocalCart();
  },
};

export default cartService;
