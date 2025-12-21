"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatINR } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts"

interface Order {
  id: string
  userEmail: string
  totalPriceINR: number
  status: string
  isPaid: boolean
  createdAt: string | Date
  shippingAddress?: { fullName: string }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetch("/api/admin/orders?limit=1000")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Orders Analytics</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Orders by status
  const statusCounts: Record<string, number> = {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  }

  orders.forEach((order) => {
    if (order.status in statusCounts) {
      statusCounts[order.status]++
    }
  })

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

  // Orders timeline (last 30 days)
  const today = new Date()
  const timelineData = []
  for (let i = 29; i >= 0; i--) {
    const day = new Date(today)
    day.setDate(day.getDate() - i)
    day.setHours(0, 0, 0, 0)

    const nextDay = new Date(day)
    nextDay.setDate(nextDay.getDate() + 1)

    const dayOrders = orders.filter((o) => {
      const orderDate = new Date(o.createdAt)
      return orderDate >= day && orderDate < nextDay
    })

    timelineData.push({
      date: day.toISOString().split("T")[0],
      label: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count: dayOrders.length,
    })
  }

  const filteredOrders = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="inline-flex items-center text-primary hover:underline mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Orders Analytics</h1>
          <p className="text-muted-foreground">Track and manage all customer orders</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-5">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">{status}</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count}</div>
              <p className="text-xs text-muted-foreground">Orders</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
            <CardDescription>Distribution of orders across different statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders Timeline</CardTitle>
            <CardDescription>Daily order count for the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>Complete list of customer orders</CardDescription>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
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
                {filteredOrders.slice(0, 100).map((order) => (
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
                      <Link href={`/admin/orders/${order.id}`} className="text-sm text-primary hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length > 100 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Showing first 100 of {filteredOrders.length} orders
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
