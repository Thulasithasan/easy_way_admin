"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Edit, Trash2, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PermissionGuard } from "@/components/common/permission-guard"

// Mock data - in real app, fetch based on ID
const mockRole = {
  id: "1",
  name: "ADMIN",
  description: "Administrative access with limited restrictions",
  userCount: 5,
  permissions: [
    {
      id: "1",
      name: "Product Management",
      description: "Manage products, categories, and inventory",
      subPermissions: ["view", "create", "edit", "delete"],
    },
    {
      id: "2",
      name: "Order Management",
      description: "Manage customer orders and transactions",
      subPermissions: ["view", "create", "edit"],
    },
    {
      id: "3",
      name: "Inventory Management",
      description: "Manage stock, purchases, and inventory",
      subPermissions: ["view", "edit"],
    },
  ],
  users: [
    { id: "1", name: "John Doe", email: "john.doe@company.com", status: "active" },
    { id: "2", name: "Jane Smith", email: "jane.smith@company.com", status: "active" },
    { id: "3", name: "Mike Johnson", email: "mike.johnson@company.com", status: "inactive" },
  ],
  status: "active",
  createdAt: "2024-01-05",
  updatedAt: "2024-01-20",
}

export default function RoleDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [role] = useState(mockRole)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{role.name}</h1>
              <p className="text-muted-foreground">{role.description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PermissionGuard permission="User" subPermission="edit">
            <Button onClick={() => router.push(`/dashboard/roles/${role.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Role
            </Button>
          </PermissionGuard>
          <PermissionGuard permission="User" subPermission="delete">
            <Button variant="destructive" disabled={role.name === "SUPER_ADMIN"}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </PermissionGuard>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Role Information */}
        <Card>
          <CardHeader>
            <CardTitle>Role Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant={role.status === "active" ? "default" : "secondary"}>{role.status}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Users Assigned</label>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="h-4 w-4" />
                  <span className="text-2xl font-bold">{role.userCount}</span>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="mt-1">{new Date(role.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <p className="mt-1">{new Date(role.updatedAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Users */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {role.users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {role.permissions.map((permission) => (
              <div key={permission.id} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{permission.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">{permission.description}</p>
                <div className="flex flex-wrap gap-1">
                  {permission.subPermissions.map((subPerm) => (
                    <Badge key={subPerm} variant="outline" className="text-xs capitalize">
                      {subPerm}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
