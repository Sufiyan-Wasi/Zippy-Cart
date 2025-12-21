import { NextResponse, type NextRequest } from "next/server"
import { getSession } from "@/lib/auth"
import type { Product } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const brand = searchParams.get("brand") || ""

    const USE_MONGODB = !!process.env.MONGODB_URI
    let result

    if (USE_MONGODB) {
      try {
        const productModule = await import("../../lib/models/Product")
        const { getFilteredProducts } = productModule
        result = await getFilteredProducts({
          page,
          limit,
          search,
          category,
          brand,
        })
      } catch (error) {
        console.warn("MongoDB error, falling back to in-memory:", error)
        const productModule = await import("../../lib/products")
        const { getFilteredProducts } = productModule
        result = getFilteredProducts({
          page,
          limit,
          search,
          category,
          brand,
        })
      }
    } else {
      const productModule = await import("../../lib/products")
      const { getFilteredProducts } = productModule
      result = getFilteredProducts({
        page,
        limit,
        search,
        category,
        brand,
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, category, brand, priceINR, stock, images } = body

    if (!title || !category || !brand || priceINR === undefined || stock === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const USE_MONGODB = !!process.env.MONGODB_URI
    let newProduct: Product

    if (USE_MONGODB) {
      try {
        const productModule = await import("../../lib/models/Product")
        const { createProduct, getProductBySlug } = productModule
        // Check if slug already exists
        const existing = await getProductBySlug(slug)
        if (existing) {
          return NextResponse.json({ error: "Product with this title already exists" }, { status: 400 })
        }

        newProduct = await createProduct({
          title,
          slug,
          description: description || "",
          category,
          brand,
          priceINR: parseFloat(priceINR),
          currency: "INR",
          stock: parseInt(stock),
          images: Array.isArray(images) ? images : images ? [images] : [`https://picsum.photos/seed/${slug}/600/400`],
        })
      } catch (error) {
        console.warn("MongoDB error, falling back to in-memory:", error)
        const productModule = await import("../../lib/products")
        const { PRODUCTS } = productModule
        // Check if slug already exists
        if (PRODUCTS.find((p: Product) => p.slug === slug)) {
          return NextResponse.json({ error: "Product with this title already exists" }, { status: 400 })
        }

        newProduct = {
          id: `product-${Date.now()}`,
          title,
          slug,
          description: description || "",
          category,
          brand,
          priceINR: parseFloat(priceINR),
          currency: "INR",
          stock: parseInt(stock),
          images: Array.isArray(images) ? images : images ? [images] : [`https://picsum.photos/seed/${slug}/600/400`],
          createdAt: new Date(),
        }
        PRODUCTS.push(newProduct)
      }
    } else {
      const productModule = await import("../../lib/products")
      const { PRODUCTS } = productModule
      // Check if slug already exists
      if (PRODUCTS.find((p: Product) => p.slug === slug)) {
        return NextResponse.json({ error: "Product with this title already exists" }, { status: 400 })
      }

      newProduct = {
        id: `product-${Date.now()}`,
        title,
        slug,
        description: description || "",
        category,
        brand,
        priceINR: parseFloat(priceINR),
        currency: "INR",
        stock: parseInt(stock),
        images: Array.isArray(images) ? images : images ? [images] : [`https://picsum.photos/seed/${slug}/600/400`],
        createdAt: new Date(),
      }
      PRODUCTS.push(newProduct)
    }

    return NextResponse.json({ product: newProduct }, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

