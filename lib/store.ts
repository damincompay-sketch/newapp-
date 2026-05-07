import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Product {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  wholesalePrice: number
  retailPrice: number
  minQuantity: number
  category: string
  categoryAr: string
  image: string
  stock: number
  unit: string
  unitAr: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  isAdmin: boolean
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  discount: number
  deliveryDetails: {
    fullName: string
    phone: string
    address: string
    city?: string
    neighborhood?: string
    street?: string
    buildingNumber?: string
    landmark?: string
    notes?: string
    latitude?: number
    longitude?: number
  }
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  createdAt: string
}

interface AppState {
  // Cart
  cart: CartItem[]
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  
  // Auth
  user: User | null
  setUser: (user: User | null) => void
  
  // Orders
  orders: Order[]
  addOrder: (order: Order) => void
  
  // Cart visibility
  isCartOpen: boolean
  setCartOpen: (open: boolean) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (product, quantity) => {
        const cart = get().cart
        const existingItem = cart.find(item => item.product.id === product.id)
        
        if (existingItem) {
          set({
            cart: cart.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          set({ cart: [...cart, { product, quantity }] })
        }
      },
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter(item => item.product.id !== productId) })
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId)
          return
        }
        set({
          cart: get().cart.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        })
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.product.wholesalePrice * item.quantity,
          0
        )
      },
      
      // Auth
      user: null,
      setUser: (user) => set({ user }),
      
      // Orders
      orders: [],
      addOrder: (order) => set({ orders: [...get().orders, order] }),
      
      // Cart visibility
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
    }),
    {
      name: 'jomlah-store',
      partialize: (state) => ({ 
        cart: state.cart, 
        user: state.user,
        orders: state.orders 
      }),
    }
  )
)

// Format price in Yemeni Rial
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ar-YE', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' ر.ي'
}
