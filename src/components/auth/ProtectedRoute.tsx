import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { Shield, AlertTriangle } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles: string[]
  redirectTo?: string
}

export function ProtectedRoute({ children, allowedRoles, redirectTo = '/' }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to home if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center py-12">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 border border-red-200 dark:border-red-700/50 max-w-md mx-auto">
            <AlertTriangle className="mx-auto h-16 w-16 text-red-400 mb-4" />
            <h3 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">
              Access Denied
            </h3>
            <p className="text-red-700 dark:text-red-300 mb-4">
              You don't have permission to access this page.
            </p>
            <div className="text-sm text-red-600 dark:text-red-400 space-y-1">
              <p>Required role: {allowedRoles.join(' or ')}</p>
              <p>Your role: {user.role}</p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}