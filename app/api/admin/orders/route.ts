import { NextResponse, type NextRequest } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "100")
    const status = searchParams.get("status")
    const paymentMethod = searchParams.get("paymentMethod")

    const USE_MONGODB = !!process.env.MONGODB_URI
    let orders: any[] = []

    if (USE_MONGODB) {
      try {
        const { getOrders } = await import("../lib/models/Order")
        orders = await getOrders()
      } catch (error) {
        console.warn("MongoDB error, falling back to in-memory:", error)
        const { getOrders } = await import("../lib/orders")
        orders = getOrders()
      }
    } else {
      const { getOrders } = await import("../lib/orders")
      orders = getOrders()
    }

    // Filter by status
    if (status) {
      orders = orders.filter((o) => o.status === status)
    }

    // Filter by payment method
    if (paymentMethod) {
      orders = orders.filter((o) => o.paymentMethod === paymentMethod)
    }

    // Limit results
    const limitedOrders = orders.slice(0, limit)

    return NextResponse.json({
      orders: limitedOrders,
      total: orders.length,
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

