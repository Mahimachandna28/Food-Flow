import { createContext, useCallback, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addItem = useCallback((food) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.foodId === food._id)
      if (existing) {
        return prev.map((i) =>
          i.foodId === food._id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [
        ...prev,
        {
          foodId: food._id,
          name: food.name,
          price: food.price,
          quantity: 1
        }
      ]
    })
  }, [])

  const removeItem = useCallback((foodId) => {
    setItems((prev) => prev.filter((i) => i.foodId !== foodId))
  }, [])

  const updateQuantity = useCallback((foodId, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.foodId !== foodId))
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.foodId === foodId ? { ...i, quantity } : i))
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
