import { create } from 'zustand';
import { useState } from 'react';
import apiService from '@/api/ApiConfig';
import { userRole } from '@/AllEnums';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: userRole;
  [key: string]: any; // For any additional properties
}

interface LoginResponse {
  success: boolean;
  message?: string;
}

interface RegisterResponse {
  success: boolean;
  data?: any;
  message?: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any;
  setAuth: (accessToken: string, refreshToken: string, user: any) => void;
  clearAuth: () => void;
  updateUser: (userData: any) => void;
}

const useAuthStore = create<AuthState>()((set) => ({
  accessToken: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  setAuth: (accessToken, refreshToken, user) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    set({ accessToken, refreshToken, user });
  },
  clearAuth: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    set({ accessToken: null, refreshToken: null, user: null });
  },
  updateUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    set((state) => ({ ...state, user: userData }));
  },
}));

// Create authentication hook that combines Zustand store with React state and effects
const useAuth = () => {
  const { accessToken, refreshToken, user, setAuth, clearAuth, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Login function
  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      setIsLoading(true);
      
      const response = await apiService.auth.login({ email, password });
      const { accessToken, refreshToken, user: userData } = response.data;
      
      // Store auth data in Zustand store
      setAuth(accessToken, refreshToken, userData);
      
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      // Clear any existing auth data on error
      clearAuth();
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: Record<string, any>, role: userRole): Promise<RegisterResponse> => {
    try { 
      setIsLoading(true);
      const response = await apiService.auth.register(userData, role);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<{ success: boolean }> => {
    try {
      setIsLoading(true);
      
      // Call logout API if authenticated
      if (accessToken) {
        await apiService.auth.logout();
      }
      
      // Clear auth store
      clearAuth();
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear the local state even if API call fails
      clearAuth();
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAuthenticated: !!accessToken,
    user,
    accessToken,
    refreshToken,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };
};

export default useAuth; 