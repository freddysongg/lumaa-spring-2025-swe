import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'
import { TaskProvider } from '@/contexts/TaskContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import Login from '@/pages/Login'
import Index from '@/pages/Index'

function App() {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Public route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected route */}
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            
            {/* Catch all redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster />
        </TaskProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
