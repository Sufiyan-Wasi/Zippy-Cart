import { NextResponse, type NextRequest } from "next/server"
import { getSession } from "@/lib/auth"
import type { Product } from "@/lib/types"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const USE_MONGODB = !!process.env.MONGODB_URI
    let product: Product | null = null

    if (USE_MONGODB) {
      try {
        const { getProductById } = await import("../../../lib/models/Product")
        product = await getProductById(id)
      } catch (error) {
        console.warn("MongoDB error, falling back to in-memory:", error)
        const { getProductById } = await import("../../../lib/products")
        product = getProductById(id) || null
      }
    } else {
      const { getProductById } = await import("../../../lib/products")
      product = getProductById(id) || null
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()

    const USE_MONGODB = !!process.env.MONGODB_URI
    let product: Product | null = null

    if (USE_MONGODB) {
      try {
        const { updateProduct } = await import("../../../lib/models/Product")
        const updates: Partial<Product> = {}
        
        if (body.title !== undefined) {
          updates.title = body.title
          updates.slug = body.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
        }
        if (body.description !== undefined) updates.description = body.description
        if (body.category !== undefined) updates.category = body.category
        if (body.brand !== undefined) updates.brand = body.brand
        if (body.priceINR !== undefined) updates.priceINR = parseFloat(body.priceINR)
        if (body.stock !== undefined) updates.stock = parseInt(body.stock)
        if (body.images !== undefined) {
          updates.images = Array.isArray(body.images) ? body.images : [body.images]
        }

        product = await updateProduct(id, updates)
      } catch (error) {
        console.warn("MongoDB error, falling back to in-memory:", error)
        const { PRODUCTS } = await import("../../../lib/products")
        const productIndex = PRODUCTS.findIndex((p) => p.id === id)
        if (productIndex === -1) {
          return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }
        const existingProduct = PRODUCTS[productIndex]
        if (body.title !== undefined) {
          existingProduct.title = body.title
          existingProduct.slug = body.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
        }
        if (body.description !== undefined) existingProduct.description = body.description
        if (body.category !== undefined) existingProduct.category = body.category
        if (body.brand !== undefined) existingProduct.brand = body.brand
        if (body.priceINR !== undefined) existingProduct.priceINR = parseFloat(body.priceINR)
        if (body.stock !== undefined) existingProduct.stock = parseInt(body.stock)
        if (body.images !== undefined) {
          existingProduct.images = Array.isArray(body.images) ? body.images : [body.images]
        }
        product = existingProduct
      }
    } else {
      const { PRODUCTS } = await import("../../../lib/products")
      const productIndex = PRODUCTS.findIndex((p) => p.id === id)
      if (productIndex === -1) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }
      const existingProduct = PRODUCTS[productIndex]
      if (body.title !== undefined) {
        existingProduct.title = body.title
        existingProduct.slug = body.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      }
      if (body.description !== undefined) existingProduct.description = body.description
      if (body.category !== undefined) existingProduct.category = body.category
      if (body.brand !== undefined) existingProduct.brand = body.brand
      if (body.priceINR !== undefined) existingProduct.priceINR = parseFloat(body.priceINR)
      if (body.stock !== undefined) existingProduct.stock = parseInt(body.stock)
      if (body.images !== undefined) {
        existingProduct.images = Array.isArray(body.images) ? body.images : [body.images]
      }
      product = existingProduct
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params

    const USE_MONGODB = !!process.env.MONGODB_URI
    let success = false

    if (USE_MONGODB) {
      try {
        const { deleteProduct } = await import("../../../lib/models/Product")
        success = await deleteProduct(id)
      } catch (error) {
        console.warn("MongoDB error, falling back to in-memory:", error)
        const { PRODUCTS } = await import("../../../lib/products")
        const productIndex = PRODUCTS.findIndex((p) => p.id === id)
        if (productIndex !== -1) {
          PRODUCTS.splice(productIndex, 1)
          success = true
        }
      }
    } else {
      const { PRODUCTS } = await import("../../../lib/products")
      const productIndex = PRODUCTS.findIndex((p) => p.id === id)
      if (productIndex !== -1) {
        PRODUCTS.splice(productIndex, 1)
        success = true
      }
    }

    if (!success) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}

