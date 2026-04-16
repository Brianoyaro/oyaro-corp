import api from './apiService';

const authService = {

    //login method to authenticate user and receive access token, refresh token and accessTokenExpiration time
  async login(credentials) {
    return api.post('/auth/login', credentials);
  },

  // register method to create a new user account
  async register(userData) {
    return api.post('/auth/register', userData);
  },
  
  // getUserProfile method to retrieve the authenticated user's profile information
  async getUserProfile() {
    return api.get('/user/profile');
  },
  
  // updateUserProfile method to update the authenticated user's profile information
  async updateUserProfile(profileData) {
    return api.put('/user/profile', profileData);
  },
  
  // refreshToken method to request a new access token using the refresh token
  async refreshToken(refreshToken) {
    return api.post('/auth/refresh-token', { refreshToken });
  },
};

export default authService;