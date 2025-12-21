// Core types for the e-commerce application

export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
  role: "user" | "admin"
  createdAt: Date
  lastLogin?: Date
}

export interface Product {
  id: string
  title: string
  slug: string
  description: string
  category: string
  brand: string
  priceINR: number
  currency: "INR"
  stock: number
  images: string[]
  createdAt: Date
}

export interface CartItem {
  product: Product
  qty: number
}

export interface OrderItem {
  productId: string
  title: string
  priceINR: number
  qty: number
}

export interface ShippingAddress {
  fullName: string
  address: string
  city: string
  state: string
  postalCode: string
  phone: string
}

export interface Order {
  id: string
  userId: string
  userEmail: string
  orderItems: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  totalPriceINR: number
  isPaid: boolean
  paidAt?: Date
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentResult?: {
    id: string
    status: string
    updateTime: string
  }
  isRefunded?: boolean
  refundAmountINR?: number
  refundReason?: string
  refundedAt?: Date
  createdAt: Date
}

export interface SessionUser {
  id: string
  name: string
  email: string
  role: "user" | "admin"
}

export interface SalesByDay {
  date: string
  totalSalesINR: number
  returnsINR: number
  orderCount: number
}

export interface AdminStats {
  totalRevenueINR: number
  totalProducts: number
  totalOrders: number
  totalUsers: number
  returnsAmountINR: number
  ordersByStatus: {
    pending: number
    processing: number
    shipped: number
    delivered: number
    cancelled: number
  }
  salesByDay: SalesByDay[]
}
