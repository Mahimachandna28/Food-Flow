import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { orderAPI, foodAPI } from '../../lib/api'
import '../pages.css'

const STATUS_OPTIONS = ['Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled']
const STATUS_COLORS = {
  'Preparing': '#f59e0b',
  'Ready': '#10b981',
  'Out for Delivery': '#3b82f6',
  'Delivered': '#22c55e',
  'Cancelled': '#ef4444'
}

function AdminDashboardPage() {
  const { signOut } = useAuth()
  const [orders, setOrders] = useState([])
  const [foodItems, setFoodItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [activeTab, setActiveTab] = useState('orders')
  const [updatingId, setUpdatingId] = useState(null)

  // Food form state
  const [foodForm, setFoodForm] = useState({
    name: '', price: '', category: 'General', description: '', outlet_name: '', available: true
  })
  const [editingFoodId, setEditingFoodId] = useState(null)
  const [isSavingFood, setIsSavingFood] = useState(false)

  const fetchOrders = async () => {
    try {
      const data = await orderAPI.getAll(statusFilter)
      setOrders(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const fetchFood = async () => {
    try {
      const data = await foodAPI.getAll()
      setFoodItems(data)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    let isActive = true

    const loadAll = async () => {
      setIsLoading(true)
      await Promise.all([fetchOrders(), fetchFood()])
      if (isActive) setIsLoading(false)
    }

    loadAll()
    return () => { isActive = false }
  }, [statusFilter])

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    try {
      await orderAPI.updateStatus(orderId, newStatus)
      await fetchOrders()
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDeleteFood = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    try {
      await foodAPI.delete(id)
      await fetchFood()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleFoodFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFoodForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFoodSubmit = async (e) => {
    e.preventDefault()
    setIsSavingFood(true)
    setError('')

    const payload = {
      ...foodForm,
      price: Number(foodForm.price)
    }

    try {
      if (editingFoodId) {
        await foodAPI.update(editingFoodId, payload)
      } else {
        await foodAPI.add(payload)
      }
      setFoodForm({ name: '', price: '', category: 'General', description: '', outlet_name: '', available: true })
      setEditingFoodId(null)
      await fetchFood()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSavingFood(false)
    }
  }

  const startEditFood = (item) => {
    setEditingFoodId(item._id)
    setFoodForm({
      name: item.name,
      price: String(item.price),
      category: item.category || 'General',
      description: item.description || '',
      outlet_name: item.outlet_name || '',
      available: item.available !== false
    })
    setActiveTab('food')
  }

  const orderStats = {
    total: orders.length,
    preparing: orders.filter((o) => o.status === 'Preparing').length,
    ready: orders.filter((o) => o.status === 'Ready').length,
    delivered: orders.filter((o) => o.status === 'Delivered').length,
  }

  return (
    <main className="page-wrap">
      <section className="admin-layout admin-dashboard">
        <div className="admin-header">
          <h1>🔧 Admin Dashboard</h1>
          <div className="admin-actions">
            <Link to="/" className="ghost-btn">Home</Link>
            <Link to="/admin/menu" className="ghost-btn">Menu Manager</Link>
            <button type="button" className="ghost-btn" onClick={signOut}>Sign out</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats-grid">
          <div className="stat-card stat-total">
            <span className="stat-number">{orderStats.total}</span>
            <span className="stat-label">Total Orders</span>
          </div>
          <div className="stat-card stat-preparing">
            <span className="stat-number">{orderStats.preparing}</span>
            <span className="stat-label">Preparing</span>
          </div>
          <div className="stat-card stat-ready">
            <span className="stat-number">{orderStats.ready}</span>
            <span className="stat-label">Ready</span>
          </div>
          <div className="stat-card stat-delivered">
            <span className="stat-number">{orderStats.delivered}</span>
            <span className="stat-label">Delivered</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'orders' ? 'admin-tab-active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 Orders ({orders.length})
          </button>
          <button
            className={`admin-tab ${activeTab === 'food' ? 'admin-tab-active' : ''}`}
            onClick={() => setActiveTab('food')}
          >
            🍔 Food Items ({foodItems.length})
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="admin-tab-content">
            <div className="admin-filter-row">
              <label>
                Filter by status
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>

            {isLoading ? (
              <p className="muted-text">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="muted-text">No orders found.</p>
            ) : (
              <div className="admin-orders-list">
                {orders.map((order) => (
                  <div className="admin-order-card" key={order._id}>
                    <div className="admin-order-top">
                      <div>
                        <span className="order-card-id">#{order._id.slice(-8).toUpperCase()}</span>
                        <span className="muted-text"> — {order.userName || 'Guest'}</span>
                      </div>
                      <span
                        className="order-status-badge"
                        style={{ background: STATUS_COLORS[order.status] || '#888' }}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="admin-order-items">
                      {order.items.map((item, idx) => (
                        <span key={idx} className="admin-order-item-tag">
                          {item.name || 'Item'} ×{item.quantity}
                        </span>
                      ))}
                    </div>

                    <div className="admin-order-bottom">
                      <span className="price-label">₹{order.totalPrice?.toFixed(2)}</span>
                      <span className="muted-text">{new Date(order.createdAt).toLocaleString()}</span>
                    </div>

                    {order.deliveryAddress && (
                      <p className="muted-text admin-order-address">📍 {order.deliveryAddress}</p>
                    )}
                    {order.notes && (
                      <p className="muted-text admin-order-notes">📝 {order.notes}</p>
                    )}

                    <div className="admin-order-status-controls">
                      <label>
                        Update Status:
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updatingId === order._id}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Food Items Tab */}
        {activeTab === 'food' && (
          <div className="admin-tab-content">
            <form className="admin-form admin-food-form" onSubmit={handleFoodSubmit}>
              <h2>{editingFoodId ? '✏️ Edit Food Item' : '➕ Add Food Item'}</h2>
              <label>
                Item Name
                <input name="name" value={foodForm.name} onChange={handleFoodFormChange} required />
              </label>
              <label>
                Price (₹)
                <input name="price" type="number" min="0" step="0.01" value={foodForm.price} onChange={handleFoodFormChange} required />
              </label>
              <label>
                Category
                <input name="category" value={foodForm.category} onChange={handleFoodFormChange} />
              </label>
              <label>
                Outlet Name
                <input name="outlet_name" value={foodForm.outlet_name} onChange={handleFoodFormChange} placeholder="e.g. Snapeats" />
              </label>
              <label>
                Description
                <textarea name="description" value={foodForm.description} onChange={handleFoodFormChange} rows={2} />
              </label>
              <label className="checkbox-row">
                <input name="available" type="checkbox" checked={foodForm.available} onChange={handleFoodFormChange} />
                Available
              </label>
              <div className="admin-form-actions">
                <button type="submit" className="primary-btn" disabled={isSavingFood}>
                  {isSavingFood ? 'Saving...' : editingFoodId ? 'Update Item' : 'Add Item'}
                </button>
                {editingFoodId && (
                  <button type="button" className="ghost-btn" onClick={() => {
                    setEditingFoodId(null)
                    setFoodForm({ name: '', price: '', category: 'General', description: '', outlet_name: '', available: true })
                  }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="menu-list">
              <h2>All Food Items</h2>
              {foodItems.length === 0 ? (
                <p className="muted-text">No food items yet. Add one above.</p>
              ) : (
                <div className="menu-items-grid">
                  {foodItems.map((item) => (
                    <article className="menu-item-card" key={item._id}>
                      <div className="menu-item-header">
                        <h3>{item.name}</h3>
                        <span className={item.available !== false ? 'status-available' : 'status-unavailable'}>
                          {item.available !== false ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      {item.outlet_name && <p className="muted-text">{item.outlet_name}</p>}
                      {item.description && <p>{item.description}</p>}
                      <p className="price-label">₹{item.price}</p>
                      <p className="muted-text">{item.category}</p>
                      <div className="menu-item-actions">
                        <button type="button" className="ghost-btn" onClick={() => startEditFood(item)}>Edit</button>
                        <button type="button" className="ghost-btn delete-btn" onClick={() => handleDeleteFood(item._id)}>Delete</button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default AdminDashboardPage
