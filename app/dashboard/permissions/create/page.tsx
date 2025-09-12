"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const availableSubPermissions = ["view", "create", "edit", "delete"]
const modules = ["User", "Product", "Order", "Inventory", "Challenges", "Report"]

export default function CreatePermissionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedSubPermissions, setSelectedSubPermissions] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      module: "",
      status: "active",
    },
  })

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Created permission:", { ...data, subPermissions: selectedSubPermissions })
      router.push("/dashboard/permissions")
    } catch (error) {
      console.error("Error creating permission:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubPermissionChange = (subPermission: string, checked: boolean) => {
    setSelectedSubPermissions((prev) => {
      if (checked) {
        return [...prev, subPermission]
      } else {
        return prev.filter((p) => p !== subPermission)
      }
    })
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedSubPermissions(checked ? availableSubPermissions : [])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Permission</h1>
          <p className="text-muted-foreground">Define a new permission with specific sub-permissions</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Permission name and description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Permission Name</Label>
                <Input
                  id="name"
                  placeholder="Enter permission name"
                  {...register("name", { required: "Permission name is required" })}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter permission description"
                  {...register("description")}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="module">Module</Label>
                <Select value={watch("module") || ""} onValueChange={(value) => setValue("module", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((module) => (
                      <SelectItem key={module} value={module}>
                        {module}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.module && <p className="text-sm text-destructive">{errors.module.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={watch("status")} onValueChange={(value) => setValue("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sub-permissions</CardTitle>
              <CardDescription>Select available sub-permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Select All</Label>
                <Checkbox
                  checked={selectedSubPermissions.length === availableSubPermissions.length}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                />
              </div>
              <div className="space-y-3">
                {availableSubPermissions.map((subPerm) => (
                  <div key={subPerm} className="flex items-center justify-between">
                    <Label htmlFor={subPerm} className="capitalize">
                      {subPerm}
                    </Label>
                    <Checkbox
                      id={subPerm}
                      checked={selectedSubPermissions.includes(subPerm)}
                      onCheckedChange={(checked) => handleSubPermissionChange(subPerm, checked as boolean)}
                    />
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
            {loading ? "Creating..." : "Create Permission"}
          </Button>
        </div>
      </form>
    </div>
  )
}
