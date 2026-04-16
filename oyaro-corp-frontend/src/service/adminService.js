import api from './apiService';

const adminService = {
  // ===== CATEGORIES =====
  async createCategory(categoryData) {
    return api.post('/categories', categoryData);
  },

  async updateCategory(categoryId, categoryData) {
    return api.put(`/categories/${categoryId}`, categoryData);
  },

  async deleteCategory(categoryId) {
    return api.delete(`/categories/${categoryId}`);
  },

  async getCategories() {
    return api.get('/categories/tree');
  },

  // ===== PRODUCTS =====
  async createProduct(productData, images, primaryIndex) {
    const formData = new FormData();
    formData.append('product', JSON.stringify(productData));
    images.forEach((image, index) => {
      formData.append('images', image);
    });
    formData.append('primaryIndex', primaryIndex);

    return api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async updateProduct(productId, productData) {
    return api.put(`/products/${productId}`, productData);
  },

  async deleteProduct(productId) {
    return api.delete(`/products/${productId}`);
  },

  async getAllProducts() {
    return api.get('/products');
  },

  async addProductImages(productId, images) {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    return api.post(`/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async deleteProductImage(imageId) {
    return api.delete(`/products/images/${imageId}`);
  },

  // ===== ORDERS =====
  async getAllOrders() {
    return api.get('/orders');
  },

  async getOrder(orderId) {
    return api.get(`/orders/${orderId}`);
  },

  async deleteOrder(orderId) {
    return api.delete(`/orders/${orderId}`);
  },

  // ===== PAYMENTS =====
  async getAllPayments() {
    return api.get('/payments');
  },

  async getPayment(paymentId) {
    return api.get(`/payments/${paymentId}`);
  },

  async updatePaymentStatus(paymentId, status) {
    return api.put(`/payments/${paymentId}/status`, { status });
  },
};

export default adminService;
