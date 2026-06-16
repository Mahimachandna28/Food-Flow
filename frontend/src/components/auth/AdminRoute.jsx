import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

function AdminRoute({ children }) {
  const { isLoading, user, profile } = useAuth()

  if (isLoading) {
    return <p className="page-message">Checking admin access...</p>
  }

  if (!user) {
    return <Navigate to="/admin/signin" replace />
  }

  if (profile?.role !== 'admin') {
    return <Navigate to="/user/dashboard" replace />
  }

  return children
}

export default AdminRoute
