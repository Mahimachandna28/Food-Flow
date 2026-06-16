import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { orderAPI } from '../lib/api'
import './pages.css'

const STATUS_STEPS = ['Preparing', 'Ready', 'Out for Delivery', 'Delivered']
const STATUS_ICONS = {
  'Preparing': '👨‍🍳',
  'Ready': '✅',
  'Out for Delivery': '🚚',
  'Delivered': '🎉',
  'Cancelled': '❌'
}

function OrderStatusPage() {
  const { id } = useParams()
  const { user, isLoading: authLoading } = useAuth()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    const fetchOrder = async () => {
      try {
        const data = await orderAPI.getById(id)
        if (isActive) setOrder(data)
      } catch (err) {
        if (isActive) setError(err.message)
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    fetchOrder()

    // Poll for status updates every 10 seconds
    const interval = setInterval(fetchOrder, 10000)

    return () => {
      isActive = false
      clearInterval(interval)
    }
  }, [id])

  if (authLoading || isLoading) {
    return (
      <main className="page-wrap">
        <section className="dashboard-card">
          <p className="page-message">Loading order details...</p>
        </section>
      </main>
    )
  }

  if (!user) return <Navigate to="/user/signin" replace />

  if (error) {
    return (
      <main className="page-wrap">
        <section className="dashboard-card">
          <h1>Order Not Found</h1>
          <p className="error-text">{error}</p>
          <Link to="/user/orders" className="ghost-btn">← Back to Orders</Link>
        </section>
      </main>
    )
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order?.status)
  const isCancelled = order?.status === 'Cancelled'

  return (
    <main className="page-wrap">
      <section className="dashboard-card order-status-page">
        <div className="order-status-header">
          <h1>Order Status</h1>
          <Link to="/user/orders" className="ghost-btn">← My Orders</Link>
        </div>

        <div className="order-id-badge">
          Order #{order?._id?.slice(-8).toUpperCase()}
        </div>

        {isCancelled ? (
          <div className="status-cancelled-banner">
            <span className="status-cancelled-icon">❌</span>
            <h2>Order Cancelled</h2>
            <p className="muted-text">This order has been cancelled.</p>
          </div>
        ) : (
          <div className="status-tracker">
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index <= currentStepIndex
              const isCurrent = index === currentStepIndex
              return (
                <div
                  key={step}
                  className={`status-step ${isCompleted ? 'step-completed' : ''} ${isCurrent ? 'step-current' : ''}`}
                >
                  <div className="step-dot">
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <div className="step-label">
                    <span className="step-icon">{STATUS_ICONS[step]}</span>
                    <span>{step}</span>
                  </div>
                  {index < STATUS_STEPS.length - 1 && (
                    <div className={`step-line ${isCompleted ? 'line-completed' : ''}`} />
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="order-detail-section">
          <h3>Items Ordered</h3>
          <div className="order-items-list">
            {order?.items?.map((item, idx) => (
              <div className="order-item-row" key={idx}>
                <span className="order-item-name">{item.name || `Item ${idx + 1}`}</span>
                <span className="order-item-qty">×{item.quantity}</span>
                <span className="order-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="order-total-row">
            <span>Total Paid</span>
            <span className="cart-total-price">₹{order?.totalPrice?.toFixed(2)}</span>
          </div>

          {order?.deliveryAddress && (
            <p className="muted-text">📍 {order.deliveryAddress}</p>
          )}
          {order?.notes && (
            <p className="muted-text">📝 {order.notes}</p>
          )}
          <p className="muted-text">
            Placed on {new Date(order?.createdAt).toLocaleString()}
          </p>
        </div>
      </section>
    </main>
  )
}

export default OrderStatusPage
