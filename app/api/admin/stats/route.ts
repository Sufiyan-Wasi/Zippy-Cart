import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getUsers } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const USE_MONGODB = !!process.env.MONGODB_URI
    let stats: any = null

    if (USE_MONGODB) {
      try {
        const { getAdminStats } = await import("@/lib/models/Order")
        const { getProductCount } = await import("@/lib/models/Product")
        stats = await getAdminStats()
        stats.totalProducts = await getProductCount()
        const users = await getUsers()
        stats.totalUsers = users.length
      } catch (error) {
        console.warn("MongoDB error, falling back to in-memory:", error)
        const { getAdminStats } = await import("@/lib/orders")
        const { PRODUCTS } = await import("@/lib/products")
        stats = getAdminStats()
        stats.totalProducts = PRODUCTS.length
        const users = await getUsers()
        stats.totalUsers = users.length
      }
    } else {
      const { getAdminStats } = await import("@/lib/orders")
      const { PRODUCTS } = await import("@/lib/products")
      stats = getAdminStats()
    stats.totalProducts = PRODUCTS.length
      const users = await getUsers()
      stats.totalUsers = users.length
    }

    // Ensure all required fields exist with defaults
    const safeStats = {
      totalRevenueINR: stats?.totalRevenueINR || 0,
      totalProducts: stats?.totalProducts || 0,
      totalOrders: stats?.totalOrders || 0,
      totalUsers: stats?.totalUsers || 0,
      returnsAmountINR: stats?.returnsAmountINR || 0,
      ordersByStatus: stats?.ordersByStatus || {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      },
      salesByDay: stats?.salesByDay || [],
    }

    return NextResponse.json(safeStats)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
