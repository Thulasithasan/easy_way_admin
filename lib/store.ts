import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface Permission {
  permissionId: number
  name: string
  description: string
  subPermissions: string[]
}

interface Role {
  roleId: number
  name: string
  description: string
  permissions: Permission[]
}

interface User {
  userId: number | null
  firstName: string
  lastName: string
  email: string
  roleResponseDto: Role
  accessToken: string
  refreshToken: string
  isPasswordChangedForTheFirstTime: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (userData: User) => void
  logout: () => void
  hasPermission: (permissionName: string, subPermission?: string) => boolean
  isSuperAdmin: () => boolean
  initialize: () => void
}

// in src/types/category.ts
export interface Category {
  categoryId?: number
  name: string;
  description: string;
  isActive: boolean;
}

export interface Subcategory {
  subcategoryId?: number
  name: string;
  description: string;
  categoryId?: number;
  isActive: boolean;
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: (userData) => {
        localStorage.setItem("auth_token", userData.accessToken)
        localStorage.setItem("refresh_token", userData.refreshToken)
        set({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        })
      },
      logout: () => {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("refresh_token")
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },
      hasPermission: (permissionName: string, subPermission?: string) => {
        const { user } = get()
        if (!user) return false

        // super-admin short-circuit
        if (user.roleResponseDto?.name === "SUPER_ADMIN") return true

        const permissions = user.roleResponseDto?.permissions ?? []
        const permission = permissions.find((p) => p.name.toLowerCase() === permissionName.toLowerCase())

        if (!permission) return false
        return subPermission ? permission.subPermissions.includes(subPermission.toLowerCase()) : true
      },
      isSuperAdmin: () => {
        const { user } = get()
        return user?.roleResponseDto?.name === "SUPER_ADMIN"
      },
      initialize: () => {
        // Check if we have stored auth data
        const token = localStorage.getItem("auth_token")
        const refreshToken = localStorage.getItem("refresh_token")

        if (token && refreshToken) {
          // If we have tokens but no user data, keep authenticated state
          const { user } = get()
          if (user) {
            set({ isAuthenticated: true, isLoading: false })
          } else {
            // Token exists but no user data, might be corrupted
            localStorage.removeItem("auth_token")
            localStorage.removeItem("refresh_token")
            set({ isAuthenticated: false, isLoading: false })
          }
        } else {
          set({ isAuthenticated: false, isLoading: false })
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Called when the store is rehydrated from localStorage
        if (state) {
          state.isLoading = false
          // Verify tokens still exist in localStorage
          const token = localStorage.getItem("auth_token")
          if (!token && state.isAuthenticated) {
            state.isAuthenticated = false
            state.user = null
          }
        }
      },
    },
  ),
)

interface AppState {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  notifications: any[]
  addNotification: (notification: any) => void
  removeNotification: (id: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id: Date.now().toString() }],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}))
