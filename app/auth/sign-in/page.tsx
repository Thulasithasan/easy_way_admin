"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signInSchema, type SignInFormData } from "@/lib/schemas"
import { useAuthStore } from "@/lib/store"
import { authAPI } from "@/lib/auth-api"

export default function SignInPage() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login, isAuthenticated, isLoading } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  // const onSubmit = async (data: SignInFormData) => {
  //   setLoading(true)
  //   setError("")

  //   try {
  //     // For demo purposes, simulate API call with the provided response structure
  //     await new Promise((resolve) => setTimeout(resolve, 1000))

  //     // Mock successful login with the provided response structure
  //     const mockResponse = {
  //       userId: 1,
  //       firstName: "Super",
  //       lastName: "Admin",
  //       email: data.email,
  //       roleResponseDto: {
  //         roleId: 1,
  //         name: "SUPER_ADMIN",
  //         description: "Full access to all system features",
  //         permissions: [
  //           {
  //             permissionId: 1,
  //             name: "Challenges",
  //             description: "Challenge management",
  //             subPermissions: ["edit", "view", "delete", "create"],
  //           },
  //           {
  //             permissionId: 2,
  //             name: "User",
  //             description: "User management",
  //             subPermissions: ["edit", "view", "delete", "create"],
  //           },
  //           {
  //             permissionId: 3,
  //             name: "Product",
  //             description: "Product management",
  //             subPermissions: ["edit", "view", "delete", "create"],
  //           },
  //           {
  //             permissionId: 4,
  //             name: "Order",
  //             description: "Order management",
  //             subPermissions: ["edit", "view", "delete", "create"],
  //           },
  //           {
  //             permissionId: 5,
  //             name: "Inventory",
  //             description: "Inventory management",
  //             subPermissions: ["edit", "view", "delete", "create"],
  //           },
  //         ],
  //       },
  //       accessToken:
  //         "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W10sInRva2VuX3R5cGUiOiJBQ0NFU1MiLCJ1c2VySWQiOjEsInN1YiI6InN1cGVyYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3NTE0NjEyNDksImV4cCI6MTc1MTU0NzY0OX0.ydKUk__eSq4Hj3xVd6uM2kjcTMuJ1s2cu7vahjhfz2U",
  //       refreshToken:
  //         "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W10sInRva2VuX3R5cGUiOiJSRUZSRVNIIiwic3ViIjoic3VwZXJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTc1MTQ2MTI0OSwiZXhwIjoxNzUxNDgyODQ5fQ.BkYzjF4OrPrkqXeHIC6nPa6mXtXp9Wkghuz1S4v8lGs",
  //       isPasswordChangedForTheFirstTime: false,
  //     }

  //     login(mockResponse)
  //     router.push("/dashboard")
  //   } catch (err: any) {
  //     setError(err.response?.data?.message || "Invalid credentials")
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const onSubmit = async (data: SignInFormData) => {
    console.log("Form submitted with data:", data)
    setLoading(true)

    try {
      console.log("Calling sign-in API...")
      const response = await authAPI.signIn({
        email: data.email,
        password: data.password,
      })

      console.log("API Response:", response)

      if (response.status === 200) {
        const result = response.data

        // Set user data
        const userData = {
          userId: result.userId,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          roleResponseDto: result.roleResponseDto,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        }

        login(response.data.results[0])

        // Check if password needs to be changed
        // if (!result.isPasswordChangedForTheFirstTime) {
        //   toast({
        //     title: "Password Change Required",
        //     description: "Please change your password for security.",
        //     variant: "destructive",
        //   })
        //   router.push("/change-password")
        // } else {
          router.push("/")
        // }
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error: any) {
      console.error("Login error:", error)

      let errorMessage = "Invalid email or password. Please try again."

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status === 401) {
        errorMessage = "Invalid credentials. Please check your email and password."
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later."
      } else if (error.message === "Network Error") {
        errorMessage = "Network error. Please check your connection and try again."
      }

      // toast({
      //   title: "Login Failed",
      //   description: errorMessage,
      //   variant: "destructive",
      // })
    } finally {
      setLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't show login form if already authenticated
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@example.com" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" {...register("password")} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/auth/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
