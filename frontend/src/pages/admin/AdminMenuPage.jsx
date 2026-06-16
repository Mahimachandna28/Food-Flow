import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { supabase, supabaseConfigError } from '../../lib/supabaseClient'
import '../pages.css'

const initialForm = {
  outlet_name: '',
  name: '',
  description: '',
  price: '',
  is_available: true
}

function AdminMenuPage() {
  const { signOut, profile } = useAuth()
  const managedOutlet = profile?.role === 'admin' ? (profile?.outlet_name ?? '').trim() : ''
  const [items, setItems] = useState([])
  const [formData, setFormData] = useState(initialForm)
  const [editingItemId, setEditingItemId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [outletFilter, setOutletFilter] = useState('') // '' means "All outlets"

  const outlets = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.outlet_name).filter(Boolean))).sort()
  }, [items])

  const visibleItems = useMemo(() => {
    if (!outletFilter) return items
    return items.filter((i) => i.outlet_name === outletFilter)
  }, [items, outletFilter])

  const fetchItems = async () => {
    if (!supabase) {
      setError(supabaseConfigError)
      setIsLoading(false)
      return
    }

    let query = supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (managedOutlet) {
      query = query.eq('outlet_name', managedOutlet)
    }

    const { data, error: fetchError } = await query

    if (fetchError) {
      setError(fetchError.message)
      setIsLoading(false)
      return
    }

    setItems(data ?? [])
    setError('')
    setIsLoading(false)
  }

  useEffect(() => {
    let isActive = true

    async function loadInitialItems() {
      if (!supabase) {
        if (!isActive) return
        setError(supabaseConfigError)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      let query = supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (managedOutlet) {
        query = query.eq('outlet_name', managedOutlet)
      }

      const { data, error: fetchError } = await query

      if (!isActive) {
        return
      }

      if (fetchError) {
        setError(fetchError.message)
        setIsLoading(false)
        return
      }

      setItems(data ?? [])
      setError('')
      setIsLoading(false)
    }

    loadInitialItems()

    return () => {
      isActive = false
    }
  }, [managedOutlet])

  const resetForm = () => {
    setFormData({ ...initialForm, outlet_name: managedOutlet || outletFilter })
    setEditingItemId(null)
  }

  const handleOutletFilterChange = (nextOutlet) => {
    if (managedOutlet) {
      return
    }
    setOutletFilter(nextOutlet)

    // Keep the form outlet in sync when the user picks a filter (only if not editing).
    if (!editingItemId) {
      setFormData((prev) => ({ ...prev, outlet_name: nextOutlet }))
    }
  }

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleEdit = (item) => {
    setEditingItemId(item.id)
    setOutletFilter(item.outlet_name ?? '')
    setFormData({
      outlet_name: item.outlet_name ?? '',
      name: item.name ?? '',
      description: item.description ?? '',
      price: String(item.price ?? ''),
      is_available: Boolean(item.is_available)
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!supabase) {
      setError(supabaseConfigError)
      setIsSaving(false)
      return
    }
    setIsSaving(true)
    setError('')

    const payload = {
      outlet_name: (managedOutlet || formData.outlet_name).trim(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      is_available: formData.is_available
    }

    if (!payload.outlet_name || !payload.name || Number.isNaN(payload.price)) {
      setError('Outlet name, item name, and a valid price are required.')
      setIsSaving(false)
      return
    }

    const query = editingItemId
      ? supabase.from('menu_items').update(payload).eq('id', editingItemId)
      : supabase.from('menu_items').insert(payload)

    const { error: saveError } = await query
    if (saveError) {
      setError(saveError.message)
      setIsSaving(false)
      return
    }

    await fetchItems()
    resetForm()
    setIsSaving(false)
  }

  const toggleAvailability = async (item) => {
    const { error: updateError } = await supabase
      .from('menu_items')
      .update({ is_available: !item.is_available })
      .eq('id', item.id)

    if (updateError) {
      setError(updateError.message)
      return
    }

    await fetchItems()
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <main className="page-wrap">
      <section className="admin-layout">
        <div className="admin-header">
          <h1>Admin Menu Management</h1>
          <div className="admin-actions">
            <Link to="/" className="ghost-btn">Home</Link>
            <button type="button" className="ghost-btn" onClick={handleSignOut}>Sign out</button>
          </div>
        </div>

        {managedOutlet && (
          <p className="muted-text">Signed in outlet: <strong>{managedOutlet}</strong></p>
        )}

        <div className="outlet-filter-row">
          <label>
            Filter by outlet
            <select
              value={managedOutlet || outletFilter}
              onChange={(e) => handleOutletFilterChange(e.target.value)}
              disabled={Boolean(managedOutlet)}
            >
              <option value="">All outlets</option>
              {outlets.map((outlet) => (
                <option key={outlet} value={outlet}>
                  {outlet}
                </option>
              ))}
            </select>
          </label>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>{editingItemId ? 'Edit Menu Item' : 'Create Menu Item'}</h2>
          <label>
            Outlet Name
            <input
              name="outlet_name"
              value={managedOutlet || formData.outlet_name}
              onChange={handleInputChange}
              readOnly={Boolean(managedOutlet)}
              required
            />
          </label>
          <label>
            Item Name
            <input name="name" value={formData.name} onChange={handleInputChange} required />
          </label>
          <label>
            Description
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} />
          </label>
          <label>
            Price
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </label>
          <label className="checkbox-row">
            <input
              name="is_available"
              type="checkbox"
              checked={formData.is_available}
              onChange={handleInputChange}
            />
            Available now
          </label>
          {error && <p className="error-text">{error}</p>}
          <div className="admin-form-actions">
            <button type="submit" className="primary-btn" disabled={isSaving}>
              {isSaving ? 'Saving...' : editingItemId ? 'Update Item' : 'Create Item'}
            </button>
            {editingItemId && (
              <button type="button" className="ghost-btn" onClick={resetForm}>Cancel edit</button>
            )}
          </div>
        </form>

        <section className="menu-list">
          <h2>Current Menu</h2>
          {isLoading ? (
            <p className="muted-text">Loading menu items...</p>
          ) : visibleItems.length === 0 ? (
            <p className="muted-text">No menu items found. Add your first item above.</p>
          ) : (
            <div className="menu-items-grid">
              {visibleItems.map((item) => (
                <article className="menu-item-card" key={item.id}>
                  <div className="menu-item-header">
                    <h3>{item.name}</h3>
                    <span className={item.is_available ? 'status-available' : 'status-unavailable'}>
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <p className="muted-text">{item.outlet_name}</p>
                  <p>{item.description}</p>
                  <p className="price-label">Rs. {item.price}</p>
                  <div className="menu-item-actions">
                    <button type="button" className="ghost-btn" onClick={() => handleEdit(item)}>Edit</button>
                    <button type="button" className="ghost-btn" onClick={() => toggleAvailability(item)}>
                      Toggle Availability
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

export default AdminMenuPage
