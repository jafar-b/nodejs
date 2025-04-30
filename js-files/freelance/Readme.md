# SkillSync Freelance Platform
# ER Diagram

![freelance drawio](https://github.com/user-attachments/assets/17804feb-86ad-4063-9e37-01f16ec83086)


## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Installation and Setup](#installation-and-setup)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Role based display](#rolebased)

## Project Overview

SkillSync is a comprehensive freelance platform designed to connect talented freelancers with clients seeking specialized services. The platform facilitates project creation, bidding, milestone management, and secure payment processing. With a focus on user experience and seamless communication, SkillSync creates an efficient marketplace for freelance work.

## Features

- **User Authentication**: Secure registration and login for both clients and freelancers
- **Profile Management**: Comprehensive profile creation with skills, portfolio, and experience
- **Project Management**: Create, update, and track projects
- **Milestone Tracking**: Break projects into manageable milestones with payment integration
- **Bidding System**: Freelancers can bid on available projects
- **Skills Categorization**: Browse freelancers by skills and expertise
- **File Upload**: Support for project attachments and deliverables
- **Search Functionality**: search projects

## Tech Stack

### Backend
- **Framework**: NestJS (v11)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT, Passport
- **File Handling**: Multer
- **API**: RESTful architecture
- **Validation**: Class-validator, Class-transformer
- **Password Security**: Bcrypt

### Frontend
- **Framework**: React (v19)
- **Build Tool**: Vite
- **Language**: TypeScript
- **Routing**: React Router (v7)
- **State Management**: Zustand
- **API Client**: Axios, React Query
- **Forms**: React Hook Form
- **UI Components**: Chakra UI
- **Styling**: TailwindCSS
- **Icons**: React Icons

## Project Structure

### Backend
```
backend/
├── src/
│   ├── auth/           # Authentication module
│   ├── client/         # Client management
│   ├── config/         # Application configuration
│   ├── dtos/           # Data Transfer Objects
│   ├── entities/       # Database entities
│   ├── enums/          # Enumeration types
│   ├── freelancer/     # Freelancer management
│   ├── messages/       # Messaging system
│   ├── middleware/     # Custom middleware
│   ├── milestones/     # Project milestones
│   ├── projects/       # Project management
│   ├── skills/         # Skills and categories
│   ├── uploads/        # File upload handling
│   ├── user/           # User management
│   ├── app.module.ts   # Main application module
│   └── main.ts         # Application entry point
├── uploads/            # Uploaded files storage
└── .env                # Environment variables
```

### Frontend
```
frontend/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── routes/         # Application routing
│   ├── services/       # API service layer
│   ├── store/          # Zustand state management
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
└── index.html          # HTML entry point
```

## Environment Variables

### Backend 
```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_database_password
DB_DATABASE=skillsync

# JWT Authentication
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_EXPIRATION=5h
JWT_REFRESH_EXPIRATION=7d

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5000000 # 5MB

# API Configuration
API_PREFIX=/api
ENABLE_CORS=true

```

### Frontend
```
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Authentication Settings
VITE_AUTH_TOKEN_STORAGE_KEY=access_token
VITE_AUTH_REFRESH_TOKEN_STORAGE_KEY=refresh_token

# Feature Flags
VITE_ENABLE_CHAT_FEATURE=true
VITE_ENABLE_NOTIFICATIONS=true

# Application Settings
VITE_APP_NAME=SkillSync
VITE_DEFAULT_ITEMS_PER_PAGE=10

```

## Installation and Setup

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- PostgreSQL (v14 or later)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a PostgreSQL database named `skillsync`

4. Configure your `.env` file with appropriate database credentials

5. Run database migrations:
   ```bash
   npm run migration:run
   ```

6. Start the development server:
   ```bash
   npm run start:dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your API base URL:
   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - User login
- `GET /auth/profile` - Get authenticated user profile

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Projects
- `GET /projects` - Get all projects
- `POST /projects` - Create a project
- `GET /projects/:id` - Get project by ID
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Freelancers
- `GET /freelancers` - Get all freelancers
- `GET /freelancers/:id` - Get freelancer by ID
- `PUT /freelancers/:id` - Update freelancer profile

### Clients
- `GET /clients` - Get all clients
- `GET /clients/:id` - Get client by ID
- `PUT /clients/:id` - Update client profile

### Skills
- `GET /skills` - Get all skills
- `POST /skills` - Create a skill
- `GET /skills/:id` - Get skill by ID

### Milestones
- `GET /projects/:projectId/milestones` - Get project milestones
- `POST /projects/:projectId/milestones` - Create project milestone
- `GET /milestones/:id` - Get milestone by ID
- `PUT /milestones/:id` - Update milestone
- `DELETE /milestones/:id` - Delete milestone

### Messages
- `GET /messages/:conversationId` - Get conversation messages
- `POST /messages` - Send a message

## Authentication

The application uses JWT (JSON Web Token) authentication to secure API endpoints. The authentication flow works as follows:

1. **Registration**: Users register by providing their email, password, and user type (client or freelancer)
2. **Login**: Users authenticate with email and password to receive a JWT token
3. **Authorization**: The JWT token is included in the Authorization header for protected API requests
4. **Token Refresh**: Tokens have a configurable expiration time and need to be refreshed

Frontend authentication is handled through a custom `useAuth` hook which manages the authentication state and provides login/logout functions. The authentication state is persisted using Zustand with browser storage.

Backend authentication is implemented using NestJS Passport with the JWT strategy. Protected routes are secured using the `@UseGuards(JwtAuthGuard)` decorator.



## Role-Based Page Display

The application features a dynamic user interface that adapts to the user's role (client or freelancer). The role-based navigation and content display ensures that users only see relevant information and actions based on their specific role.

### Client Interface
- **Dashboard**: Displays projects created, active contracts, and spending metrics
- **Create Project**: Form for posting new projects with requirements and budget
- **My Projects**: List of all projects created with status indicators
- **Project Management**: View bids

### Freelancer Interface
- **Dashboard**: Shows available projects, active contracts, and earning metrics
- **My Profile**: Portfolio management with skills, experience, and work samples
- **Browse Projects**: Search and filter available projects by category, budget, and duration
- **Bidding Interface**: Submit proposals for projects with custom quotes
- **Active Contracts**: View and manage ongoing project work

The role-based routing is implemented using protected routes in React Router, with the user's role stored in the authentication context. The backend enforces these role restrictions through guards and decorators that validate the user's role before allowing access to specific endpoints.
