import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail, verifyPassword, setSession, updateLastLogin } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await getUserByEmail(email)
    if (!user || !verifyPassword(user, password)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Update last login timestamp
    await updateLastLogin(user.id)

    await setSession({ id: user.id, name: user.name, email: user.email, role: user.role })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
