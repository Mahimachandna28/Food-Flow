import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import '../pages.css'

const OUTLETS = ['Snapeats', 'Southern Stories', 'Nestle HotSpot', 'Green Nox']

function AuthPage({ role, mode }) {
  const navigate = useNavigate()
  const { signIn, signUpWithRole } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    outletName: OUTLETS[0]
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isSignUp = mode === 'signup'
  const titleRole = role === 'admin' ? 'Admin' : 'Student'

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const getRedirectPath = (userRole) => (userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (isSignUp) {
        if (role === 'admin' && !formData.outletName) {
          setError('Please choose your outlet.')
          return
        }

        const { error: signUpError, data } = await signUpWithRole({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          role,
          outletName: role === 'admin' ? formData.outletName : ''
        })

        if (signUpError) {
          setError(signUpError.message)
          return
        }

        navigate(getRedirectPath(role), { replace: true })
        return
      }

      // Sign In
      const { data, error: signInError } = await signIn({
        email: formData.email,
        password: formData.password
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      const userRole = data?.user?.role || role
      
      if (role === 'admin' && userRole !== 'admin') {
        setError('This account is not an admin account. Please use Student Login.')
        return
      }
      if (role === 'user' && userRole === 'admin') {
        setError('This is an admin account. Please use Admin Login.')
        return
      }

      navigate(getRedirectPath(userRole), { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-wrap">
      <section className="auth-card">
        <h1>{titleRole} {isSignUp ? 'Register' : 'Sign In'}</h1>
        <p className="muted-text">
          {isSignUp ? 'Create your account to continue.' : 'Welcome back. Sign in to continue.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <label>
              Full Name
              <input
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
              />
            </label>
          )}

          <label>
            Email
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
            />
          </label>

          {role === 'admin' && isSignUp && (
            <label>
              Outlet
              <select
                name="outletName"
                required
                value={formData.outletName}
                onChange={handleChange}
              >
                {OUTLETS.map((outlet) => (
                  <option key={outlet} value={outlet}>
                    {outlet}
                  </option>
                ))}
              </select>
            </label>
          )}

          {error && <p className="error-text">{error}</p>}

          <button className="primary-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="auth-links">
          {isSignUp ? (
            <Link to={role === 'admin' ? '/admin/signin' : '/user/signin'}>Already have an account? Sign in</Link>
          ) : (
            <Link to={role === 'admin' ? '/admin/signup' : '/user/signup'}>Need an account? Register</Link>
          )}
          <Link to="/">Back to home</Link>
        </div>
      </section>
    </main>
  )
}

export default AuthPage
