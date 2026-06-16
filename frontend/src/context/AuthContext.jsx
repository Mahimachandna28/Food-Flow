import { useCallback, useEffect, useState } from 'react'
import { AuthContext } from './auth-context'
import { authAPI } from '../lib/api'

const TOKEN_KEY = 'foodflow_token'
const USER_KEY = 'foodflow_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load saved session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY)
    const savedUser = localStorage.getItem(USER_KEY)

    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        setUser(parsed)
        setProfile(parsed)
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }

    setIsLoading(false)
  }, [])

  const saveSession = (token, userData) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setUser(userData)
    setProfile(userData)
  }

  const signUpWithRole = useCallback(async ({ email, password, fullName, role, outletName = '' }) => {
    try {
      const result = await authAPI.signup({
        email,
        password,
        full_name: fullName,
        role,
        outlet_name: outletName
      })

      saveSession(result.token, result.user)
      return { error: null, data: result }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    try {
      const result = await authAPI.signin({ email, password })
      saveSession(result.token, result.user)
      return { data: { user: result.user }, error: null }
    } catch (err) {
      return { data: null, error: { message: err.message } }
    }
  }, [])

  const signOut = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
    setProfile(null)
  }, [])

  const refreshProfile = useCallback(async (userId) => {
    const id = userId ?? user?.id
    if (!id) {
      setProfile(null)
      return null
    }
    try {
      const profileData = await authAPI.getProfile(id)
      setProfile(profileData)
      return profileData
    } catch {
      setProfile(null)
      return null
    }
  }, [user?.id])

  const ensureProfileForUser = useCallback(async (authUser) => {
    if (!authUser) return null
    // Profile is already set during login/signup
    return profile ?? authUser
  }, [profile])

  const value = {
    user,
    profile,
    isLoading,
    signIn,
    signOut,
    signUpWithRole,
    refreshProfile,
    ensureProfileForUser,
    supabaseConfigError: null
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
