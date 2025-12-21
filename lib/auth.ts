import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import type { User, SessionUser } from "./types"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret-change-in-production")

// Check if MongoDB is available
const USE_MONGODB = !!process.env.MONGODB_URI

// In-memory user store (fallback if MongoDB not available)
const users: User[] = [
  {
    id: "admin-1",
    name: "Admin",
    email: "sufiyanw026@gmail.com",
    passwordHash: bcrypt.hashSync("WasiSufiyan026", 10),
    role: "admin",
    createdAt: new Date(),
    lastLogin: undefined,
  },
]

// User management functions - use MongoDB if available, otherwise in-memory
export async function getUsers(): Promise<Omit<User, "passwordHash">[]> {
  if (USE_MONGODB) {
    try {
      const { getUsers: getUsersFromDB } = await import("./models/User")
      return await getUsersFromDB()
    } catch (error) {
      console.warn("MongoDB error, falling back to in-memory:", error)
    }
  }
  return users.map(({ passwordHash, ...user }) => user)
}

export async function getUserByEmail(email: string): Promise<User | undefined | null> {
  if (USE_MONGODB) {
    try {
      const { getUserByEmail: getUserByEmailFromDB } = await import("./models/User")
      return await getUserByEmailFromDB(email)
    } catch (error) {
      console.warn("MongoDB error, falling back to in-memory:", error)
    }
  }
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export async function getUserById(id: string): Promise<User | undefined | null> {
  if (USE_MONGODB) {
    try {
      const { getUserById: getUserByIdFromDB } = await import("./models/User")
      return await getUserByIdFromDB(id)
    } catch (error) {
      console.warn("MongoDB error, falling back to in-memory:", error)
    }
  }
  return users.find((u) => u.id === id)
}

export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<Omit<User, "passwordHash">> {
  if (USE_MONGODB) {
    try {
      const { createUser: createUserInDB } = await import("./models/User")
      return await createUserInDB(name, email, password)
    } catch (error) {
      console.warn("MongoDB error, falling back to in-memory:", error)
    }
  }

  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (existing) {
    throw new Error("User already exists")
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    passwordHash: bcrypt.hashSync(password, 10),
    role: "user",
    createdAt: new Date(),
    lastLogin: undefined,
  }

  users.push(newUser)
  const { passwordHash, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

export function verifyPassword(user: User, password: string): boolean {
  return bcrypt.compareSync(password, user.passwordHash)
}

export async function updateUserRole(userId: string, role: "user" | "admin"): Promise<boolean> {
  if (USE_MONGODB) {
    try {
      const { updateUserRole: updateUserRoleInDB } = await import("./models/User")
      return await updateUserRoleInDB(userId, role)
    } catch (error) {
      console.warn("MongoDB error, falling back to in-memory:", error)
    }
  }

  const user = users.find((u) => u.id === userId)
  if (user) {
    user.role = role
    return true
  }
  return false
}

export async function deleteUser(userId: string): Promise<boolean> {
  if (USE_MONGODB) {
    try {
      const { deleteUser: deleteUserFromDB } = await import("./models/User")
      return await deleteUserFromDB(userId)
    } catch (error) {
      console.warn("MongoDB error, falling back to in-memory:", error)
    }
  }

  const userIndex = users.findIndex((u) => u.id === userId)
  if (userIndex !== -1) {
    users.splice(userIndex, 1)
    return true
  }
  return false
}

// Update last login timestamp
export async function updateLastLogin(userId: string): Promise<boolean> {
  if (USE_MONGODB) {
    try {
      const { updateLastLogin: updateLastLoginInDB } = await import("./models/User")
      return await updateLastLoginInDB(userId)
    } catch (error) {
      console.warn("MongoDB error, falling back to in-memory:", error)
    }
  }

  const user = users.find((u) => u.id === userId)
  if (user) {
    user.lastLogin = new Date()
    return true
  }
  return false
}

// JWT token functions
export async function createToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as SessionUser
  } catch {
    return null
  }
}

// Session functions
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) return null

  return verifyToken(token)
}

export async function setSession(user: SessionUser): Promise<string> {
  const token = await createToken(user)
  const cookieStore = await cookies()

  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  return token
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}
