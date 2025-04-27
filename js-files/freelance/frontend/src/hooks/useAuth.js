import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { useState, useEffect } from 'react';
import apiService from '@api';

// Create authentication store with Zustand
const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Create authentication hook that combines Zustand store with React state and effects
export function useAuth() {
  const { token, user, setAuth, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // Set up axios auth interceptor
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    setIsLoading(false);

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      // Use mock API service
      const response = await apiService.auth.login({ email, password });
      const { accessToken, user: userData } = response.data;
      
      setAuth(accessToken, userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setIsLoading(true);
      // Use mock API service
      const response = await apiService.auth.register(userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    clearAuth();
  };

  return {
    isAuthenticated: !!token,
    user,
    token,
    isLoading,
    login,
    register,
    logout,
  };
} 