"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

const availablePermissions = [
  {
    id: "user",
    name: "User Management",
    description: "Manage users, roles, and permissions",
    subPermissions: ["view", "create", "edit", "delete"],
  },
  {
    id: "product",
    name: "Product Management",
    description: "Manage products, categories, and inventory",
    subPermissions: ["view", "create", "edit", "delete"],
  },
  {
    id: "order",
    name: "Order Management",
    description: "Manage customer orders and transactions",
    subPermissions: ["view", "create", "edit", "delete"],
  },
  {
    id: "inventory",
    name: "Inventory Management",
    description: "Manage stock, purchases, and inventory",
    subPermissions: ["view", "create", "edit", "delete"],
  },
  {
    id: "challenges",
    name: "Challenge Management",
    description: "Manage user challenges and competitions",
    subPermissions: ["view", "create", "edit", "delete"],
  },
]

// Mock existing role data
const mockRole = {
  id: "1",
  name: "ADMIN",
  description: "Administrative access with limited restrictions",
  permissions: {
    product: ["view", "create", "edit", "delete"],
    order: ["view", "create", "edit"],
    inventory: ["view", "edit"],
  },
}

export default function EditRolePage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, string[]>>(mockRole.permissions)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: mockRole.name,
      description: mockRole.description,
    },
  })

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Updated role:", { ...data, permissions: selectedPermissions })
      router.push(`/dashboard/roles/${params.id}`)
    } catch (error) {
      console.error("Error updating role:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePermissionChange = (permissionId: string, subPermission: string, checked: boolean) => {
    setSelectedPermissions((prev) => {
      const current = prev[permissionId] || []
      if (checked) {
        return { ...prev, [permissionId]: [...current, subPermission] }
      } else {
        return { ...prev, [permissionId]: current.filter((p) => p !== subPermission) }
      }
    })
  }

  const handleSelectAll = (permissionId: string, checked: boolean) => {
    const permission = availablePermissions.find((p) => p.id === permissionId)
    if (permission) {
      setSelectedPermissions((prev) => ({
        ...prev,
        [permissionId]: checked ? permission.subPermissions : [],
      }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Role</h1>
          <p className="text-muted-foreground">Update role information and permissions</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Role name and description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  placeholder="Enter role name"
                  {...register("name", { required: "Role name is required" })}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter role description" {...register("description")} rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>Select permissions for this role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {availablePermissions.map((permission) => (
                  <div key={permission.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{permission.name}</h4>
                        <p className="text-sm text-muted-foreground">{permission.description}</p>
                      </div>
                      <Checkbox
                        checked={selectedPermissions[permission.id]?.length === permission.subPermissions.length}
                        onCheckedChange={(checked) => handleSelectAll(permission.id, checked as boolean)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 ml-4">
                      {permission.subPermissions.map((subPerm) => (
                        <div key={subPerm} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${permission.id}-${subPerm}`}
                            checked={selectedPermissions[permission.id]?.includes(subPerm) || false}
                            onCheckedChange={(checked) =>
                              handlePermissionChange(permission.id, subPerm, checked as boolean)
                            }
                          />
                          <Label htmlFor={`${permission.id}-${subPerm}`} className="text-sm capitalize">
                            {subPerm}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
