import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { status } = await request.json()

  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

    const USE_MONGODB = !!process.env.MONGODB_URI
    let order = null

    if (USE_MONGODB) {
      try {
        const { updateOrderStatus } = await import("../../../lib/models/Order")
        order = await updateOrderStatus(id, status)
      } catch (error) {
        console.warn("MongoDB error, falling back to in-memory:", error)
        const { updateOrderStatus } = await import("../../../lib/orders")
        order = updateOrderStatus(id, status)
      }
    } else {
      const { updateOrderStatus } = await import("../../../lib/orders")
      order = updateOrderStatus(id, status)
    }

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  return NextResponse.json({ order })
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }
}
