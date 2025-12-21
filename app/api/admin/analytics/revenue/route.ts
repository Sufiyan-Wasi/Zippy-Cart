import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getDb, isMongoDBConfigured } from "@/lib/db"
import type { Order } from "@/lib/types"

export async function GET() {
  try {
    const session = await getSession()

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (!isMongoDBConfigured()) {
      return NextResponse.json({
        totalRevenue: 0,
        monthlyRevenue: [],
        weeklyRevenue: [],
        dailyRevenue: [],
        profit: 0,
      })
    }

    const db = await getDb()
    const ordersCollection = db.collection<Order>("orders")

    // Get all paid, non-refunded orders
    const paidOrders = await ordersCollection
      .find({ isPaid: true, isRefunded: { $ne: true } })
      .toArray()

    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.totalPriceINR || 0), 0)
    const profit = totalRevenue // For now, profit equals revenue (cost calculation can be added later)

    // Monthly revenue (last 12 months)
    const monthlyRevenue = []
    const today = new Date()
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0, 23, 59, 59)

      const monthOrders = paidOrders.filter((o) => {
        const orderDate = new Date(o.createdAt || o.paidAt || 0)
        return orderDate >= monthStart && orderDate <= monthEnd
      })

      const monthTotal = monthOrders.reduce((sum, o) => sum + (o.totalPriceINR || 0), 0)

      monthlyRevenue.push({
        month: monthStart.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        revenue: monthTotal,
        orders: monthOrders.length,
      })
    }

    // Weekly revenue (last 12 weeks)
    const weeklyRevenue = []
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(today)
      weekStart.setDate(weekStart.getDate() - (i + 1) * 7)
      weekStart.setHours(0, 0, 0, 0)

      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)

      const weekOrders = paidOrders.filter((o) => {
        const orderDate = new Date(o.createdAt || o.paidAt || 0)
        return orderDate >= weekStart && orderDate <= weekEnd
      })

      const weekTotal = weekOrders.reduce((sum, o) => sum + (o.totalPriceINR || 0), 0)

      weeklyRevenue.push({
        week: `Week ${12 - i}`,
        date: weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue: weekTotal,
        orders: weekOrders.length,
      })
    }

    // Daily revenue (last 30 days)
    const dailyRevenue = []
    for (let i = 29; i >= 0; i--) {
      const day = new Date(today)
      day.setDate(day.getDate() - i)
      day.setHours(0, 0, 0, 0)

      const nextDay = new Date(day)
      nextDay.setDate(nextDay.getDate() + 1)

      const dayOrders = paidOrders.filter((o) => {
        const orderDate = new Date(o.createdAt || o.paidAt || 0)
        return orderDate >= day && orderDate < nextDay
      })

      const dayTotal = dayOrders.reduce((sum, o) => sum + (o.totalPriceINR || 0), 0)

      dailyRevenue.push({
        date: day.toISOString().split("T")[0],
        label: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue: dayTotal,
        orders: dayOrders.length,
      })
    }

    return NextResponse.json({
      totalRevenue,
      monthlyRevenue,
      weeklyRevenue,
      dailyRevenue,
      profit,
    })
  } catch (error) {
    console.error("Error fetching revenue analytics:", error)
    return NextResponse.json(
      {
        totalRevenue: 0,
        monthlyRevenue: [],
        weeklyRevenue: [],
        dailyRevenue: [],
        profit: 0,
      },
      { status: 500 }
    )
  }
}

