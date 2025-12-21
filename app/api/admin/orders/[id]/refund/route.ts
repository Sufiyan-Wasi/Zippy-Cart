import { NextResponse, type NextRequest } from "next/server"
import { getSession } from "@/lib/auth"

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    const params = await props.params

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { refundAmountINR, reason } = body

    if (!refundAmountINR || refundAmountINR <= 0) {
      return NextResponse.json({ error: "Invalid refund amount" }, { status: 400 })
    }

    const USE_MONGODB = !!process.env.MONGODB_URI
    let order = null

    if (USE_MONGODB) {
      try {
        const { refundOrder } = await import("../../../lib/models/Order")
        order = await refundOrder(params.id, refundAmountINR, reason)
      } catch (error) {
        console.warn("MongoDB error, falling back to in-memory:", error)
        const { refundOrder } = await import("../../../lib/orders")
        order = refundOrder(params.id, refundAmountINR, reason)
      }
    } else {
      const { refundOrder } = await import("../../../lib/orders")
      order = refundOrder(params.id, refundAmountINR, reason)
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found or cannot be refunded" }, { status: 404 })
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("Error processing refund:", error)
    return NextResponse.json({ error: "Failed to process refund" }, { status: 500 })
  }
}
