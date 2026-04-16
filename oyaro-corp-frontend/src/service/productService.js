import api from './apiService';

const productService = {
  // Fetch all categories with tree structure
  async getCategories() {
    return api.get('/categories/tree');
  },

  // Fetch direct children of a category
  async getCategoryChildren(categoryId) {
    return api.get(`/categories/${categoryId}/children`);
  },

  // Fetch all products
  async getAllProducts() {
    return api.get('/products');
  },

  // Fetch a specific product
  async getProduct(productId) {
    return api.get(`/products/${productId}`);
  },

  // Fetch products by category ID (frontend filtering)
  // Since backend doesn't have a direct endpoint, we fetch all and filter
  async getProductsByCategory(categoryId) {
    const response = await api.get('/products');
    return {
      ...response,
      data: response.data.filter((product) => product.categoryId === categoryId),
    };
  },
};

export default productService;
