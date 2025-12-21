import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getDb, isMongoDBConfigured } from "@/lib/db"
import type { User } from "@/lib/types"

export async function GET() {
  try {
    const session = await getSession()

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (!isMongoDBConfigured()) {
      return NextResponse.json({
        totalUsers: 0,
        newUsersByMonth: [],
        users: [],
      })
    }

    const db = await getDb()
    const usersCollection = db.collection<User>("users")

    const allUsers = await usersCollection
      .find({})
      .project({ passwordHash: 0 })
      .sort({ createdAt: -1 })
      .toArray()

    const totalUsers = allUsers.length

    // New users by month (last 12 months)
    const newUsersByMonth = []
    const today = new Date()
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0, 23, 59, 59)

      const monthUsers = allUsers.filter((u) => {
        const userDate = new Date(u.createdAt || 0)
        return userDate >= monthStart && userDate <= monthEnd
      })

      newUsersByMonth.push({
        month: monthStart.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        count: monthUsers.length,
      })
    }

    // Format users for table
    const users = allUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    }))

    return NextResponse.json({
      totalUsers,
      newUsersByMonth,
      users,
    })
  } catch (error) {
    console.error("Error fetching user analytics:", error)
    return NextResponse.json(
      {
        totalUsers: 0,
        newUsersByMonth: [],
        users: [],
      },
      { status: 500 }
    )
  }
}

