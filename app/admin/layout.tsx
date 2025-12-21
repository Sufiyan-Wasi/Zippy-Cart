import type React from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Package, ShoppingCart, Users, ChevronLeft, IndianRupee, TrendingDown } from "lucide-react"
import { getSession } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Store
              </Button>
            </Link>
            <span className="font-semibold">Zippy Cart — Admin</span>
          </div>
          <div className="text-sm text-muted-foreground">Logged in as {session.email}</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <nav className="sticky top-20 space-y-1">
              <Link href="/admin">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/products">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Package className="h-4 w-4" />
                  Products
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Orders
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Users className="h-4 w-4" />
                  Users
                </Button>
              </Link>
              <Link href="/admin/revenue">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <IndianRupee className="h-4 w-4" />
                  Revenue
                </Button>
              </Link>
              <Link href="/admin/refunds">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Refunds
                </Button>
              </Link>
            </nav>
          </aside>

          {/* Mobile Navigation */}
          <div className="mb-4 flex gap-2 overflow-x-auto lg:hidden">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Package className="h-4 w-4" />
                Products
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <ShoppingCart className="h-4 w-4" />
                Orders
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Users className="h-4 w-4" />
                Users
              </Button>
            </Link>
            <Link href="/admin/revenue">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <IndianRupee className="h-4 w-4" />
                Revenue
              </Button>
            </Link>
            <Link href="/admin/refunds">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <TrendingDown className="h-4 w-4" />
                Refunds
              </Button>
            </Link>
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
