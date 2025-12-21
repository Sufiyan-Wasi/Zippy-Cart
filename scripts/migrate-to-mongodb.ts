/**
 * Migration script to move data from in-memory stores to MongoDB
 * Run: npx tsx scripts/migrate-to-mongodb.ts
 */

import { config } from "dotenv"
import { resolve } from "path"

// Load environment variables
config({ path: resolve(__dirname, "../.env.local") })
config({ path: resolve(__dirname, "../.env") })

import { getDb } from "../lib/db"
import { initializeAdmin } from "../lib/models/User"
import { PRODUCTS } from "../lib/products"
import { getOrders } from "../lib/orders"
import { getUsers } from "../lib/auth"
import type { Product, Order, User } from "../lib/types"

async function migrate() {
  try {
    console.log("Starting migration to MongoDB...")
    console.log(`MongoDB URI: ${process.env.MONGODB_URI ? "Configured" : "Not configured"}`)
    console.log(`Database: ${process.env.MONGODB_DB_NAME || "zippycart01"}\n`)

    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI not found in environment variables")
      console.error("   Please set MONGODB_URI in .env.local file")
      process.exit(1)
    }

    const db = await getDb()

    // Initialize admin user
    await initializeAdmin()
    console.log("✓ Admin user checked/created")

    // Migrate users
    const existingUsers = getUsers()
    if (existingUsers.length > 0) {
      const usersCollection = db.collection<User>("users")
      const existingDbUsers = await usersCollection.find({}).toArray()
      const existingEmails = new Set(existingDbUsers.map((u) => u.email.toLowerCase()))

      for (const user of existingUsers) {
        if (!existingEmails.has(user.email.toLowerCase())) {
          // Get full user with password hash
          const { getUserByEmail } = await import("../lib/auth")
          const fullUser = getUserByEmail(user.email)
          if (fullUser) {
            await usersCollection.insertOne(fullUser)
            console.log(`✓ Migrated user: ${user.email}`)
          }
        }
      }
    }

    // Migrate products
    const productsCollection = db.collection<Product>("products")
    const existingProducts = await productsCollection.find({}).toArray()
    const existingProductIds = new Set(existingProducts.map((p) => p.id))

    let productsMigrated = 0
    for (const product of PRODUCTS) {
      if (!existingProductIds.has(product.id)) {
        await productsCollection.insertOne(product)
        productsMigrated++
      }
    }
    console.log(`✓ Migrated ${productsMigrated} products`)

    // Migrate orders
    const orders = getOrders()
    if (orders.length > 0) {
      const ordersCollection = db.collection<Order>("orders")
      const existingOrders = await ordersCollection.find({}).toArray()
      const existingOrderIds = new Set(existingOrders.map((o) => o.id))

      let ordersMigrated = 0
      for (const order of orders) {
        if (!existingOrderIds.has(order.id)) {
          await ordersCollection.insertOne(order)
          ordersMigrated++
        }
      }
      console.log(`✓ Migrated ${ordersMigrated} orders`)
    }

    console.log("\n✅ Migration completed successfully!")
    console.log("\nYou can now view your data in MongoDB Compass:")
    console.log(`Database: ${process.env.MONGODB_DB_NAME || "zippycart01"}`)
    console.log("Collections: users, products, orders")
    console.log("\nConnection String: mongodb://localhost:27017/zippycart01")
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

migrate()

