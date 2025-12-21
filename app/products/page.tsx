import { Suspense } from "react"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { CATEGORIES, BRANDS } from "@/lib/products"

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    category?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {params.search ? `Search Results for "${params.search}"` : "All Products"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">Browse our collection of quality products</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Filters Sidebar - Amazon style */}
          <aside className="w-full lg:w-64 lg:shrink-0">
            <div className="sticky top-20">
              <ProductFilters
                categories={[...CATEGORIES]}
                brands={[...BRANDS]}
                currentFilters={{
                  category: params.category || "",
                  brand: params.brand || "",
                  minPrice: params.minPrice || "",
                  maxPrice: params.maxPrice || "",
                  sort: params.sort || "newest",
                }}
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid
                page={Number(params.page) || 1}
                search={params.search || ""}
                category={params.category || ""}
                brand={params.brand || ""}
                minPrice={params.minPrice ? Number(params.minPrice) : undefined}
                maxPrice={params.maxPrice ? Number(params.maxPrice) : undefined}
                sort={params.sort || "newest"}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-lg border border-gray-200">
          <div className="aspect-[3/4] bg-gray-200" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
