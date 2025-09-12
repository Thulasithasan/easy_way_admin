"use client"

import type React from "react"

import { useEffect } from "react"
import { useAuthStore } from "@/lib/store"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    // Initialize auth state when the app loads
    initialize()
  }, [initialize])

  return <>{children}</>
}
