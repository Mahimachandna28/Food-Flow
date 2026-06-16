import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { orderAPI } from '../lib/api'
import './pages.css'

const STATUS_COLORS = {
  'Preparing': '#f59e0b',
  'Ready': '#10b981',
  'Out for Delivery': '#3b82f6',
  'Delivered': '#22c55e',
  'Cancelled': '#ef4444'
}

function MyOrdersPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    const fetchOrders = async () => {
      if (!user?.id) return
      try {
        const data = await orderAPI.getByUser(user.id)
        if (isActive) setOrders(data)
      } catch (err) {
        if (isActive) setError(err.message)
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    fetchOrders()

    return () => { isActive = false }
  }, [user?.id])

  if (authLoading) {
    return (
      <main className="page-wrap">
        <section className="dashboard-card"><p className="page-message">Loading...</p></section>
      </main>
    )
  }

  if (!user) return <Navigate to="/user/signin" replace />

  return (
    <main className="page-wrap">
      <section className="dashboard-card">
        <div className="orders-header">
          <h1>📦 My Orders</h1>
          <div className="admin-actions">
            <Link to="/user/dashboard" className="ghost-btn">← Menu</Link>
            <Link to="/user/cart" className="ghost-btn">🛒 Cart</Link>
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        {isLoading ? (
          <p className="muted-text">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">📋</div>
            <h2>No orders yet</h2>
            <p className="muted-text">Your order history will appear here after you place your first order.</p>
            <Link to="/user/dashboard" className="primary-btn">Browse Menu</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <Link
                to={`/user/orders/${order._id}`}
                className="order-card"
                key={order._id}
              >
                <div className="order-card-top">
                  <span className="order-card-id">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <span
                    className="order-status-badge"
                    style={{ background: STATUS_COLORS[order.status] || '#888' }}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="order-card-items">
                  {order.items.map((item, idx) => (
                    <span key={idx}>{item.name || 'Item'} ×{item.quantity}</span>
                  ))}
                </div>
                <div className="order-card-bottom">
                  <span className="price-label">₹{order.totalPrice?.toFixed(2)}</span>
                  <span className="muted-text">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default MyOrdersPage
