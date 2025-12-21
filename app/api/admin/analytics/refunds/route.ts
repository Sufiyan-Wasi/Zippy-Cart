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
        totalRefunded: 0,
        totalReturns: 0,
        refundTrend: [],
        refundReasons: {},
      })
    }

    const db = await getDb()
    const ordersCollection = db.collection<Order>("orders")

    // Get all refunded orders
    const refundedOrders = await ordersCollection.find({ isRefunded: true }).toArray()

    const totalRefunded = refundedOrders.reduce((sum, o) => sum + (o.refundAmountINR || 0), 0)
    const totalReturns = refundedOrders.length

    // Refund trend (last 30 days)
    const refundTrend = []
    const today = new Date()
    for (let i = 29; i >= 0; i--) {
      const day = new Date(today)
      day.setDate(day.getDate() - i)
      day.setHours(0, 0, 0, 0)

      const nextDay = new Date(day)
      nextDay.setDate(nextDay.getDate() + 1)

      const dayRefunds = refundedOrders.filter((o) => {
        const refundDate = new Date(o.refundedAt || o.createdAt || 0)
        return refundDate >= day && refundDate < nextDay
      })

      const dayTotal = dayRefunds.reduce((sum, o) => sum + (o.refundAmountINR || 0), 0)

      refundTrend.push({
        date: day.toISOString().split("T")[0],
        label: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        amount: dayTotal,
        count: dayRefunds.length,
      })
    }

    // Refund reasons breakdown
    const refundReasons: Record<string, number> = {}
    refundedOrders.forEach((order) => {
      const reason = order.refundReason || "Not specified"
      refundReasons[reason] = (refundReasons[reason] || 0) + 1
    })

    return NextResponse.json({
      totalRefunded,
      totalReturns,
      refundTrend,
      refundReasons,
    })
  } catch (error) {
    console.error("Error fetching refund analytics:", error)
    return NextResponse.json(
      {
        totalRefunded: 0,
        totalReturns: 0,
        refundTrend: [],
        refundReasons: {},
      },
      { status: 500 }
    )
  }
}

