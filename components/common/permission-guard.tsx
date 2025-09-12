"use client"

import type React from "react"

import { useAuthStore } from "@/lib/store"

interface PermissionGuardProps {
  permission?: string
  subPermission?: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PermissionGuard({ permission, subPermission, children, fallback = null }: PermissionGuardProps) {
  const { hasPermission, isSuperAdmin } = useAuthStore()

  // If no permission is specified, always show
  if (!permission) return <>{children}</>

  // Super admin can see everything
  if (isSuperAdmin()) return <>{children}</>

  // Check permission
  if (hasPermission(permission, subPermission)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
