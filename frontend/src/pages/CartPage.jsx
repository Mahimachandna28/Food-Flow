import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useCart } from '../context/CartContext'
import { orderAPI } from '../lib/api'
import './pages.css'

function CartPage() {
  const { user, profile, isLoading } = useAuth()
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart()
  const navigate = useNavigate()
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [isPlacing, setIsPlacing] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID?.trim() || ''
  const isOnlinePaymentConfigured = Boolean(razorpayKeyId)

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const existing = document.getElementById('razorpay-checkout-script')
      if (existing) return resolve(true)

      const script = document.createElement('script')
      script.id = 'razorpay-checkout-script'
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

  if (isLoading) {
    return (
      <main className="page-wrap">
        <section className="dashboard-card"><p className="page-message">Loading...</p></section>
      </main>
    )
  }

  if (!user) return <Navigate to="/user/signin" replace />

  const handlePlaceOrder = async () => {
    if (items.length === 0) return
    if (paymentMethod === 'ONLINE' && !isOnlinePaymentConfigured) {
      setError('Online payment is not configured. Add VITE_RAZORPAY_KEY_ID in frontend .env or use Cash on Delivery.')
      return
    }

    setIsPlacing(true)
    setError('')

    try {
      const orderData = {
        userId: user.id,
        userName: profile?.full_name || user.email,
        items: items.map((i) => ({
          foodId: i.foodId,
          name: i.name,
          price: i.price,
          quantity: i.quantity
        })),
        totalPrice,
        paymentMethod,
        deliveryAddress,
        notes
      }

      let order
      if (paymentMethod === 'ONLINE') {
        const loaded = await loadRazorpayScript()
        if (!loaded) throw new Error('Unable to load payment gateway. Please try again.')

        const paymentOrder = await orderAPI.createPaymentOrder(totalPrice)

        order = await new Promise((resolve, reject) => {
          const razorpay = new window.Razorpay({
            key: razorpayKeyId,
            amount: paymentOrder.amount,
            currency: paymentOrder.currency,
            name: 'Food Flow',
            description: 'Order Payment',
            order_id: paymentOrder.orderId,
            handler: async (response) => {
              try {
                const createdOrder = await orderAPI.verifyPaymentAndCreateOrder({
                  ...response,
                  orderData
                })
                resolve(createdOrder)
              } catch (verifyErr) {
                reject(verifyErr)
              }
            },
            prefill: {
              name: profile?.full_name || '',
              email: user.email || ''
            },
            theme: {
              color: '#2563eb'
            },
            modal: {
              ondismiss: () => reject(new Error('Payment cancelled by user.'))
            }
          })
          razorpay.open()
        })
      } else {
        order = await orderAPI.create(orderData)
      }

      clearCart()
      navigate(`/user/orders/${order._id}`)
    } catch (err) {
      const message = err.message || 'Failed to place order'
      if (message.includes('Razorpay keys are not configured on server')) {
        setError('Online payment is not configured on backend. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend .env.')
      } else {
        setError(message)
      }
    } finally {
      setIsPlacing(false)
    }
  }

  return (
    <main className="page-wrap">
      <section className="dashboard-card cart-page">
        <div className="cart-header">
          <h1>🛒 Your Cart</h1>
          <Link to="/user/dashboard" className="ghost-btn">← Back to Menu</Link>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🍽️</div>
            <h2>Your cart is empty</h2>
            <p className="muted-text">Browse the menu and add some delicious items!</p>
            <Link to="/user/dashboard" className="primary-btn">Browse Menu</Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div className="cart-item" key={item.foodId}>
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p className="price-label">₹{item.price}</p>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                    >
                      +
                    </button>
                    <span className="cart-item-subtotal">₹{item.price * item.quantity}</span>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeItem(item.foodId)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-extras">
              <label>
                Payment Method
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="COD">Cash on Delivery</option>
                  <option value="ONLINE" disabled={!isOnlinePaymentConfigured}>
                    {isOnlinePaymentConfigured ? 'Pay Online (Razorpay)' : 'Pay Online (Razorpay - Not Configured)'}
                  </option>
                </select>
              </label>
              <label>
                Delivery Address (optional)
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Room / Hostel / Building"
                />
              </label>
              <label>
                Special Notes (optional)
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions..."
                  rows={2}
                />
              </label>
            </div>

            <div className="cart-summary">
              <div className="cart-total">
                <span>Total</span>
                <span className="cart-total-price">₹{totalPrice.toFixed(2)}</span>
              </div>
              {error && <p className="error-text">{error}</p>}
              <div className="cart-actions">
                <button type="button" className="ghost-btn" onClick={clearCart}>
                  Clear Cart
                </button>
                <button
                  type="button"
                  className="primary-btn place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={isPlacing}
                >
                  {isPlacing ? 'Placing Order...' : '🚀 Place Order'}
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  )
}

export default CartPage
