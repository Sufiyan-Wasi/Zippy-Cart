import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { getFilteredProducts } from "@/lib/products"

interface ProductGridProps {
  page: number
  search: string
  category: string
  brand: string
  minPrice?: number
  maxPrice?: number
  sort: string
}

export function ProductGrid({ page, search, category, brand, minPrice, maxPrice, sort }: ProductGridProps) {
  const { products, totalProducts, totalPages, currentPage } = getFilteredProducts({
    page,
    limit: 12,
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    sort,
  })

  // Build URL params for pagination
  const buildPageUrl = (pageNum: number) => {
    const params = new URLSearchParams()
    params.set("page", pageNum.toString())
    if (search) params.set("search", search)
    if (category) params.set("category", category)
    if (brand) params.set("brand", brand)
    if (minPrice) params.set("minPrice", minPrice.toString())
    if (maxPrice) params.set("maxPrice", maxPrice.toString())
    if (sort && sort !== "newest") params.set("sort", sort)
    return `/products?${params.toString()}`
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-xl font-medium">No products found</p>
        <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
        <Link href="/products">
          <Button variant="outline" className="mt-4 bg-transparent">
            Clear Filters
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Results count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * 12 + 1}-{Math.min(currentPage * 12, totalProducts)} of {totalProducts} products
        </p>
      </div>

      {/* Product grid - responsive: 1 col xs, 2 sm, 3 md, 4 lg */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Link href={buildPageUrl(Math.max(1, currentPage - 1))}>
            <Button variant="outline" size="icon" disabled={currentPage === 1} className="bg-transparent">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <Link key={pageNum} href={buildPageUrl(pageNum)}>
                  <Button
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="icon"
                    className={currentPage !== pageNum ? "bg-transparent" : ""}
                  >
                    {pageNum}
                  </Button>
                </Link>
              )
            })}
          </div>

          <Link href={buildPageUrl(Math.min(totalPages, currentPage + 1))}>
            <Button variant="outline" size="icon" disabled={currentPage === totalPages} className="bg-transparent">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
