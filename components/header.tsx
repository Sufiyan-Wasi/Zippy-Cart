"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { ShoppingCart, User, Menu, X, LogOut, Package, Settings, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/lib/cart-context"
import type { SessionUser } from "@/lib/types"
import dynamic from "next/dynamic"

const GoogleSearch = dynamic(() => import('./google-search').then(mod => mod.GoogleSearch), {
  ssr: false,
});

export function Header() {
  const pathname = usePathname()
  const { totalItems, clearCart } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<SessionUser | null>(null)

  useEffect(() => {
    // Fetch current user session
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null))
  }, [pathname])

  const handleLogout = async () => {
    try {
      // Clear server-side cart if logged in
      if (user) {
        await fetch("/api/cart/clear", { method: "POST", credentials: "include" })
      }
      // Clear client-side cart
      clearCart()
      // Logout
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      setUser(null)
      window.location.href = "/"
    } catch (error) {
      // Still clear cart and logout even if API call fails
      clearCart()
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {})
    setUser(null)
    window.location.href = "/"
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-black">
      {/* Top Bar - Black and White */}
      <div className="hidden md:flex items-center justify-between px-4 py-1.5 text-xs bg-black text-white">
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            <MapPin className="inline h-3 w-3 mr-1" />
            <span className="font-semibold">Deliver to India</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/products" className="hover:text-gray-300 transition-colors">
            All Products
          </Link>
          <Link href="/orders" className="hover:text-gray-300 transition-colors">
            Orders
          </Link>
          <Link href="/cart" className="hover:text-gray-300 transition-colors">
            Cart
          </Link>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo - Black and White */}
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-black">Zippy</span>
              <span className="text-2xl font-bold text-black ml-1">Cart</span>
            </div>
          </Link>

          {/* Google Custom Search - Black and White */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <GoogleSearch />
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-black hover:bg-gray-100 h-auto py-1.5 px-2">
                    <div className="text-left">
                      <div className="text-xs text-gray-600">Hello, {user.name.split(" ")[0]}</div>
                      <div className="text-sm font-semibold">Account & Lists</div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" className="text-black hover:bg-gray-100 h-auto py-1.5 px-2">
                  <div className="text-left">
                    <div className="text-xs text-gray-600">Hello, Sign in</div>
                    <div className="text-sm font-semibold">Account & Lists</div>
                  </div>
                </Button>
              </Link>
            )}

            <Link href="/orders" className="text-black hover:bg-gray-100 px-2 py-1.5 rounded">
              <div className="text-left">
                <div className="text-xs text-gray-600">Returns</div>
                <div className="text-sm font-semibold">& Orders</div>
              </div>
            </Link>

            <Link href="/cart" className="relative text-black hover:bg-gray-100 px-2 py-1.5 rounded flex items-end">
              <div className="text-left">
                <span className="absolute -top-1 left-6 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
                <ShoppingCart className="h-8 w-8" />
                <div className="text-xs font-semibold mt-1">Cart</div>
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden text-black" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t-2 border-black py-4 bg-white">
            <div className="mb-4 px-2">
              <GoogleSearch />
            </div>
            <nav className="flex flex-col gap-2 px-2">
              <Link href="/products" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-black hover:bg-gray-100">
                  Products
                </Button>
              </Link>
              <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-black hover:bg-gray-100">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Cart ({totalItems})
                </Button>
              </Link>
              {user ? (
                <>
                  <Link href="/orders" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-black hover:bg-gray-100">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Button>
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-black hover:bg-gray-100">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}
                    <Button variant="ghost" className="w-full justify-start text-black hover:bg-gray-100" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-black hover:bg-gray-800 text-white">
                      Sign In
                    </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
