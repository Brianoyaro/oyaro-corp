import apiClient from "./apiClient";

export const authAPI = {
  /**
   * Register a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Registration response
   */
  register: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/register', {
        email,
        password,
        role: 'USER',
      });

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Registration failed';

      throw new Error(errorMessage);
    }
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login response with tokens
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Login failed';

      throw new Error(errorMessage);
    }
  },

  /**
   * Refresh access token
   * @param {string} token - Refresh token
   * @returns {Promise<Object>} New token response
   */
  refreshToken: async (token) => {
    try {
      const response = await apiClient.post('/auth/refresh-token', {
        token,
      });

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Token refresh failed';

      throw new Error(errorMessage);
    }
  },

  /**
   * Check auth service health
   * @returns {Promise<Object>} Health status
   */
  health: async () => {
    try {
      const response = await apiClient.get('/auth/health');
      return response.data;
    } catch (error) {
      throw new Error('Auth service is unavailable');
    }
  },
}