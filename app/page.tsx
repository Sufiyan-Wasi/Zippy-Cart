import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Truck, Shield, CreditCard, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"
import { PRODUCTS, CATEGORIES } from "@/lib/products"

export default function HomePage() {
  // Get featured products (first 8)
  const featuredProducts = PRODUCTS.slice(0, 8)

  // Get one product per category for category showcase
  const categoryProducts = CATEGORIES.map((category) => {
    const product = PRODUCTS.find((p) => p.category === category)
    return { category, image: product?.images[0] || "" }
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner - Amazon Style Wide */}
      <section className="relative bg-gradient-to-r from-[#0b5ed7] to-[#0a4fb8] text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Welcome to Zippy Cart
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Shop the best products at amazing prices. Free delivery, easy returns, and secure payments.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-[#ffb700] hover:bg-[#f0a500] text-[#131921] font-semibold text-lg px-8 py-6">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/products?category=Electronics">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                  Browse Electronics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-[#f7f7f7] border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/free-shipping" className="flex items-center gap-4 hover:bg-white/50 p-4 rounded-lg transition-colors cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b5ed7]/10">
                <Truck className="h-6 w-6 text-[#0b5ed7]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Free Shipping</p>
                <p className="text-sm text-gray-600">On orders above ₹499</p>
              </div>
            </Link>
            <Link href="/secure-payment" className="flex items-center gap-4 hover:bg-white/50 p-4 rounded-lg transition-colors cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b5ed7]/10">
                <Shield className="h-6 w-6 text-[#0b5ed7]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Secure Payment</p>
                <p className="text-sm text-gray-600">100% secure checkout</p>
              </div>
            </Link>
            <Link href="/easy-returns" className="flex items-center gap-4 hover:bg-white/50 p-4 rounded-lg transition-colors cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b5ed7]/10">
                <CreditCard className="h-6 w-6 text-[#0b5ed7]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Easy Returns</p>
                <p className="text-sm text-gray-600">7-day return policy</p>
              </div>
            </Link>
            <Link href="/support" className="flex items-center gap-4 hover:bg-white/50 p-4 rounded-lg transition-colors cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b5ed7]/10">
                <Headphones className="h-6 w-6 text-[#0b5ed7]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">24/7 Support</p>
                <p className="text-sm text-gray-600">Dedicated support team</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Carousel */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl text-gray-900">Shop by Category</h2>
              <p className="text-gray-600 mt-1">Explore our wide range of products</p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="gap-2 bg-white hover:bg-gray-50">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryProducts.map(({ category, image }) => (
              <Link key={category} href={`/products?category=${encodeURIComponent(category)}`}>
                <Card className="group overflow-hidden transition-all hover:shadow-xl border-gray-200 cursor-pointer">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={category}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-xl font-bold text-white">{category}</h3>
                      <p className="text-sm text-white/90">Shop now →</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Amazon Style Grid */}
      <section className="bg-[#f7f7f7] py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl text-gray-900">Deals for You</h2>
              <p className="text-gray-600 mt-1">Handpicked products just for you</p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="gap-2 bg-white hover:bg-gray-50">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
