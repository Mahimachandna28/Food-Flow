import './App.css'
import { Link } from 'react-router-dom'
import { useAuth } from './context/useAuth'
import { useCart } from './context/CartContext'

function Header() {
  const { user, profile, signOut, isLoading } = useAuth()
  const { totalItems } = useCart()
  const isLoggedIn = !!user
  const isAdmin = profile?.role === 'admin'

  return (
    <header className="header">
      <Link to="/" className="logo-link">
        <div className="logo">
          <span className="logo-icon">🍽️</span>
          <h1>FoodFlow</h1>
        </div>
      </Link>
      <nav className="nav">
        {!isLoading && isLoggedIn ? (
          <>
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/admin/menu" className="nav-link">Manage Menu</Link>
              </>
            ) : (
              <>
                <Link to="/user/dashboard" className="nav-link">Menu</Link>
                <Link to="/user/orders" className="nav-link">My Orders</Link>
                <Link to="/user/cart" className="nav-link cart-link">
                  🛒 Cart
                  {totalItems > 0 && <span className="header-cart-badge">{totalItems}</span>}
                </Link>
              </>
            )}
            <button type="button" className="btn-portal btn-signout" onClick={signOut}>Sign Out</button>
          </>
        ) : (
          <>
            <Link className="btn-portal" to="/user/signin">Student Login</Link>
            <Link className="btn-portal btn-admin" to="/admin/signin">Admin Login</Link>
          </>
        )}
      </nav>
    </header>
  )
}

function DiningOutletCard({ name, description, icon, comingSoon, itemCount }) {
  const { user } = useAuth()

  const inner = (
    <div className="card">
      <div className="card-image" data-outlet={name}></div>
      <div className="card-overlay">
        {comingSoon && <span className="badge">Coming Soon</span>}
        {!comingSoon && itemCount > 0 && (
          <span className="badge badge-items">{itemCount} items</span>
        )}
        <div className="card-icon">{icon}</div>
        <h3>{name}</h3>
        <p>{description}</p>
        {!comingSoon && (
          <span className="card-explore">
            {user ? 'Order Now →' : 'View Menu →'}
          </span>
        )}
      </div>
    </div>
  )

  if (comingSoon) return inner

  return (
    <Link to={user ? '/user/dashboard' : '/user/signin'} className="card-link">
      {inner}
    </Link>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}

function App() {
  const outlets = [
    {
      name: 'Snapeats',
      description: 'Quick bites, burgers, wraps & snacks for students on the go',
      icon: '🍔',
      comingSoon: false,
      itemCount: 6
    },
    {
      name: 'Southern Stories',
      description: 'Authentic South Indian cuisine — dosa, idli, vada & more',
      icon: '🥘',
      comingSoon: false,
      itemCount: 6
    },
    {
      name: 'Nestle HotSpot',
      description: 'Premium coffee, shakes, desserts & comfort food favorites',
      icon: '☕',
      comingSoon: false,
      itemCount: 6
    },
    {
      name: 'Green Nox',
      description: 'Healthy bowls, salads, smoothies & organic options',
      icon: '🥗',
      comingSoon: false,
      itemCount: 6
    }
  ]

  return (
    <div className="app">
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🎓 Campus Dining Platform</span>
          <h2 className="hero-title">
            Skip the Queue.<br />
            <span className="hero-highlight">Order Smart.</span>
          </h2>
          <p className="hero-subtitle">
            Browse menus from all campus food outlets, place orders instantly,
            and track your food in real-time — all from your phone.
          </p>
          <div className="hero-actions">
            <Link to="/user/signin" className="btn-hero-primary">
              🚀 Start Ordering
            </Link>
            <a href="#outlets" className="btn-hero-secondary">
              Explore Outlets ↓
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">4</span>
              <span className="hero-stat-label">Food Outlets</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-num">24+</span>
              <span className="hero-stat-label">Menu Items</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-num">Live</span>
              <span className="hero-stat-label">Order Tracking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Outlets Grid */}
      <main className="main" id="outlets">
        <span className="tag">🏫 Campus Dining</span>
        <h2 className="title">Our Food Outlets</h2>
        <p className="subtitle">Explore a variety of culinary experiences right on campus</p>
        <div className="cards-grid">
          {outlets.map((outlet) => (
            <DiningOutletCard
              key={outlet.name}
              name={outlet.name}
              description={outlet.description}
              icon={outlet.icon}
              comingSoon={outlet.comingSoon}
              itemCount={outlet.itemCount}
            />
          ))}
        </div>
      </main>

      {/* Features */}
      <section className="features-section">
        <h2 className="title">How It Works</h2>
        <p className="subtitle">Three simple steps to get your food</p>
        <div className="features-grid">
          <FeatureCard icon="📱" title="Browse & Select" desc="Explore menus from all campus outlets and add your favorites to cart." />
          <FeatureCard icon="💳" title="Place Order" desc="Review your cart, add delivery details, and place your order instantly." />
          <FeatureCard icon="📍" title="Track & Pickup" desc="Get real-time status updates — Preparing, Ready, Out for Delivery." />
        </div>
      </section>

      {/* Quick Access */}
      <section className="quick-access-section">
        <h2 className="title">Quick Access</h2>
        <p className="subtitle">Jump directly to where you need to go</p>
        <div className="quick-grid">
          <Link to="/user/signin" className="quick-card">
            <span className="quick-icon">👤</span>
            <h3>Student Login</h3>
            <p>Sign in to browse menus and place orders</p>
          </Link>
          <Link to="/admin/signin" className="quick-card">
            <span className="quick-icon">🔧</span>
            <h3>Admin Login</h3>
            <p>Manage your outlet, menu items and orders</p>
          </Link>
          <Link to="/user/signup" className="quick-card">
            <span className="quick-icon">✨</span>
            <h3>Register</h3>
            <p>Create a new student account to get started</p>
          </Link>
          <Link to="/admin/signup" className="quick-card">
            <span className="quick-icon">🏪</span>
            <h3>Register Outlet</h3>
            <p>Set up your food outlet as an admin</p>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="logo-icon">🍽️</span>
            <span className="footer-name">FoodFlow</span>
          </div>
          <p className="footer-tagline">Built for scale. Built for speed. Built for the modern campus.</p>
          <div className="footer-links">
            <Link to="/user/signin">Student Portal</Link>
            <Link to="/admin/signin">Admin Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
