import { NextResponse } from "next/server"
import { getSession, getUsers } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const users = await getUsers()

    // Enhance users with order statistics
    const USE_MONGODB = !!process.env.MONGODB_URI
    let usersWithStats = users

    if (USE_MONGODB) {
      try {
        const { getUserOrderCount, getUserLastOrderAmount } = await import("../lib/models/Order")
        usersWithStats = await Promise.all(
          users.map(async (user) => {
            const totalOrders = await getUserOrderCount(user.id)
            const lastOrderAmount = await getUserLastOrderAmount(user.id)

            return {
              ...user,
              totalOrders,
              lastOrderAmount: lastOrderAmount || 0,
            }
          })
        )
      } catch (error) {
        console.warn("Error fetching order stats:", error)
      }
    } else {
      // Fallback to in-memory
      const { getUserOrderCount, getUserLastOrderAmount } = await import("../lib/orders")
      usersWithStats = users.map((user) => {
        const totalOrders = getUserOrderCount(user.id)
        const lastOrderAmount = getUserLastOrderAmount(user.id)

        return {
          ...user,
          totalOrders,
          lastOrderAmount: lastOrderAmount || 0,
        }
      })
    }

    return NextResponse.json({ users: usersWithStats })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

