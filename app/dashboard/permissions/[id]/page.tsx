"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Edit, Trash2, Key, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PermissionGuard } from "@/components/common/permission-guard"

// Mock data
const mockPermission = {
  id: "1",
  name: "Product Management",
  description: "Manage products, categories, and inventory",
  module: "Product",
  subPermissions: ["view", "create", "edit", "delete"],
  roles: [
    { id: "1", name: "SUPER_ADMIN", userCount: 2 },
    { id: "2", name: "ADMIN", userCount: 5 },
    { id: "3", name: "MANAGER", userCount: 12 },
  ],
  status: "active",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-15",
}

export default function PermissionDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [permission] = useState(mockPermission)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Key className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{permission.name}</h1>
              <p className="text-muted-foreground">{permission.description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PermissionGuard permission="User" subPermission="edit">
            <Button onClick={() => router.push(`/dashboard/permissions/${permission.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Permission
            </Button>
          </PermissionGuard>
          <PermissionGuard permission="User" subPermission="delete">
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </PermissionGuard>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Permission Information */}
        <Card>
          <CardHeader>
            <CardTitle>Permission Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Module</label>
              <p className="mt-1 font-medium">{permission.module}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge variant={permission.status === "active" ? "default" : "secondary"}>{permission.status}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="mt-1">{new Date(permission.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <p className="mt-1">{new Date(permission.updatedAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Sub-permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Sub-permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {permission.subPermissions.map((subPerm) => (
                <Badge key={subPerm} variant="outline" className="justify-center capitalize">
                  {subPerm}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roles Using This Permission */}
      <Card>
        <CardHeader>
          <CardTitle>Roles Using This Permission</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {permission.roles.map((role) => (
              <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{role.name}</p>
                    <p className="text-sm text-muted-foreground">{role.userCount} users</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/roles/${role.id}`)}>
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
