import { getDb, isMongoDBConfigured } from "../db"
import type { Product } from "../types"

const COLLECTION_NAME = "products"

export async function getProducts(): Promise<Product[]> {
  if (!isMongoDBConfigured()) {
    return []
  }
  const db = await getDb()
  return await db.collection<Product>(COLLECTION_NAME).find({}).toArray()
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isMongoDBConfigured()) {
    return null
  }
  const db = await getDb()
  return await db.collection<Product>(COLLECTION_NAME).findOne({ id })
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isMongoDBConfigured()) {
    return null
  }
  const db = await getDb()
  return await db.collection<Product>(COLLECTION_NAME).findOne({ slug })
}

export async function getFilteredProducts(options: {
  page?: number
  limit?: number
  search?: string
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
}): Promise<{
  products: Product[]
  totalProducts: number
  totalPages: number
  currentPage: number
}> {
  if (!isMongoDBConfigured()) {
    return {
      products: [],
      totalProducts: 0,
      totalPages: 0,
      currentPage: options.page || 1,
    }
  }
  const db = await getDb()
  const {
    page = 1,
    limit = 12,
    search = "",
    category = "",
    brand = "",
    minPrice = 0,
    maxPrice = Number.POSITIVE_INFINITY,
    sort = "newest",
  } = options

  const query: any = {}

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ]
  }

  if (category) {
    query.category = category
  }

  if (brand) {
    query.brand = brand
  }

  query.priceINR = { $gte: minPrice, $lte: maxPrice }

  // Sort
  let sortOption: any = {}
  switch (sort) {
    case "price-asc":
      sortOption = { priceINR: 1 }
      break
    case "price-desc":
      sortOption = { priceINR: -1 }
      break
    case "name-asc":
      sortOption = { title: 1 }
      break
    case "name-desc":
      sortOption = { title: -1 }
      break
    case "newest":
    default:
      sortOption = { createdAt: -1 }
  }

  const totalProducts = await db.collection<Product>(COLLECTION_NAME).countDocuments(query)
  const totalPages = Math.ceil(totalProducts / limit)

  const products = await db
    .collection<Product>(COLLECTION_NAME)
    .find(query)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray()

  return {
    products,
    totalProducts,
    totalPages,
    currentPage: page,
  }
}

export async function createProduct(product: Omit<Product, "id" | "createdAt">): Promise<Product> {
  if (!isMongoDBConfigured()) {
    throw new Error("MongoDB not configured")
  }
  const db = await getDb()
  const newProduct: Product = {
    ...product,
    id: `product-${Date.now()}`,
    createdAt: new Date(),
  }
  await db.collection<Product>(COLLECTION_NAME).insertOne(newProduct)
  return newProduct
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  if (!isMongoDBConfigured()) {
    return null
  }
  const db = await getDb()
  const result = await db.collection<Product>(COLLECTION_NAME).findOneAndUpdate(
    { id },
    { $set: updates },
    { returnDocument: "after" }
  )
  return result || null
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (!isMongoDBConfigured()) {
    return false
  }
  const db = await getDb()
  const result = await db.collection<Product>(COLLECTION_NAME).deleteOne({ id })
  return result.deletedCount > 0
}

export async function getProductCount(): Promise<number> {
  if (!isMongoDBConfigured()) {
    return 0
  }
  const db = await getDb()
  return await db.collection<Product>(COLLECTION_NAME).countDocuments()
}

