import { NextResponse, type NextRequest } from "next/server"
import { getFilteredProducts } from "@/lib/products"

/**
 * Public Products API Route
 * 
 * Supports filtering, sorting, and pagination
 * Query parameters:
 * - search: text search query
 * - category: filter by category
 * - brand: filter by brand
 * - minPrice: minimum price in INR
 * - maxPrice: maximum price in INR
 * - sort: price_asc | price_desc | newest | name_asc | name_desc
 * - page: page number (default: 1)
 * - limit: items per page (default: 12)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "12", 10)
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const brand = searchParams.get("brand") || ""
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined
    const sortParam = searchParams.get("sort") || "newest"

    // Map sort parameter
    let sort = sortParam
    if (sortParam === "price_asc") {
      sort = "price-asc"
    } else if (sortParam === "price_desc") {
      sort = "price-desc"
    } else if (sortParam === "name_asc") {
      sort = "name-asc"
    } else if (sortParam === "name_desc") {
      sort = "name-desc"
    }

    const result = getFilteredProducts({
      page,
      limit,
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      sort,
    })

    return NextResponse.json({
      success: true,
      data: {
        products: result.products,
        page: result.currentPage,
        pages: result.totalPages,
        total: result.totalProducts,
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

