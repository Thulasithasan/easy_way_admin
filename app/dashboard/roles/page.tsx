"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Eye, Edit, Trash2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/common/data-table"
import { PermissionGuard } from "@/components/common/permission-guard"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data
const mockRoles = [
  {
    id: "1",
    name: "SUPER_ADMIN",
    description: "Full access to all system features",
    userCount: 2,
    permissions: ["User", "Product", "Order", "Inventory", "Challenges"],
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "ADMIN",
    description: "Administrative access with limited restrictions",
    userCount: 5,
    permissions: ["Product", "Order", "Inventory"],
    status: "active",
    createdAt: "2024-01-05",
  },
  {
    id: "3",
    name: "MANAGER",
    description: "Management level access",
    userCount: 12,
    permissions: ["Product", "Order"],
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: "4",
    name: "EMPLOYEE",
    description: "Basic employee access",
    userCount: 25,
    permissions: ["Order"],
    status: "active",
    createdAt: "2024-01-15",
  },
]

export default function RolesPage() {
  const router = useRouter()
  const [roles] = useState(mockRoles)

  const columns = [
    {
      key: "name",
      label: "Role Name",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground">{row.description}</div>
          </div>
        </div>
      ),
    },
    {
      key: "userCount",
      label: "Users",
      render: (value: number) => <Badge variant="outline">{value} users</Badge>,
    },
    {
      key: "permissions",
      label: "Permissions",
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 3).map((permission) => (
            <Badge key={permission} variant="secondary" className="text-xs">
              {permission}
            </Badge>
          ))}
          {value.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{value.length - 3} more
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => <Badge variant={value === "active" ? "default" : "secondary"}>{value}</Badge>,
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <PermissionGuard permission="User" subPermission="view">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/roles/${row.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            </PermissionGuard>
            <PermissionGuard permission="User" subPermission="edit">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/roles/${row.id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </PermissionGuard>
            <PermissionGuard permission="User" subPermission="delete">
              <DropdownMenuItem className="text-destructive" disabled={row.name === "SUPER_ADMIN"}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </PermissionGuard>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const filters = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <DataTable
        title="Roles"
        description="Manage user roles and permissions"
        data={roles}
        columns={columns}
        searchPlaceholder="Search roles..."
        filters={filters}
        actions={
          <PermissionGuard permission="User" subPermission="create">
            <Button onClick={() => router.push("/dashboard/roles/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </PermissionGuard>
        }
      />
    </div>
  )
}
