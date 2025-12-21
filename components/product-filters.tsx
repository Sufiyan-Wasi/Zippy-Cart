"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface ProductFiltersProps {
  categories: string[]
  brands: string[]
  currentFilters: {
    category: string
    brand: string
    minPrice: string
    maxPrice: string
    sort: string
  }
}

export function ProductFilters({ categories, brands, currentFilters }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(true)
  const [isBrandOpen, setIsBrandOpen] = useState(true)
  const [isPriceOpen, setIsPriceOpen] = useState(true)

  const [filters, setFilters] = useState(currentFilters)

  useEffect(() => {
    setFilters(currentFilters)
  }, [currentFilters])

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()

    // Preserve search if exists
    const search = searchParams.get("search")
    if (search) {
      params.set("search", search)
    }

    // Reset to page 1 when applying filters
    params.delete("page")

    // Update filters
    if (filters.category) {
      params.set("category", filters.category)
    }

    if (filters.brand) {
      params.set("brand", filters.brand)
    }

    if (filters.minPrice) {
      params.set("minPrice", filters.minPrice)
    }

    if (filters.maxPrice) {
      params.set("maxPrice", filters.maxPrice)
    }

    if (filters.sort && filters.sort !== "newest") {
      params.set("sort", filters.sort)
    }

    router.push(`/products?${params.toString()}`)
    setIsOpen(false)
  }, [filters, router, searchParams])

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams()
    const search = searchParams.get("search")
    if (search) params.set("search", search)

    setFilters({
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
    })

    router.push(`/products?${params.toString()}`)
    setIsOpen(false)
  }, [router, searchParams])

  const hasActiveFilters =
    filters.category || filters.brand || filters.minPrice || filters.maxPrice || filters.sort !== "newest"

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Sort */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-900">Sort By</Label>
        <Select value={filters.sort} onValueChange={(value) => setFilters({ ...filters, sort: value })}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="name_asc">Name: A to Z</SelectItem>
            <SelectItem value="name_desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category - Collapsible */}
      <Collapsible open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-semibold text-gray-900 hover:text-[#0b5ed7]">
          <span>Category</span>
          {isCategoryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          <div className="space-y-1">
            <label className="flex items-center space-x-2 cursor-pointer py-1 hover:bg-gray-50 rounded px-1">
              <input
                type="radio"
                name="category"
                value=""
                checked={!filters.category}
                onChange={(e) => setFilters({ ...filters, category: "" })}
                className="text-[#0b5ed7]"
              />
              <span className="text-sm text-gray-700">All Categories</span>
            </label>
            {categories.map((cat) => (
              <label key={cat} className="flex items-center space-x-2 cursor-pointer py-1 hover:bg-gray-50 rounded px-1">
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={filters.category === cat}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="text-[#0b5ed7]"
                />
                <span className="text-sm text-gray-700">{cat}</span>
              </label>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Brand - Collapsible */}
      <Collapsible open={isBrandOpen} onOpenChange={setIsBrandOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-semibold text-gray-900 hover:text-[#0b5ed7]">
          <span>Brand</span>
          {isBrandOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          <div className="space-y-1">
            <label className="flex items-center space-x-2 cursor-pointer py-1 hover:bg-gray-50 rounded px-1">
              <input
                type="radio"
                name="brand"
                value=""
                checked={!filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: "" })}
                className="text-[#0b5ed7]"
              />
              <span className="text-sm text-gray-700">All Brands</span>
            </label>
            {brands.map((brand) => (
              <label key={brand} className="flex items-center space-x-2 cursor-pointer py-1 hover:bg-gray-50 rounded px-1">
                <input
                  type="radio"
                  name="brand"
                  value={brand}
                  checked={filters.brand === brand}
                  onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                  className="text-[#0b5ed7]"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Price Range - Collapsible */}
      <Collapsible open={isPriceOpen} onOpenChange={setIsPriceOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-semibold text-gray-900 hover:text-[#0b5ed7]">
          <span>Price Range</span>
          {isPriceOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          <div className="space-y-2">
            <div>
              <Label htmlFor="min-price" className="text-xs text-gray-600">Min Price (₹)</Label>
              <Input
                id="min-price"
                type="number"
                placeholder="Min"
                min="0"
                value={filters.minPrice}
                onChange={(e) => {
                  const value = e.target.value
                  if (!value || !filters.maxPrice || Number(value) <= Number(filters.maxPrice)) {
                    setFilters({ ...filters, minPrice: value })
                  }
                }}
                className="bg-white mt-1"
              />
            </div>
            <div>
              <Label htmlFor="max-price" className="text-xs text-gray-600">Max Price (₹)</Label>
              <Input
                id="max-price"
                type="number"
                placeholder="Max"
                min="0"
                value={filters.maxPrice}
                onChange={(e) => {
                  const value = e.target.value
                  if (!value || !filters.minPrice || Number(value) >= Number(filters.minPrice)) {
                    setFilters({ ...filters, maxPrice: value })
                  }
                }}
                className="bg-white mt-1"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-4 border-t">
        <Button onClick={applyFilters} className="w-full bg-[#0b5ed7] hover:bg-[#0a4fb8] text-white" aria-label="Apply filters">
          Apply Filters
        </Button>
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} className="w-full" aria-label="Clear all filters">
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Filters */}
      <div className="lg:hidden mb-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full gap-2 bg-white">
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && <span className="ml-1 h-2 w-2 rounded-full bg-[#0b5ed7]" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Narrow down your search results</SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters - Amazon-style sidebar */}
      <div className="hidden lg:block">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <FilterContent />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
