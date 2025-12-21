"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"
import { formatINR } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { StarsRating } from "@/components/stars-rating"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const isOutOfStock = product.stock === 0
  // Use deterministic ratings based on product ID to prevent hydration errors
  const productIdHash = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const rating = 4.0 + (productIdHash % 100) / 100  // Deterministic rating between 4.0-5.0
  const reviews = 50 + (productIdHash % 500)

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] h-full flex flex-col">
      <Link href={`/products/${product.slug}`} className="flex-1 flex flex-col">
        {/* Product Image - Amazon style tall */}
        <div className="relative aspect-[3/4] w-full bg-white overflow-hidden">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/90">
              <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Category & Brand */}
          <div className="mb-1">
            <span className="text-xs text-gray-500">{product.brand}</span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 hover:text-[#0b5ed7] transition-colors min-h-[2.5rem]">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="mb-2">
            <StarsRating rating={rating} totalReviews={reviews} size="sm" />
          </div>

          {/* Price */}
          <div className="mb-3">
            <span className="text-lg font-bold text-[#0b5ed7]">{formatINR(product.priceINR)}</span>
            {product.stock > 0 && (
              <span className="ml-2 text-xs text-green-600 font-medium">In Stock</span>
            )}
          </div>

          {/* Prime-style badge */}
          <div className="mb-3">
            <Badge variant="secondary" className="text-xs bg-[#ffb700]/10 text-[#ffb700] border-[#ffb700]/20">
              ZippyCart+
            </Badge>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="p-4 pt-0">
        <Button
          className="w-full bg-[#ffb700] hover:bg-[#f0a500] text-[#131921] font-semibold rounded-md"
          size="sm"
          disabled={isOutOfStock}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            addToCart(product)
          }}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
