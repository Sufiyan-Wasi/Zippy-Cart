"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserRoleSelectProps {
  userId: string
  currentRole: "user" | "admin"
  onUpdate?: () => void
}

export function UserRoleSelect({ userId, currentRole, onUpdate }: UserRoleSelectProps) {
  const router = useRouter()
  const [role, setRole] = useState(currentRole)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleRoleChange = async (newRole: string) => {
    setIsUpdating(true)
    setRole(newRole as "user" | "admin")

    try {
      await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })
      router.refresh()
      onUpdate?.()
    } catch (error) {
      setRole(currentRole) // Revert on error
      console.error("Failed to update role:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Select value={role} onValueChange={handleRoleChange} disabled={isUpdating}>
      <SelectTrigger className="w-24">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="user">User</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  )
}
