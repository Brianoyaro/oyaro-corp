import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};


// Add request interceptor to inject authorization token
apiClient.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('accessToken');


    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh on 401 or 403 (expired token)
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const originalRequest = error.config;

    // Handle 401 (Unauthorized) or 403 (Forbidden - likely expired token)
    // if (error.response?.status === 401 && originalRequest.url?.includes('/user')) {
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          // Dispatch logout event to notify AuthContext
          window.dispatchEvent(new Event('logout'));
          window.location.href = '/login';
          reject(error);
          return;
        }


        axios
          .post(`${API_BASE_URL}/auth/refresh-token`, { token: refreshToken })
          .then(response => {
            const { accessToken, refreshToken: newRefreshToken } = response.data;


            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            processQueue(null, accessToken);
            resolve(apiClient(originalRequest));
          })
          .catch(err => {
            processQueue(err, null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            // Dispatch logout event to notify AuthContext
            window.dispatchEvent(new Event('logout'));
            window.location.href = '/login';
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);


export default apiClient;
