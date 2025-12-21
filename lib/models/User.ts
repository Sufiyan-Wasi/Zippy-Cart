import { getDb, isMongoDBConfigured } from "../db"
import bcrypt from "bcryptjs"
import type { User } from "../types"

const COLLECTION_NAME = "users"

export async function getUserByEmail(email: string): Promise<User | null> {
  if (!isMongoDBConfigured()) {
    return null
  }
  const db = await getDb()
  const user = await db.collection<User>(COLLECTION_NAME).findOne({ email: email.toLowerCase() })
  return user
}

export async function getUserById(id: string): Promise<User | null> {
  if (!isMongoDBConfigured()) {
    return null
  }
  const db = await getDb()
  const user = await db.collection<User>(COLLECTION_NAME).findOne({ id })
  return user
}

export async function getUsers(): Promise<Omit<User, "passwordHash">[]> {
  if (!isMongoDBConfigured()) {
    return []
  }
  const db = await getDb()
  const users = await db
    .collection<User>(COLLECTION_NAME)
    .find({})
    .project({ passwordHash: 0 })
    .toArray()
  return users as Omit<User, "passwordHash">[]
}

export async function createUser(name: string, email: string, password: string): Promise<Omit<User, "passwordHash">> {
  if (!isMongoDBConfigured()) {
    throw new Error("MongoDB not configured")
  }
  const db = await getDb()
  
  // Check if user already exists
  const existing = await getUserByEmail(email)
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

  await db.collection<User>(COLLECTION_NAME).insertOne(newUser)
  const { passwordHash, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

export async function updateUserRole(userId: string, role: "user" | "admin"): Promise<boolean> {
  if (!isMongoDBConfigured()) {
    return false
  }
  const db = await getDb()
  const result = await db.collection<User>(COLLECTION_NAME).updateOne({ id: userId }, { $set: { role } })
  return result.modifiedCount > 0
}

export async function updateLastLogin(userId: string): Promise<boolean> {
  if (!isMongoDBConfigured()) {
    return false
  }
  const db = await getDb()
  const result = await db
    .collection<User>(COLLECTION_NAME)
    .updateOne({ id: userId }, { $set: { lastLogin: new Date() } })
  return result.modifiedCount > 0
}

export async function deleteUser(userId: string): Promise<boolean> {
  if (!isMongoDBConfigured()) {
    return false
  }
  const db = await getDb()
  const result = await db.collection<User>(COLLECTION_NAME).deleteOne({ id: userId })
  return result.deletedCount > 0
}

// Initialize admin user if it doesn't exist
export async function initializeAdmin(): Promise<void> {
  if (!isMongoDBConfigured()) {
    return
  }
  const db = await getDb()
  const adminEmail = "sufiyanw026@gmail.com"
  const existing = await getUserByEmail(adminEmail)
  
  if (!existing) {
    const adminUser: User = {
      id: "admin-1",
      name: "Admin",
      email: adminEmail,
      passwordHash: bcrypt.hashSync("WasiSufiyan026", 10),
      role: "admin",
      createdAt: new Date(),
      lastLogin: undefined,
    }
    await db.collection<User>(COLLECTION_NAME).insertOne(adminUser)
    console.log("✓ Admin user initialized")
  }
}

