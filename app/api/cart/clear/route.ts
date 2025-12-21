import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function POST() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In production, this would clear the server-side cart for the user
    // For now, we just return success since cart is stored client-side in localStorage
    // The frontend will handle clearing localStorage

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 })
  }
}

