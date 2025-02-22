# Task Management Application

A feature-rich task management application built with modern web technologies. This project goes beyond basic CRUD operations to provide a comprehensive task management solution with advanced features and robust security implementations.

## Key Features & Enhancements

### Task Management
- **Advanced Task Properties**:
  - Priority levels (High, Medium, Low)
  - Due date tracking
  - Task categories
  - Star/favorite functionality
  - Completion status
  - Detailed descriptions

- **Bulk Operations**:
  - Multi-task selection
  - Batch delete
  - Task duplication

- **Task Organization**:
  - Custom sorting (by due date, priority, category)
  - Search functionality
  - Filter by status/priority
  - Star/unstar tasks for quick access

### User Interface
- **Modern Design**:
  - Responsive layout using TailwindCSS
  - Dark mode support
  - Interactive toast notifications
  - Loading states and animations
  - Tooltip guidance

### Security Implementations
- **Advanced Authentication**:
  - JWT-based session management
  - Token refresh mechanism
  - Secure password hashing with bcrypt
  - Rate limiting on sensitive endpoints

- **Data Protection**:
  - Input sanitization
  - XSS protection
  - CORS configuration
  - Request validation using Zod
  - SQL injection prevention via Prisma ORM

## Technical Architecture

### Frontend Architecture
- **State Management**:
  - React Context for auth state
  - Custom hooks for task operations
  - Optimistic updates for better UX

- **API Integration**:
  - Axios with interceptors
  - Error handling middleware
  - Request/response transformations

### Backend Architecture
- **API Design**:
  - RESTful endpoints
  - Middleware-based auth
  - Error handling middleware
  - Request validation
  - Rate limiting

- **Database Design**:
  - Prisma schema with relations
  - Indexed queries for performance
  - Soft delete implementation
  - Automated timestamps

## Setup Instructions

### Database Setup
1. Install PostgreSQL
2. Create database:
```bash
createdb task_tracker
```

3. Environment configuration:
```backend/.env
# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080

# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_tracker"

# Security
JWT_SECRET="your-secure-secret-key"
JWT_EXPIRES_IN="1d"
RATE_LIMIT_WINDOW=900000  # 15 minutes
RATE_LIMIT_MAX=100
```

```frontend/.env
# Server Configuration
VITE_API_URL=http://localhost:3000
```

4. Run migrations:
```bash
cd backend
npm run generate   
npm run migrate  
```

### Backend Setup
```bash
cd backend
npm install

# Development
npm run dev

# Production
npm run build
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register`
  - Creates new user account
  - Body: `{ username: string, password: string }`
  - Returns: User object with JWT

- `POST /api/auth/login`
  - Authenticates user
  - Body: `{ username: string, password: string }`
  - Returns: JWT and user data

### Task Endpoints
- `GET /api/tasks`
  - Lists all tasks
  - Query params: 
    - `sort`: 'dueDate' | 'priority' | 'category'
    - `search`: string
    - `filter`: 'completed' | 'starred'

- `POST /api/tasks`
  - Creates new task
  - Body: 
    ```typescript
    {
      title: string
      description?: string
      dueDate?: Date
      priority?: 'High' | 'Medium' | 'Low'
      category?: string
      starred?: boolean
    }
    ```

- `PUT /api/tasks/:id`
  - Updates existing task
  - Supports partial updates

- `DELETE /api/tasks/:id`
  - Deletes task
  - Supports soft delete

- `POST /api/tasks/:id/star`
  - Toggles star status

- `POST /api/tasks/:id/complete`
  - Toggles completion status

### Manual Testing Checklist
1. Authentication flows
   - Registration with validation
   - Login with error handling
   - Token persistence
   - Logout cleanup

2. Task operations
   - CRUD operations
   - Bulk actions
   - Sorting and filtering
   - Real-time updates

3. Error scenarios
   - Network failures
   - Validation errors
   - Token expiration
   - Rate limiting

## Salary Expectations

Expected monthly salary range: $35/hr or around $6,000/month

Based on implemented features:
- Complex state management
- Advanced security implementations
- Optimized database queries
- Modern UI/UX design
- Comprehensive testing strategy
- Production-ready architecture

## Tech Stack
- **Frontend**: 
  - React 18 with TypeScript
  - Vite for build tooling
  - TailwindCSS for styling
  - React Query for data fetching
  - React Router for navigation

- **Backend**:
  - Node.js with Express
  - TypeScript for type safety
  - Prisma ORM for database
  - JWT for authentication
  - Zod for validation

- **Database**:
  - PostgreSQL
  - Prisma migrations
  - Indexed queries
  - Relational data model

- **Testing**:
  - Jest for unit testing
  - React Testing Library
  - Supertest for API testing

