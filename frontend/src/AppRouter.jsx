import { Navigate, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import AdminRoute from './components/auth/AdminRoute.jsx'
import PublicOnlyRoute from './components/auth/PublicOnlyRoute.jsx'
import AdminSignInPage from './pages/auth/AdminSignInPage.jsx'
import AdminSignUpPage from './pages/auth/AdminSignUpPage.jsx'
import UserSignInPage from './pages/auth/UserSignInPage.jsx'
import UserSignUpPage from './pages/auth/UserSignUpPage.jsx'
import AdminMenuPage from './pages/admin/AdminMenuPage.jsx'
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import UserDashboardPage from './pages/UserDashboardPage.jsx'
import CartPage from './pages/CartPage.jsx'
import MyOrdersPage from './pages/MyOrdersPage.jsx'
import OrderStatusPage from './pages/OrderStatusPage.jsx'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/user/signin" element={<PublicOnlyRoute><UserSignInPage /></PublicOnlyRoute>} />
      <Route path="/user/signup" element={<PublicOnlyRoute><UserSignUpPage /></PublicOnlyRoute>} />
      <Route path="/admin/signin" element={<PublicOnlyRoute><AdminSignInPage /></PublicOnlyRoute>} />
      <Route path="/admin/signup" element={<PublicOnlyRoute><AdminSignUpPage /></PublicOnlyRoute>} />
      <Route path="/user/dashboard" element={<UserDashboardPage />} />
      <Route path="/user/cart" element={<CartPage />} />
      <Route path="/user/orders" element={<MyOrdersPage />} />
      <Route path="/user/orders/:id" element={<OrderStatusPage />} />
      <Route path="/admin/menu" element={<AdminRoute><AdminMenuPage /></AdminRoute>} />
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter
