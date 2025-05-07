import { InvoiceStatus } from '@/AllEnums';
import axios, { AxiosResponse, AxiosInstance } from 'axios';

interface Credentials {
  email: string;
  password: string;
}

interface ProjectParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  skills?: string[];
  minBudget?: number;
  maxBudget?: number;
  status?: string;
  hasMessages?: boolean;
}

interface ProjectData {
  title: string;
  description: string;
  categoryId: number;
  budget: number;
  deadline: string;
  paymentType: string;
  clientId: number;
  attachments?: File[];
  [key: string]: any;
}

interface BidData {
  amount: number;
  estimated_days: number;
  proposal: string;
  project_id: number;
  freelancer_id: number;
}

interface MessageData {
  content: string;
  attachments?: File[];
}

interface MilestoneData {
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  projectTitle?: string;
}

interface InvoiceData {
  projectId: number;
  milestoneId: number;
  invoiceNumber?: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus; 
  dueDate: Date;
  paymentMethod?: string;
  attachments?: File[];
  [key: string]: any;
}

// Create axios instance with base URL
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_STORAGE_KEY || 'access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem(import.meta.env.VITE_AUTH_REFRESH_TOKEN_STORAGE_KEY || 'refresh_token');
        if (!refreshToken) {
          // No refresh token available, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Call refresh token endpoint
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/auth/refresh`, {
          refreshToken
        });
        
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        // Update tokens in localStorage
        localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_STORAGE_KEY || 'access_token', accessToken);
        localStorage.setItem(import.meta.env.VITE_AUTH_REFRESH_TOKEN_STORAGE_KEY || 'refresh_token', newRefreshToken);
        
        // Update the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token is invalid, clear auth and redirect to login
        localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_STORAGE_KEY || 'access_token');
        localStorage.removeItem(import.meta.env.VITE_AUTH_REFRESH_TOKEN_STORAGE_KEY || 'refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle 500 errors
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// API services object
const apiService = {
  auth: {
    login: (credentials: Credentials): Promise<AxiosResponse> => 
      api.post('/auth/login', credentials),

    register: (userData: Record<string, any>, role: string): Promise<AxiosResponse> => 
      api.post(`/${role}/register`, userData),

    refreshToken: (refreshToken: string): Promise<AxiosResponse> => 
      api.post('/auth/refresh', { refreshToken }),
    
    logout: (): Promise<AxiosResponse> => 
      api.post('/auth/logout'),
  },
  
  // User endpoints
  users: {
    getProfile: (): Promise<AxiosResponse> => 
      api.get('/user/profile'),
    
    updateProfile: (data: Record<string, any>): Promise<AxiosResponse> => 
      api.patch('/user/profile', data),
    
    uploadAvatar: (formData: FormData): Promise<AxiosResponse> => {
      return api.post('/user/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  },
  
  // Project endpoints
  projects: {
    getAll: (params?: ProjectParams): Promise<AxiosResponse> => 
      api.get('/projects', { params }),
    
    getById: (id: string): Promise<AxiosResponse> => 
      api.get(`/projects/${id}`),
    
    create: (projectData: ProjectData): Promise<AxiosResponse> => {
      // Convert all numeric fields to numbers
      const formattedData = {
        ...projectData,
        budget: Number(projectData.budget),
        categoryId: Number(projectData.categoryId),
        clientId: Number(projectData.clientId),
      };

      // Send as JSON instead of FormData since we don't have attachments
      return api.post('/projects', formattedData);
    },
    
    update: (id: string, projectData: Partial<ProjectData>): Promise<AxiosResponse> => 
      api.patch(`/projects/${id}`, projectData),
    
    delete: (id: string): Promise<AxiosResponse> => 
      api.delete(`/projects/${id}`),
    
    getClientProjects: (): Promise<AxiosResponse> => 
      api.get('/projects/my-projects'),
    
    getFreelancerProjects: (): Promise<AxiosResponse> => 
      api.get('/projects/freelancer-projects'),
    
    getClientDashboardStats: (): Promise<AxiosResponse> => 
      api.get('/client/dashboard'),
    
    getFreelancerDashboardStats: (): Promise<AxiosResponse> => 
      api.get('/freelancer/dashboard'),
  },
  
  // Bids endpoints
  bids: {
    create: (projectId: string, bidData: BidData): Promise<AxiosResponse> => 
      api.post(`/projects/${projectId}/bids`, bidData),
    
    getByProject: (projectId: string): Promise<AxiosResponse> => 
      api.get(`/projects/${projectId}/bids`),
    
    accept: (projectId: string, bidId: string): Promise<AxiosResponse> => 
      api.post(`/projects/${projectId}/bids/${bidId}/accept`),
    
    getMyBids: (): Promise<AxiosResponse> => 
      api.get('/projects/bids/my-bids'),
  },
  
  // Messages endpoints
  messages: {
    getByProject: (projectId: string): Promise<AxiosResponse> => {
      // Get the current user ID from local storage to pass in the query params
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id;
      
      // Include user ID in the query params for backend filtering
      return api.get(`/messages/${projectId}`, {
        params: { userId }
      });
    },
    
    send: (projectId: string, messageData: MessageData): Promise<AxiosResponse> => {
      const formData = new FormData();
      
      formData.append('content', messageData.content);
      
      // Add attachments if any
      if (messageData.attachments) {
        messageData.attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }
      
      return api.post(`/messages/${projectId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  },
  
  // Milestones endpoints
  milestones: {
    getByProject: (projectId: string): Promise<AxiosResponse> => 
      api.get(`/milestones/project/${projectId}`),
    
    create: (projectId: string | number, milestoneData: MilestoneData): Promise<AxiosResponse> => 
      api.post(`/milestones`, { ...milestoneData, projectId: Number(projectId),amount: Number(milestoneData.amount) }),
    
    update: (id: string, milestoneData: Partial<MilestoneData>): Promise<AxiosResponse> => 
      api.patch(`/milestones/${id}`, milestoneData),
    
    complete: (id: string): Promise<AxiosResponse> => 
      api.post(`/milestones/${id}/complete`),
    
    approve: (id: string): Promise<AxiosResponse> => 
      api.post(`/milestones/${id}/approve`),
  },
  
  // Skills endpoints
  skills: {
    getAll: (): Promise<AxiosResponse> => 
      api.get('/skills'),
    
    addToProfile: (skillIds: string[]): Promise<AxiosResponse> => 
      api.post('/user/skills', { skillIds }),
  },
  
  // Stats and dashboard data
  dashboard: {
    getClientStats: (): Promise<AxiosResponse> => 
      api.get('/client/dashboard'),
    
    getFreelancerStats: (): Promise<AxiosResponse> => 
      api.get('/freelancer/dashboard'),
  },
  
  // Invoices endpoints
  invoices: {
    getAll: (): Promise<AxiosResponse> => 
      api.get('/invoices'),
    
    getByProject: (projectId: string): Promise<AxiosResponse> => 
      api.get(`/invoices/project/${projectId}`),
    
    getByMilestone: (milestoneId: string): Promise<AxiosResponse> => 
      api.get(`/invoices/milestone/${milestoneId}`),
    
    getById: (id: string): Promise<AxiosResponse> => 
      api.get(`/invoices/${id}`),
      
    getByInvoiceNumber: (invoiceNumber: string): Promise<AxiosResponse> => 
      api.get(`/invoices/number/${invoiceNumber}`),
    
    create: (invoiceData: InvoiceData): Promise<AxiosResponse> => {
      const formData = new FormData();
      
      // Add invoice data
      for (const key in invoiceData) {
        if (key !== 'attachments') {
          formData.append(key, String(invoiceData[key]));
        }
      }
      
      // Add attachments if any
      if (invoiceData.attachments) {
        invoiceData.attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }
      
      return api.post('/invoices', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    
    update: (id: string, invoiceData: Partial<InvoiceData>): Promise<AxiosResponse> => 
      api.patch(`/invoices/${id}`, invoiceData),
    
    delete: (id: string): Promise<AxiosResponse> => 
      api.delete(`/invoices/${id}`),
    
    markAsPaid: (id: string): Promise<AxiosResponse> => 
      api.post(`/invoices/${id}/pay`),

    generateInvoice: (params: { 
      projectId: string | null; 
      status: string; 
      // Only include parameters that the backend API supports
    }): Promise<AxiosResponse> => 
      api.get('/invoices/generate', { 
        params,
        responseType: 'blob'
      }),
  },
};

export default apiService; 