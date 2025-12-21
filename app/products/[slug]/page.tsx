import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, Check, Truck, Shield, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getProductBySlug, PRODUCTS } from "@/lib/products"
import { formatINR } from "@/lib/utils"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { ProductCard } from "@/components/product-card"
import { StarsRating } from "@/components/stars-rating"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  // Get related products from same category
  const relatedProducts = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock <= 5
  const rating = 4.0 + Math.random() * 1
  const reviews = Math.floor(Math.random() * 500) + 50

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#f7f7f7] border-b border-gray-200">
        <div className="container mx-auto px-4 py-2">
          <Link
            href="/products"
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#0b5ed7] transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Products
          </Link>
        </div>
      </div>

      {/* Product Details - Amazon Style */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery - Left Side */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white border border-gray-200">
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-contain p-8"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>
            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-lg bg-white border border-gray-200 cursor-pointer hover:border-[#0b5ed7] transition-colors">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.title} - Image ${index + 2}`}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 1024px) 25vw, 12vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - Right Side */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <StarsRating rating={rating} totalReviews={reviews} size="md" />
                <span className="text-sm text-[#0b5ed7] hover:text-[#0a4fb8] cursor-pointer">
                  {reviews} ratings
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">{formatINR(product.priceINR)}</p>
                <p className="text-sm text-gray-600">Inclusive of all taxes</p>
              </div>
            </div>

            {/* Stock Status */}
            <div>
              {isOutOfStock ? (
                <Badge variant="destructive" className="text-base px-3 py-1">Out of Stock</Badge>
              ) : isLowStock ? (
                <Badge className="bg-amber-100 text-amber-800 text-base px-3 py-1">
                  Only {product.stock} left in stock
                </Badge>
              ) : (
                <Badge className="bg-green-100 text-green-800 text-base px-3 py-1">
                  <Check className="mr-1 h-4 w-4" /> In Stock
                </Badge>
              )}
            </div>

            {/* Key Features */}
            <div className="bg-[#f7f7f7] rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600" />
                <span>Free Delivery on orders above ₹499</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600" />
                <span>7-day easy returns</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600" />
                <span>Manufacturer warranty applicable</span>
              </div>
            </div>

            {/* Add to Cart / Buy Now */}
            <div className="space-y-3 pt-4">
              <AddToCartButton product={product} className="w-full bg-[#ffb700] hover:bg-[#f0a500] text-[#131921] font-semibold py-6 text-lg" />
              <Button className="w-full bg-[#ffa500] hover:bg-[#ff9500] text-white font-semibold py-6 text-lg">
                Buy Now
              </Button>
            </div>

            {/* Delivery Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Free Delivery</p>
                  <p className="text-xs text-gray-600">Get it by tomorrow</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Secure Transaction</p>
                  <p className="text-xs text-gray-600">Your payment information is safe</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RefreshCw className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Easy Returns</p>
                  <p className="text-xs text-gray-600">7-day return policy</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold mb-2 text-lg">About this item</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-gray-200 pt-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Related Products</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
