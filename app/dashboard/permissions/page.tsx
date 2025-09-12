"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Eye, Edit, Trash2, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/common/data-table"
import { PermissionGuard } from "@/components/common/permission-guard"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data
const mockPermissions = [
  {
    id: "1",
    name: "User Management",
    description: "Manage users, roles, and permissions",
    module: "User",
    subPermissions: ["view", "create", "edit", "delete"],
    roleCount: 3,
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Product Management",
    description: "Manage products, categories, and inventory",
    module: "Product",
    subPermissions: ["view", "create", "edit", "delete"],
    roleCount: 4,
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    name: "Order Management",
    description: "Manage customer orders and transactions",
    module: "Order",
    subPermissions: ["view", "create", "edit", "delete"],
    roleCount: 4,
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "4",
    name: "Challenge Management",
    description: "Manage user challenges and competitions",
    module: "Challenges",
    subPermissions: ["view", "create", "edit", "delete"],
    roleCount: 2,
    status: "active",
    createdAt: "2024-01-01",
  },
]

export default function PermissionsPage() {
  const router = useRouter()
  const [permissions] = useState(mockPermissions)

  const columns = [
    {
      key: "name",
      label: "Permission Name",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <Key className="h-5 w-5 text-primary" />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground">{row.module}</div>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (value: string) => <div className="max-w-[300px] truncate">{value}</div>,
    },
    {
      key: "subPermissions",
      label: "Sub-permissions",
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.map((subPerm) => (
            <Badge key={subPerm} variant="outline" className="text-xs capitalize">
              {subPerm}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "roleCount",
      label: "Used in Roles",
      render: (value: number) => <Badge variant="secondary">{value} roles</Badge>,
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => <Badge variant={value === "active" ? "default" : "secondary"}>{value}</Badge>,
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
              <DropdownMenuItem onClick={() => router.push(`/dashboard/permissions/${row.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            </PermissionGuard>
            <PermissionGuard permission="User" subPermission="edit">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/permissions/${row.id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </PermissionGuard>
            <PermissionGuard permission="User" subPermission="delete">
              <DropdownMenuItem className="text-destructive">
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
    {
      key: "module",
      label: "Module",
      options: [
        { value: "User", label: "User" },
        { value: "Product", label: "Product" },
        { value: "Order", label: "Order" },
        { value: "Challenges", label: "Challenges" },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <DataTable
        title="Permissions"
        description="Manage system permissions and access controls"
        data={permissions}
        columns={columns}
        searchPlaceholder="Search permissions..."
        filters={filters}
        actions={
          <PermissionGuard permission="User" subPermission="create">
            <Button onClick={() => router.push("/dashboard/permissions/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Permission
            </Button>
          </PermissionGuard>
        }
      />
    </div>
  )
}
