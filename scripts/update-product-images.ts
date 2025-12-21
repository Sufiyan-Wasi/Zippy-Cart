/**
 * Script to update product images using Google Custom Search API
 * Run: npx tsx scripts/update-product-images.ts
 */

import { getDb } from "../lib/db"
import { updateProductImages } from "../lib/google-images"
import type { Product } from "../lib/types"

async function updateImages() {
  try {
    console.log("Updating product images using Google Custom Search API...")

    if (!process.env.GOOGLE_API_KEY || !process.env.GOOGLE_SEARCH_ENGINE_ID) {
      console.warn("⚠️  Google API keys not configured in .env")
      console.warn("   Set GOOGLE_API_KEY and GOOGLE_SEARCH_ENGINE_ID")
      console.warn("   Falling back to Unsplash images...")
    }

    const db = await getDb()
    const productsCollection = db.collection<Product>("products")
    const products = await productsCollection.find({}).toArray()

    console.log(`Found ${products.length} products to update`)

    const imageMap = await updateProductImages(
      products.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
      }))
    )

    let updated = 0
    for (const [productId, images] of imageMap.entries()) {
      await productsCollection.updateOne({ id: productId }, { $set: { images } })
      updated++
      console.log(`✓ Updated images for product: ${productId}`)
    }

    console.log(`\n✅ Updated images for ${updated} products!`)
  } catch (error) {
    console.error("Failed to update images:", error)
    process.exit(1)
  }
}

updateImages()

