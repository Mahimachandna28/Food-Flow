import { Link, Navigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { useCart } from '../context/CartContext'
import { foodAPI } from '../lib/api'
import './pages.css'

function UserDashboardPage() {
  const { user, profile, signOut, isLoading } = useAuth()
  const { addItem, totalItems } = useCart()

  const [menuItems, setMenuItems] = useState([])
  const [isMenuLoading, setIsMenuLoading] = useState(true)
  const [menuError, setMenuError] = useState('')
  const [outletFilter, setOutletFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [addedFeedback, setAddedFeedback] = useState(null)

  useEffect(() => {
    let isActive = true

    const loadMenu = async () => {
      setIsMenuLoading(true)
      setMenuError('')

      try {
        const data = await foodAPI.getAll({ available: true })
        if (!isActive) return
        setMenuItems(data ?? [])
      } catch (err) {
        if (!isActive) return
        setMenuError(err.message)
      } finally {
        if (isActive) setIsMenuLoading(false)
      }
    }

    loadMenu()
    return () => { isActive = false }
  }, [])

  const outlets = useMemo(() => {
    return Array.from(new Set(menuItems.map((i) => i.outlet_name).filter(Boolean))).sort()
  }, [menuItems])

  const categories = useMemo(() => {
    const filtered = outletFilter
      ? menuItems.filter((i) => i.outlet_name === outletFilter)
      : menuItems
    return Array.from(new Set(filtered.map((i) => i.category).filter(Boolean))).sort()
  }, [menuItems, outletFilter])

  const visibleItems = useMemo(() => {
    let filtered = menuItems
    if (outletFilter) filtered = filtered.filter((i) => i.outlet_name === outletFilter)
    if (categoryFilter) filtered = filtered.filter((i) => i.category === categoryFilter)
    return filtered
  }, [menuItems, outletFilter, categoryFilter])

  const handleAddToCart = (item) => {
    addItem(item)
    setAddedFeedback(item._id)
    setTimeout(() => setAddedFeedback(null), 1200)
  }

  const handleOutletChange = (outlet) => {
    setOutletFilter(outlet)
    setCategoryFilter('')
  }

  if (isLoading) {
    return (
      <main className="page-wrap">
        <section className="dashboard-card">
          <p className="page-message">Loading...</p>
        </section>
      </main>
    )
  }

  if (!user) return <Navigate to="/user/signin" replace />
  if (profile?.role === 'admin') return <Navigate to="/admin/dashboard" replace />

  return (
    <main className="page-wrap">
      <section className="dashboard-card">
        <div className="user-dashboard-header">
          <div>
            <h1>🍕 Campus Menu</h1>
            <p className="muted-text">Welcome {profile?.full_name ?? user?.email}! Browse and order from any outlet.</p>
          </div>
          <div className="admin-actions">
            <Link to="/user/orders" className="ghost-btn">📦 My Orders</Link>
            <Link to="/user/cart" className="ghost-btn cart-nav-btn">
              🛒 Cart {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
            <Link to="/" className="ghost-btn">Home</Link>
            <button type="button" className="ghost-btn" onClick={signOut}>Sign out</button>
          </div>
        </div>

        <div className="user-menu">
          {/* Outlet Tabs */}
          <div className="user-menu-header">
            <div className="user-menu-outlet-tabs">
              <button
                type="button"
                className={`outlet-tab ${outletFilter === '' ? 'outlet-tab-active' : ''}`}
                onClick={() => handleOutletChange('')}
              >
                🏫 All Outlets
              </button>
              {outlets.map((outlet) => (
                <button
                  key={outlet}
                  type="button"
                  className={`outlet-tab ${outletFilter === outlet ? 'outlet-tab-active' : ''}`}
                  onClick={() => handleOutletChange(outlet)}
                >
                  {outlet}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          {categories.length > 1 && (
            <div className="user-menu-outlet-tabs" style={{ marginTop: '-8px', borderBottom: 'none' }}>
              <button
                type="button"
                className={`outlet-tab ${categoryFilter === '' ? 'outlet-tab-active' : ''}`}
                onClick={() => setCategoryFilter('')}
                style={{ fontSize: '0.85rem', padding: '8px 12px' }}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`outlet-tab ${categoryFilter === cat ? 'outlet-tab-active' : ''}`}
                  onClick={() => setCategoryFilter(cat)}
                  style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {menuError && <p className="error-text">{menuError}</p>}
          {isMenuLoading ? (
            <p className="muted-text">Loading menu...</p>
          ) : visibleItems.length === 0 ? (
            <p className="muted-text">No menu items available.</p>
          ) : (
            <>
              <p className="muted-text" style={{ marginBottom: '16px' }}>
                Showing {visibleItems.length} item{visibleItems.length !== 1 ? 's' : ''}
                {outletFilter ? ` from ${outletFilter}` : ' across all outlets'}
              </p>
              <div className="menu-items-grid">
                {visibleItems.map((item) => (
                  <article className="menu-item-card menu-item-card-student" key={item._id}>
                    <div className="menu-item-header">
                      <h3>{item.name}</h3>
                      <span className="price-label">₹{item.price}</span>
                    </div>
                    {item.outlet_name && <p className="muted-text" style={{ fontSize: '0.8rem', margin: '2px 0' }}>📍 {item.outlet_name}</p>}
                    {item.description && <p className="menu-item-desc">{item.description}</p>}
                    <button
                      type="button"
                      className={`add-to-cart-btn ${addedFeedback === item._id ? 'added' : ''}`}
                      onClick={() => handleAddToCart(item)}
                    >
                      {addedFeedback === item._id ? '✓ Added!' : '+ Add to Cart'}
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

export default UserDashboardPage
