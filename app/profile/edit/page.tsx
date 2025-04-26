"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import { ProfileEdit } from "@/components/profile-edit"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  profileImage?: string
  role?: string
  specialty?: string
  hospital?: string
  bio?: string
}

export default function EditProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/users/me")
        if (!response.ok) {
          throw new Error("Failed to fetch current user")
        }
        const data = await response.json()
        setCurrentUser(data)
      } catch (error) {
        console.error("Error fetching current user:", error)
        // Don't show error to user
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrentUser()
  }, [])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0172af]"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!currentUser) {
    router.push("/login")
    return null
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
        <ProfileEdit user={currentUser} />
      </div>
    </DashboardLayout>
  )
}

