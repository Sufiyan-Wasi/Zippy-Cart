"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Package, ShoppingCart, Users, IndianRupee, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatINR } from "@/lib/utils"
import { SalesChart } from "@/components/admin/sales-chart"
import { OrdersChart } from "@/components/admin/orders-chart"
import type { AdminStats } from "@/lib/types"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  // Ensure salesByDay exists and is an array with proper defaults
  const salesByDay = Array.isArray(stats.salesByDay) ? stats.salesByDay : []
  const recentSales = salesByDay.length > 0 ? salesByDay.slice(-7) : []
  
  // Ensure ordersByStatus exists
  const ordersByStatus = stats.ordersByStatus || {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Link href="/admin/revenue">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:shadow-lg transition-all cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                {formatINR(stats.totalRevenueINR || 0)}
            </div>
            <p className="text-xs text-green-700 dark:text-green-300">From paid orders</p>
          </CardContent>
        </Card>
        </Link>

        <Link href="/admin/products">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Products</CardTitle>
            <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalProducts || 0}</div>
            <p className="text-xs text-blue-700 dark:text-blue-300">Across 6 categories</p>
          </CardContent>
        </Card>
        </Link>

        <Link href="/admin/orders">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.totalOrders || 0}</div>
              <p className="text-xs text-orange-700 dark:text-orange-300">{ordersByStatus.pending || 0} pending</p>
          </CardContent>
        </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.totalUsers || 0}</div>
            <p className="text-xs text-purple-700 dark:text-purple-300">Registered users</p>
          </CardContent>
        </Card>
        </Link>

        <Link href="/admin/refunds">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800 hover:shadow-lg transition-all cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100">Returns/Refunds</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold text-red-900 dark:text-red-100">{formatINR(stats.returnsAmountINR || 0)}</div>
            <p className="text-xs text-red-700 dark:text-red-300">Refunded amount</p>
          </CardContent>
        </Card>
        </Link>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SalesChart data={salesByDay} />
        <OrdersChart ordersByStatus={ordersByStatus} />
      </div>

      {/* Order Status Breakdown */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                {ordersByStatus.pending || 0}
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {ordersByStatus.processing || 0}
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Processing</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {ordersByStatus.shipped || 0}
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">Shipped</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                {ordersByStatus.delivered || 0}
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">Delivered</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-900 dark:text-red-100">
                {ordersByStatus.cancelled || 0}
              </div>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">Cancelled</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentOrdersTable />
        </CardContent>
      </Card>
    </div>
  )
}

function RecentOrdersTable() {
  const [orders, setOrders] = useState<Array<{
    id: string
    userEmail: string
    totalPriceINR: number
    status: string
    isPaid: boolean
    createdAt: string | Date
    shippingAddress?: { fullName: string }
  }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/orders?limit=10")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return <p className="text-center text-muted-foreground py-8">Loading orders...</p>
  }

  if (orders.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No orders yet</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-4 text-sm font-medium">Order ID</th>
            <th className="text-left py-2 px-4 text-sm font-medium">Customer</th>
            <th className="text-right py-2 px-4 text-sm font-medium">Total</th>
            <th className="text-left py-2 px-4 text-sm font-medium">Status</th>
            <th className="text-left py-2 px-4 text-sm font-medium">Payment</th>
            <th className="text-left py-2 px-4 text-sm font-medium">Date</th>
            <th className="text-left py-2 px-4 text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-muted/50">
              <td className="py-2 px-4 font-mono text-sm">{order.id}</td>
              <td className="py-2 px-4">
                <div>
                  <p className="font-medium">{order.shippingAddress?.fullName || order.userEmail}</p>
                  <p className="text-sm text-muted-foreground">{order.userEmail}</p>
                </div>
              </td>
              <td className="py-2 px-4 text-right font-medium">{formatINR(order.totalPriceINR)}</td>
              <td className="py-2 px-4">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : order.status === "shipped"
                          ? "bg-purple-100 text-purple-800"
                          : order.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="py-2 px-4">
                {order.isPaid ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                    Unpaid
                  </span>
                )}
              </td>
              <td className="py-2 px-4 text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </td>
              <td className="py-2 px-4">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
