// communicates with the backend
import axios from 'axios';

const baseURL = 'http://localhost:8080/api';

// create an axios instance with default configuration
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// add a request interceptor to include the auth token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // get token from local storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // set Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// add a refresh token interceptor to handle 401 errors and refresh the access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // prevent infinite loop
      try {
        const refreshToken = localStorage.getItem('refreshToken'); // get refresh token from local storage
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        // request a new access token using the refresh token
        const response = await axios.post(`${baseURL}/auth/refresh-token`, { refreshToken });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken); // update access token in local storage
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`; // update Authorization header
        return api(originalRequest); // retry the original request
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken'); // clear tokens on failure
        localStorage.removeItem('refreshToken');
        //clearStore(); // clear any relevant state in your app (e.g., user info, auth status) -> implement this function in zustand store
        window.location.href = '/login'; // redirect to login page
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }

  // Example API methods
  /*
  async login(credentials) {
    return api.post('/auth/login', credentials);
  },
  async register(userData) {
    return api.post('/auth/register', userData);
  },
  async getUserProfile() {
    return api.get('/user/profile');
  },

    async updateUserProfile(profileData) {
    return api.put('/user/profile', profileData);
  },
  async uploadFile(fileData) {
    const formData = new FormData();
    formData.append('file', fileData);
    return api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  */
);
export default api;