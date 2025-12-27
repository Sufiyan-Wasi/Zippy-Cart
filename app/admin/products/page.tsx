"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Package, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

interface Product {
  id: string
  title: string
  category: string
  stock: number
  priceINR: number
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetch("/api/admin/products?limit=1000")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Products Analytics</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Category distribution
  const categoryCount: Record<string, number> = {}
  products.forEach((p) => {
    categoryCount[p.category] = (categoryCount[p.category] || 0) + 1
  })

  const categoryData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }))

  // Stock levels
  const lowStock = products.filter((p) => p.stock < 10 && p.stock > 0).length
  const outOfStock = products.filter((p) => p.stock === 0).length
  const inStock = products.filter((p) => p.stock >= 10).length

  const stockData = [
    { name: "In Stock (≥10)", value: inStock },
    { name: "Low Stock (&lt;10)", value: lowStock },
    { name: "Out of Stock", value: outOfStock },
  ]

  // Top categories by product count
  const topCategories = categoryData.sort((a, b) => b.value - a.value).slice(0, 6)

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="inline-flex items-center text-primary hover:underline mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Products Analytics</h1>
          <p className="text-muted-foreground">Manage and analyze your product catalog</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{inStock}</div>
            <p className="text-xs text-muted-foreground">Products with stock ≥10</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStock}</div>
            <p className="text-xs text-muted-foreground">Products with stock &lt;10</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStock}</div>
            <p className="text-xs text-muted-foreground">Products with no stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Products by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Levels</CardTitle>
            <CardDescription>Product availability status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stockData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#10b981", "#f59e0b", "#ef4444"][index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Categories by Product Count</CardTitle>
          <CardDescription>Categories with most products</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCategories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" name="Products" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Products List</CardTitle>
              <CardDescription>All products in your catalog</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 text-sm font-medium">Product</th>
                  <th className="text-left py-2 px-4 text-sm font-medium">Category</th>
                  <th className="text-right py-2 px-4 text-sm font-medium">Stock</th>
                  <th className="text-right py-2 px-4 text-sm font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.slice(0, 50).map((product) => (
                  <tr key={product.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-4">
                      <div className="font-medium">{product.title}</div>
                    </td>
                    <td className="py-2 px-4">
                      <span className="text-sm text-muted-foreground">{product.category}</span>
                    </td>
                    <td className="py-2 px-4 text-right">
                      <span
                        className={`text-sm font-medium ${
                          product.stock === 0
                            ? "text-red-600"
                            : product.stock < 10
                              ? "text-orange-600"
                              : "text-green-600"
                        }`}
                      >
                          {product.stock}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-right">
                      <span className="font-medium">₹{product.priceINR.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length > 50 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Showing first 50 of {filteredProducts.length} products
              </p>
            )}
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
