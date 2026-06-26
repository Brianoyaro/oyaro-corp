import apiClient from "./apiClient";

/**
 * Profile API Service
 * Handles user profile-related API calls
 * All endpoints require authentication
 */

export const profileAPI = {
  /**
   * Get the authenticated user's profile
   * @returns {Promise<Object>} User profile data
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get('/user/profile');
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch profile';
      throw new Error(errorMessage);
    }
  }
}