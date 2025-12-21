import { redirect } from "next/navigation"
import Link from "next/link"
import { Package, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth"
import { getOrdersByUserId } from "@/lib/orders"
import { formatINR } from "@/lib/utils"

export default async function OrdersPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const orders = getOrdersByUserId(session.id)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return ""
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your orders</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">No orders yet</h2>
            <p className="mb-6 text-muted-foreground">Start shopping to see your orders here</p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-mono">{order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    {order.isPaid ? (
                      <Badge className="bg-green-100 text-green-800">Paid</Badge>
                    ) : (
                      <Badge variant="secondary">Unpaid</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {order.orderItems.length} {order.orderItems.length === 1 ? "item" : "items"}
                    </p>
                    <p className="font-semibold">{formatINR(order.totalPriceINR)}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-muted-foreground">Shipping to:</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </p>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mt-4 border-t border-border pt-4">
                  <div className="flex flex-wrap gap-2">
                    {order.orderItems.slice(0, 3).map((item, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-muted-foreground"> x{item.qty}</span>
                        {index < Math.min(order.orderItems.length, 3) - 1 && (
                          <span className="text-muted-foreground">, </span>
                        )}
                      </div>
                    ))}
                    {order.orderItems.length > 3 && (
                      <span className="text-sm text-muted-foreground">+{order.orderItems.length - 3} more</span>
                    )}
                  </div>
                </div>

                <Link href={`/orders/${order.id}`} className="mt-4 block">
                  <Button variant="outline" className="w-full gap-2 bg-transparent">
                    View Order Details
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
