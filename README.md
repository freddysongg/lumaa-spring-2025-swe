# Task Management Application

A full-stack task management application built with React + TypeScript, Node.js, and PostgreSQL.

## Setup Instructions

### Database Setup

1. Install PostgreSQL if not already installed
2. Create a new database:
```bash
createdb task_tracker
```

3. Configure environment variables:
   - Copy `.env.example` to `.env` in the backend directory
   - Update the following variables:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_tracker"
JWT_SECRET="your-secure-secret-key"
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

4. Run database migrations:
```bash
cd backend
npm run migrate
```

### Backend Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Start the development server:
```bash
# Development mode with hot reload
npm run dev

# Production mode
npm run build
npm start
```

The backend server will run on `http://localhost:3000`

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173`

### Manual Testing Notes

Key flows to test:
1. User registration and login
2. Task CRUD operations
3. Authentication persistence
4. Error handling and validation

## Salary Expectations

Expected monthly salary range: $35/hr or around $6,000/month

Based on:
- Full-stack development expertise
- TypeScript/React/Node.js proficiency
- Experience with secure authentication implementations
- Database design and optimization skills

## Additional Technical Details

### API Documentation

The backend provides the following endpoints:

- Authentication:
  - `POST /api/auth/register` - Create new user account
  - `POST /api/auth/login` - User login, returns JWT

- Tasks:
  - `GET /api/tasks` - List all tasks
  - `POST /api/tasks` - Create new task
  - `PUT /api/tasks/:id` - Update task
  - `DELETE /api/tasks/:id` - Delete task

### Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Rate limiting on API endpoints
- CORS configuration
- Input validation and sanitization

### Tech Stack Highlights

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT, bcrypt
- **Testing**: Jest, React Testing Library

