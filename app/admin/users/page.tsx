"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string | Date
}

export default function UsersPage() {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/analytics/users")
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Users Analytics</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const users = data.users || []
  const newUsersByMonth = data.newUsersByMonth || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
      <div>
          <Link href="/admin" className="inline-flex items-center text-primary hover:underline mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Users Analytics</h1>
          <p className="text-muted-foreground">Manage and analyze registered users</p>
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Registered Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalUsers || 0}</div>
          <p className="text-xs text-muted-foreground">All registered users</p>
        </CardContent>
      </Card>

      {/* New Users Chart */}
      <Card>
        <CardHeader>
          <CardTitle>New Users Per Month</CardTitle>
          <CardDescription>User registration trends over the last 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={newUsersByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="New Users" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Complete list of registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 text-sm font-medium">Name</th>
                  <th className="text-left py-2 px-4 text-sm font-medium">Email</th>
                  <th className="text-left py-2 px-4 text-sm font-medium">Role</th>
                  <th className="text-left py-2 px-4 text-sm font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: User) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-4 font-medium">{user.name}</td>
                    <td className="py-2 px-4">
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No users found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
