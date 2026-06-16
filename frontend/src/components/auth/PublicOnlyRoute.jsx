import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

function PublicOnlyRoute({ children }) {
  const { isLoading, user, profile } = useAuth()

  if (isLoading) {
    return <p className="page-message">Loading...</p>
  }

  if (!user) {
    return children
  }

  if (profile?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />
  }

  return <Navigate to="/user/dashboard" replace />
}

export default PublicOnlyRoute
