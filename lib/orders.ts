import type { Order, OrderItem, ShippingAddress, SalesByDay, AdminStats } from "./types"

// In-memory order store (in production, use a real database)
const orders: Order[] = []

function generateDemoOrders(): void {
  if (orders.length > 0) return // Already seeded

  const demoOrders: Partial<Order>[] = [
    {
      userId: "user-demo-1",
      userEmail: "customer1@example.com",
      orderItems: [
        { productId: "product-1", title: "Samsung Galaxy S24 Ultra", priceINR: 124999, qty: 1 },
        { productId: "product-3", title: "Sony WH-1000XM5 Headphones", priceINR: 29990, qty: 1 },
      ],
      shippingAddress: {
        fullName: "Rahul Sharma",
        address: "123 MG Road",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
        phone: "9876543210",
      },
      paymentMethod: "stripe",
      totalPriceINR: 154989,
      isPaid: true,
      paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: "delivered",
    },
    {
      userId: "user-demo-2",
      userEmail: "customer2@example.com",
      orderItems: [{ productId: "product-5", title: "Apple MacBook Air M3", priceINR: 114900, qty: 1 }],
      shippingAddress: {
        fullName: "Priya Patel",
        address: "456 Brigade Road",
        city: "Bangalore",
        state: "Karnataka",
        postalCode: "560001",
        phone: "9876543211",
      },
      paymentMethod: "stripe",
      totalPriceINR: 114900,
      isPaid: true,
      paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: "shipped",
    },
    {
      userId: "user-demo-3",
      userEmail: "customer3@example.com",
      orderItems: [
        { productId: "product-21", title: "Prestige Electric Kettle", priceINR: 1299, qty: 2 },
        { productId: "product-22", title: "Philips Mixer Grinder", priceINR: 4999, qty: 1 },
      ],
      shippingAddress: {
        fullName: "Amit Kumar",
        address: "789 Park Street",
        city: "Kolkata",
        state: "West Bengal",
        postalCode: "700016",
        phone: "9876543212",
      },
      paymentMethod: "upi",
      totalPriceINR: 7597,
      isPaid: true,
      paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: "processing",
    },
    {
      userId: "user-demo-4",
      userEmail: "customer4@example.com",
      orderItems: [{ productId: "product-39", title: "Nike Air Max 270", priceINR: 13995, qty: 1 }],
      shippingAddress: {
        fullName: "Sneha Reddy",
        address: "321 Jubilee Hills",
        city: "Hyderabad",
        state: "Telangana",
        postalCode: "500033",
        phone: "9876543213",
      },
      paymentMethod: "stripe",
      totalPriceINR: 13995,
      isPaid: false,
      status: "pending",
    },
    {
      userId: "user-demo-5",
      userEmail: "customer5@example.com",
      orderItems: [
        { productId: "product-57", title: "The Psychology of Money", priceINR: 399, qty: 3 },
        { productId: "product-58", title: "Atomic Habits", priceINR: 499, qty: 2 },
      ],
      shippingAddress: {
        fullName: "Vikram Singh",
        address: "567 Connaught Place",
        city: "Delhi",
        state: "Delhi",
        postalCode: "110001",
        phone: "9876543214",
      },
      paymentMethod: "upi",
      totalPriceINR: 2195,
      isPaid: true,
      paidAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      status: "refunded",
      isRefunded: true,
      refundAmountINR: 2195,
      refundReason: "Customer requested cancellation",
    },
  ]

  demoOrders.forEach((order, index) => {
    const createdAt = new Date(Date.now() - (index + 1) * 3 * 24 * 60 * 60 * 1000)
    orders.push({
      id: `order-demo-${index + 1}`,
      ...order,
      createdAt,
    } as Order)
  })
}

// Initialize demo orders
generateDemoOrders()

export function getOrders(): Order[] {
  return [...orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function getOrderById(id: string): Order | undefined {
  return orders.find((o) => o.id === id)
}

export function getOrdersByUserId(userId: string): Order[] {
  return orders.filter((o) => o.userId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

// Get total order count for a user
export function getUserOrderCount(userId: string): number {
  return orders.filter((o) => o.userId === userId).length
}

// Get last order amount for a user (most recent order's total)
export function getUserLastOrderAmount(userId: string): number | null {
  const userOrders = getOrdersByUserId(userId)
  if (userOrders.length === 0) return null
  return userOrders[0].totalPriceINR
}

export function createOrder(data: {
  userId: string
  userEmail: string
  orderItems: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  totalPriceINR: number
}): Order {
  const order: Order = {
    id: `order-${Date.now()}`,
    ...data,
    isPaid: false,
    status: "pending",
    createdAt: new Date(),
  }

  orders.push(order)
  return order
}

export function updateOrderStatus(id: string, status: Order["status"]): Order | null {
  const order = orders.find((o) => o.id === id)
  if (order) {
    order.status = status
    return order
  }
  return null
}

export function markOrderAsPaid(id: string, paymentResult: Order["paymentResult"]): Order | null {
  const order = orders.find((o) => o.id === id)
  if (order) {
    order.isPaid = true
    order.paidAt = new Date()
    order.status = "processing"
    order.paymentResult = paymentResult
    return order
  }
  return null
}

export function refundOrder(id: string, refundAmountINR: number, reason = "Customer requested refund"): Order | null {
  const order = orders.find((o) => o.id === id)
  if (order && order.isPaid) {
    order.isRefunded = true
    order.refundAmountINR = refundAmountINR
    order.refundReason = reason
    order.refundedAt = new Date()
    order.status = "cancelled"
    return order
  }
  return null
}

// Get order stats for admin dashboard
export function getOrderStats() {
  const totalOrders = orders.length
  const totalRevenue = orders.filter((o) => o.isPaid && !o.isRefunded).reduce((sum, o) => sum + o.totalPriceINR, 0)

  const statusCounts = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    totalOrders,
    totalRevenue,
    statusCounts,
  }
}

export function getAdminStats(): AdminStats {
  const totalOrders = orders.length
  const totalRevenue = orders.filter((o) => o.isPaid && !o.isRefunded).reduce((sum, o) => sum + o.totalPriceINR, 0)

  const returnsAmount = orders.filter((o) => o.isRefunded).reduce((sum, o) => sum + (o.refundAmountINR || 0), 0)

  const statusCounts = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    },
    { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 } as Record<string, number>,
  )

  // Sales by day for last 30 days
  const salesByDay: SalesByDay[] = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]

    const dayOrders = orders.filter((o) => {
      const orderDate = new Date(o.createdAt).toISOString().split("T")[0]
      return orderDate === dateStr
    })

    const totalSales = dayOrders.filter((o) => o.isPaid && !o.isRefunded).reduce((sum, o) => sum + o.totalPriceINR, 0)

    const returns = dayOrders.filter((o) => o.isRefunded).reduce((sum, o) => sum + (o.refundAmountINR || 0), 0)

    salesByDay.push({
      date: dateStr,
      totalSalesINR: totalSales,
      returnsINR: returns,
      orderCount: dayOrders.length,
    })
  }

  return {
    totalRevenueINR: totalRevenue,
    totalProducts: 0, // Will be filled by caller
    totalOrders,
    totalUsers: 0, // Will be filled by caller
    returnsAmountINR: returnsAmount,
    ordersByStatus: statusCounts as AdminStats["ordersByStatus"],
    salesByDay,
  }
}
