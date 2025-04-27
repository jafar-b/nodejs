# SkillSync - Freelance Collaboration Platform

SkillSync is a comprehensive full-stack web application designed to connect freelancers with clients. It provides a streamlined platform for project posting, bidding, communication, and task management.

## Features

- **User Authentication**: Secure login and registration with role-based access (Client/Freelancer)
- **Project Management**: Post, browse, and manage projects with detailed descriptions
- **Bidding System**: Submit and manage bids on projects
- **Messaging**: Real-time communication between clients and freelancers
- **File Sharing**: Upload and manage project-related files
- **Milestones**: Track project progress with milestone management
- **Invoicing**: Generate and manage project invoices

## Tech Stack

### Frontend
- React 19
- React Router Dom 7
- Chakra UI
- React Query (TanStack Query)
- React Hook Form
- Zustand (State Management)
- Vite (Build Tool)

### Backend (Not included in this repository)
- NestJS
- JWT Authentication
- PostgreSQL with TypeORM

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/skillsync.git
cd skillsync
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. The application will be available at `http://localhost:5173`

## Project Structure

```
skillsync/
├── public/
├── src/
│   ├── api/           # API utilities and service functions
│   ├── assets/        # Static assets
│   ├── components/    # Reusable UI components
│   │   ├── auth/
│   │   ├── files/
│   │   ├── layouts/
│   │   ├── messaging/
│   │   ├── navigation/
│   │   └── projects/
│   ├── hooks/         # Custom React hooks
│   ├── routes/        # Page components
│   │   ├── client/
│   │   └── freelancer/
│   ├── store/         # State management
│   ├── App.jsx        # Main application component
│   ├── main.jsx       # Application entry point
│   └── theme.js       # Chakra UI theme configuration
├── index.html
├── package.json
└── vite.config.js
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=http://localhost:3000/api
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Application Flow

### Client Journey
1. Register/Login as a Client
2. Create a new project with details and budget
3. Review bids from freelancers
4. Select and assign a freelancer
5. Create milestones for project tracking
6. Communicate and share files with the freelancer
7. Mark milestones as completed and process payments

### Freelancer Journey
1. Register/Login as a Freelancer
2. Browse available projects
3. Submit bids with proposed rates and timelines
4. Begin work on assigned projects
5. Track progress through milestones
6. Communicate with clients and share deliverables
7. Receive payments upon milestone completion

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Chakra UI](https://chakra-ui.com/)
- [TanStack Query](https://tanstack.com/query)
- [Vite](https://vitejs.dev/) 