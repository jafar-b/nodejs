import axios from 'axios';

// Create axios instance with base URL
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   }
// });

// Mock users data
const MOCK_USERS = {
  client: {
    id: 101,
    name: 'TechSolutions Inc.',
    email: 'client@example.com',
    role: 'client',
    createdAt: new Date(2024, 1, 15),
  },
  freelancer: {
    id: 201,
    name: 'John Smith',
    email: 'freelancer@example.com',
    role: 'freelancer',
    skills: ['React', 'Node.js', 'UI/UX Design'],
    createdAt: new Date(2024, 2, 10),
  }
};

// API services object
const apiService = {
  // Auth endpoints
  auth: {
    login: (credentials) => {
      // Mock login
      console.log('Mock login with:', credentials);
      const user = credentials.email.includes('client') ? MOCK_USERS.client : MOCK_USERS.freelancer;
      return Promise.resolve({ 
        data: { 
          accessToken: 'mock-token-' + Date.now(),
          user
        } 
      });
    },
    register: (userData) => {
      // Mock register
      console.log('Mock register with:', userData);
      return Promise.resolve({ 
        data: { 
          success: true,
          message: 'Registration successful'
        } 
      });
    },
    refreshToken: () => Promise.resolve({ data: { accessToken: 'mock-refresh-token' } }),
    logout: () => Promise.resolve({ data: { success: true } }),
  },
  
  // User endpoints
  users: {
    getProfile: () => {
      // Return mock user data
      return Promise.resolve({ data: MOCK_USERS.freelancer });
    },
    updateProfile: (data) => {
      console.log('Updating profile with:', data);
      return Promise.resolve({ data: { ...MOCK_USERS.freelancer, ...data } });
    },
    uploadAvatar: (formData) => {
      console.log('Uploading avatar');
      return Promise.resolve({ data: { url: 'https://via.placeholder.com/150' } });
    },
  },
  
  // Project endpoints
  projects: {
    getAll: (params) => {
      console.log('Getting projects with params:', params);
      // Return mock data defined in each component's initialData
      return Promise.resolve({ data: [] });
    },
    getById: (id) => {
      console.log('Getting project with id:', id);
      return Promise.resolve({ data: null });
    },
    create: (projectData) => {
      console.log('Creating project:', projectData);
      return Promise.resolve({ 
        data: { 
          id: Date.now(),
          ...projectData,
          status: 'open',
          createdAt: new Date(),
        } 
      });
    },
    update: (id, projectData) => {
      console.log('Updating project:', id, projectData);
      return Promise.resolve({ data: { id, ...projectData } });
    },
    delete: (id) => {
      console.log('Deleting project:', id);
      return Promise.resolve({ data: { success: true } });
    },
    getClientDashboardStats: () => {
      // Return mock data directly
      return Promise.resolve({ 
        data: {
          stats: {
            activeProjects: 4,
            completedProjects: 12,
            pendingBids: 8,
            totalSpent: 4250,
          },
          recentProjects: [
            {
              id: 1,
              title: 'E-commerce Website Development',
              description: 'Build a fully functional e-commerce website with product listings, user authentication, and payment processing.',
              budget: 2500,
              deadline: new Date(2025, 6, 30),
              category: 'Web Development',
              status: 'inProgress',
              bidsCount: 7,
            },
            {
              id: 2,
              title: 'Logo Design for Tech Startup',
              description: 'Create a modern, professional logo for a new tech startup in the AI space.',
              budget: 350,
              deadline: new Date(2025, 5, 15),
              category: 'Graphic Design',
              status: 'open',
              bidsCount: 12,
            },
          ],
          pendingBids: [
            {
              id: 101,
              freelancer: {
                id: 1001,
                name: 'John Smith',
                avatar: null,
              },
              project: 'E-commerce Website Development',
              amount: 2300,
              deliveryTime: '30 days',
              createdAt: new Date(2025, 4, 18),
            },
            {
              id: 102,
              freelancer: {
                id: 1002,
                name: 'Emily Johnson',
                avatar: null,
              },
              project: 'Logo Design for Tech Startup',
              amount: 320,
              deliveryTime: '7 days',
              createdAt: new Date(2025, 4, 17),
            },
          ],
        }
      });
    },
    getFreelancerDashboardStats: () => {
      // Return mock data directly
      return Promise.resolve({
        data: {
          stats: {
            activeBids: 5,
            activeProjects: 3,
            completedProjects: 15,
            totalEarned: 7850,
            rating: 4.8,
          },
          currentProjects: [
            {
              id: 1,
              title: 'E-commerce Website Development',
              description: 'Build a fully functional e-commerce website with product listings, user authentication, and payment processing.',
              budget: 2500,
              deadline: new Date(2025, 6, 30),
              category: 'Web Development',
              status: 'inProgress',
              client: {
                id: 101,
                name: 'TechSolutions Inc.',
                avatar: null,
              },
              progress: 65,
            },
            {
              id: 2,
              title: 'Mobile App UI Design',
              description: 'Design a modern, clean UI for a health and fitness tracking mobile application.',
              budget: 1200,
              deadline: new Date(2025, 5, 25),
              category: 'UI/UX Design',
              status: 'inProgress',
              client: {
                id: 102,
                name: 'HealthFit Apps',
                avatar: null,
              },
              progress: 40,
            },
          ],
          recentBids: [
            {
              id: 201,
              project: {
                id: 301,
                title: 'WordPress Blog Customization',
                budget: 800,
                category: 'Web Development',
              },
              amount: 750,
              status: 'pending',
              createdAt: new Date(2025, 4, 20),
            },
            {
              id: 202,
              project: {
                id: 302,
                title: 'Logo and Brand Identity',
                budget: 600,
                category: 'Graphic Design',
              },
              amount: 580,
              status: 'pending',
              createdAt: new Date(2025, 4, 18),
            },
          ],
        }
      });
    },
    getUserMilestones: () => {
      // Return mock data for milestones
      return Promise.resolve({
        data: {
          projects: [
            { id: 1, title: 'E-commerce Website Development' },
            { id: 2, title: 'Logo Design for Tech Startup' },
          ],
          milestones: [
            {
              id: 1,
              projectId: 1,
              title: 'Project Setup and Design',
              description: 'Initialize project, design database schema, and create wireframes',
              amount: 500,
              dueDate: new Date(2025, 5, 15),
              status: 'completed',
              completedDate: new Date(2025, 5, 10),
            },
            {
              id: 2,
              projectId: 1,
              title: 'User Authentication',
              description: 'Implement user registration, login, and profile management',
              amount: 600,
              dueDate: new Date(2025, 6, 1),
              status: 'inProgress',
            },
            {
              id: 3,
              projectId: 1,
              title: 'Shopping Cart',
              description: 'Build shopping cart functionality with product management',
              amount: 800,
              dueDate: new Date(2025, 6, 20),
              status: 'pending',
            },
            {
              id: 4,
              projectId: 2,
              title: 'Initial Concepts',
              description: 'Create 3 initial logo concepts based on client requirements',
              amount: 150,
              dueDate: new Date(2025, 5, 20),
              status: 'completed',
              completedDate: new Date(2025, 5, 19),
            },
            {
              id: 5,
              projectId: 2,
              title: 'Refinement',
              description: 'Refine selected concept based on client feedback',
              amount: 100,
              dueDate: new Date(2025, 5, 30),
              status: 'inProgress',
            },
            {
              id: 6,
              projectId: 2,
              title: 'Final Delivery',
              description: 'Deliver all final files in required formats',
              amount: 100,
              dueDate: new Date(2025, 6, 10),
              status: 'pending',
            },
          ],
        }
      });
    }
  },
  
  // Bid endpoints
  bids: {
    getByProject: (projectId) => {
      console.log('Getting bids for project:', projectId);
      return Promise.resolve({ data: [] });
    },
    create: (projectId, bidData) => {
      console.log('Creating bid for project:', projectId, bidData);
      return Promise.resolve({ 
        data: {
          id: Date.now(),
          projectId,
          ...bidData,
          freelancer: MOCK_USERS.freelancer,
          createdAt: new Date(),
        }
      });
    },
    accept: (projectId, bidId) => {
      console.log('Accepting bid:', projectId, bidId);
      return Promise.resolve({ data: { success: true } });
    },
  },
  
  // Message endpoints
  messages: {
    getByProject: (projectId) => {
      console.log('Getting messages for project:', projectId);
      return Promise.resolve({ data: [] });
    },
    sendMessage: (projectId, messageData) => {
      console.log('Sending message for project:', projectId, messageData);
      return Promise.resolve({ 
        data: {
          id: Date.now(),
          projectId,
          ...messageData,
          sender: MOCK_USERS.freelancer,
          timestamp: new Date(),
        }
      });
    },
    getConversations: () => {
      // This will use the mock data in the MessagesPage component
      return Promise.resolve({ data: null });
    },
  },
  
  // Milestone endpoints
  milestones: {
    getByProject: (projectId) => {
      console.log('Getting milestones for project:', projectId);
      return Promise.resolve({ data: [] });
    },
    create: (projectId, milestoneData) => {
      console.log('Creating milestone for project:', projectId, milestoneData);
      return Promise.resolve({ 
        data: {
          id: Date.now(),
          projectId,
          ...milestoneData,
          status: 'pending',
          createdAt: new Date(),
        }
      });
    },
    update: (projectId, milestoneId, milestoneData) => {
      console.log('Updating milestone:', projectId, milestoneId, milestoneData);
      return Promise.resolve({ data: { id: milestoneId, ...milestoneData } });
    },
    complete: (projectId, milestoneId) => {
      console.log('Completing milestone:', projectId, milestoneId);
      return Promise.resolve({ 
        data: { 
          success: true,
          completedDate: new Date()
        }
      });
    },
    getUserMilestones: () => {
      // This will use the mock data in each component
      return Promise.resolve({ data: null });
    }
  },
  
  // Invoice endpoints
  invoices: {
    getByProject: (projectId) => {
      console.log('Getting invoices for project:', projectId);
      return Promise.resolve({ data: [] });
    },
    create: (projectId, invoiceData) => {
      console.log('Creating invoice for project:', projectId, invoiceData);
      return Promise.resolve({ 
        data: {
          id: Date.now(),
          projectId,
          ...invoiceData,
          status: 'pending',
          createdAt: new Date(),
        }
      });
    },
    markAsPaid: (projectId, invoiceId) => {
      console.log('Marking invoice as paid:', projectId, invoiceId);
      return Promise.resolve({ 
        data: { 
          success: true,
          paidDate: new Date()
        }
      });
    },
  },
  
  // File upload endpoint
  files: {
    upload: (projectId, formData) => {
      console.log('Uploading files for project:', projectId);
      // Simulate file upload
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ 
            data: { 
              files: [{ id: Date.now(), name: 'uploaded-file.pdf', url: '#' }]
            }
          });
        }, 1500);
      });
    },
    getByProject: (projectId) => {
      console.log('Getting files for project:', projectId);
      return Promise.resolve({ data: [] });
    },
    delete: (projectId, fileId) => {
      console.log('Deleting file:', projectId, fileId);
      return Promise.resolve({ data: { success: true } });
    }
  },
  
  // Skills endpoints
  skills: {
    getAll: () => {
      return Promise.resolve({
        data: [
          'Web Development',
          'Mobile App Development',
          'UI/UX Design',
          'Graphic Design',
          'Content Writing',
          'Marketing',
          'Data Entry',
          'Virtual Assistant',
          'Customer Service',
        ]
      });
    },
  },
};

export default apiService; 