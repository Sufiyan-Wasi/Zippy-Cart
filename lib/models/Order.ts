import { getDb, isMongoDBConfigured } from "../db"
import type { Order, OrderItem, ShippingAddress, SalesByDay, AdminStats } from "../types"

const COLLECTION_NAME = "orders"

export async function getOrders(): Promise<Order[]> {
  if (!isMongoDBConfigured()) {
    return []
  }
  const db = await getDb()
  return await db
    .collection<Order>(COLLECTION_NAME)
    .find({})
    .sort({ createdAt: -1 })
    .toArray()
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (!isMongoDBConfigured()) {
    return null
  }
  const db = await getDb()
  return await db.collection<Order>(COLLECTION_NAME).findOne({ id })
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  if (!isMongoDBConfigured()) {
    return []
  }
  const db = await getDb()
  return await db
    .collection<Order>(COLLECTION_NAME)
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray()
}

export async function createOrder(data: {
  userId: string
  userEmail: string
  orderItems: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  totalPriceINR: number
}): Promise<Order> {
  if (!isMongoDBConfigured()) {
    throw new Error("MongoDB not configured")
  }
  const db = await getDb()
  const order: Order = {
    id: `order-${Date.now()}`,
    ...data,
    isPaid: false,
    status: "pending",
    createdAt: new Date(),
  }
  await db.collection<Order>(COLLECTION_NAME).insertOne(order)
  return order
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order | null> {
  if (!isMongoDBConfigured()) {
    return null
  }
  const db = await getDb()
  const result = await db
    .collection<Order>(COLLECTION_NAME)
    .findOneAndUpdate({ id }, { $set: { status } }, { returnDocument: "after" })
  return result || null
}

export async function markOrderAsPaid(id: string, paymentResult: Order["paymentResult"]): Promise<Order | null> {
  if (!isMongoDBConfigured()) {
    return null
  }
  const db = await getDb()
  const result = await db
    .collection<Order>(COLLECTION_NAME)
    .findOneAndUpdate(
      { id },
      {
        $set: {
          isPaid: true,
          paidAt: new Date(),
          status: "processing",
          paymentResult,
        },
      },
      { returnDocument: "after" }
    )
  return result || null
}

export async function refundOrder(
  id: string,
  refundAmountINR: number,
  reason = "Customer requested refund"
): Promise<Order | null> {
  if (!isMongoDBConfigured()) {
    return null
  }
  const db = await getDb()
  const result = await db
    .collection<Order>(COLLECTION_NAME)
    .findOneAndUpdate(
      { id, isPaid: true },
      {
        $set: {
          isRefunded: true,
          refundAmountINR,
          refundReason: reason,
          refundedAt: new Date(),
          status: "cancelled",
        },
      },
      { returnDocument: "after" }
    )
  return result || null
}

export async function getAdminStats(): Promise<AdminStats> {
  if (!isMongoDBConfigured()) {
    // Return empty stats structure if MongoDB not configured
    return {
      totalRevenueINR: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      returnsAmountINR: 0,
      ordersByStatus: {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      },
      salesByDay: [],
    }
  }
  
  try {
    const db = await getDb()

  const totalOrders = await db.collection<Order>(COLLECTION_NAME).countDocuments()
  
  const paidOrders = await db
    .collection<Order>(COLLECTION_NAME)
    .find({ isPaid: true, isRefunded: { $ne: true } })
    .toArray()
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalPriceINR, 0)

  const refundedOrders = await db
    .collection<Order>(COLLECTION_NAME)
    .find({ isRefunded: true })
    .toArray()
  const returnsAmount = refundedOrders.reduce((sum, o) => sum + (o.refundAmountINR || 0), 0)

  // Orders by status
  const statusCounts = await db
    .collection<Order>(COLLECTION_NAME)
    .aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])
    .toArray()

  const ordersByStatus = {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  }

  statusCounts.forEach((item) => {
    if (item._id in ordersByStatus) {
      ordersByStatus[item._id as keyof typeof ordersByStatus] = item.count
    }
  })

  // Sales by day for last 30 days
  const today = new Date()
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const salesByDay: SalesByDay[] = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)

    const dayOrders = await db
      .collection<Order>(COLLECTION_NAME)
      .find({
        createdAt: {
          $gte: date,
          $lt: nextDate,
        },
      })
      .toArray()

    const totalSales = dayOrders
      .filter((o) => o.isPaid && !o.isRefunded)
      .reduce((sum, o) => sum + o.totalPriceINR, 0)

    const returns = dayOrders
      .filter((o) => o.isRefunded)
      .reduce((sum, o) => sum + (o.refundAmountINR || 0), 0)

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
    ordersByStatus,
    salesByDay,
  }
  } catch (error) {
    console.error("Error fetching admin stats from MongoDB:", error)
    // Return empty stats on error
    return {
      totalRevenueINR: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      returnsAmountINR: 0,
      ordersByStatus: {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      },
      salesByDay: [],
    }
  }
}

export async function getUserOrderCount(userId: string): Promise<number> {
  if (!isMongoDBConfigured()) {
    return 0
  }
  const db = await getDb()
  return await db.collection<Order>(COLLECTION_NAME).countDocuments({ userId })
}

export async function getUserLastOrderAmount(userId: string): Promise<number | null> {
  if (!isMongoDBConfigured()) {
    return null
  }
  const db = await getDb()
  const lastOrder = await db
    .collection<Order>(COLLECTION_NAME)
    .findOne({ userId }, { sort: { createdAt: -1 } })
  return lastOrder?.totalPriceINR || null
}

