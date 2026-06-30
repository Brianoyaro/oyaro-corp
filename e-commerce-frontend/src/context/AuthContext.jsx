import { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/authApi';
import { QueryClient, useQueryClient } from "@tanstack/react-query";



/**
 * AuthContext
 * Manages user authentication, JWT tokens
 */
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const queryClient = useQueryClient()
//   const [error, setError] = useState(null);

  /**
   * Load tokens from localStorage on mount
   */
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    // const storedUser = localStorage.getItem('user');

    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
    //   setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  /**
   * Register new user
   */
  const signup = useCallback(async (email, password) => {
    try {
    //   setError(null);
      setIsLoading(true);

      const response = await authAPI.register(email, password);

      // Automatically log in after signup
      const loginResponse = await authAPI.login(email, password);

      // Save tokens and user
      localStorage.setItem('accessToken', loginResponse.accessToken);
      localStorage.setItem('refreshToken', loginResponse.refreshToken);
    //   localStorage.setItem('user', JSON.stringify({ email }));

      setAccessToken(loginResponse.accessToken);
      setRefreshToken(loginResponse.refreshToken);
    //   setUser({ email });

      return { success: true, data: loginResponse };
    } catch (err) {
      const errorMessage = err.message || 'Signup failed';
    //   setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (email, password) => {
    try {
    //   setError(null);
      setIsLoading(true);

      const response = await authAPI.login(email, password);

      // Save tokens and user
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    //   localStorage.setItem('user', JSON.stringify({ email }));

      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);
    //   setUser({ email });

      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
    //   setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Listen for logout event from api.js when token refresh fails
   */
  useEffect(() => {
    const handleLogoutEvent = () => {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    };

    window.addEventListener('logout', handleLogoutEvent);
    return () => window.removeEventListener('logout', handleLogoutEvent);
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {

      // Clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    //   localStorage.removeItem('user');

      setAccessToken(null);
      setRefreshToken(null);
      queryClient.clear()
      // setUser(null);
    //   setError(null);

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Check if user is authenticated
   */
//   const isAuthenticated = !!accessToken && !!user;
  const isAuthenticated = !!accessToken
  const value = {
    // user,
    accessToken,  //I am not using this anywhere. I have stored it in localStorage and I am using it from there in api.js
    refreshToken, //I am not using this anywhere. I have stored it in localStorage and I am using it from there in api.js
    isLoading,
    isAuthenticated,
    // error,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
