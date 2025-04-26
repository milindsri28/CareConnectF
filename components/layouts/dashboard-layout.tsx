"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Mic, Bell, MessageSquare, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import Footer from "@/components/footer"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Fetch current user data when component is mounted on the client
  useEffect(() => {
    setMounted(true) // Set mounted state to true once the component is mounted on the client

    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/users/me")
        if (response.ok) {
          const data = await response.json()
          setCurrentUser(data)
        }
      } catch (error) {
        console.error("Error fetching current user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrentUser()
  }, [])

  // Avoid hydration error: Don't render anything on the first render (server render)
  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen" style={{ colorScheme: "light" }}>
      <header className="bg-white py-2 px-4 md:px-8 lg:px-16 border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-[#0172af] text-xl font-bold">
              Care Connect
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/settings" className="text-gray-600 hover:text-[#0172af] text-sm">
                Settings & Privacy
              </Link>
              <Link href="/help" className="text-gray-600 hover:text-[#0172af] text-sm">
                Help
              </Link>
              <Link href="/posts" className="text-gray-600 hover:text-[#0172af] text-sm">
                Posts & Activity
              </Link>
              <Link href="https://development.d26x7qxbnno29w.amplifyapp.com/" className="text-gray-600 hover:text-[#0172af] text-sm">
                PadhAI Teacher
              </Link>
              <Link href="https://development.d1ro0xxzgk6h7x.amplifyapp.com/" className="text-gray-600 hover:text-[#0172af] text-sm">
                PadhAI Student
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Input
                type="search"
                placeholder="Search any keywords"
                className="w-64 rounded-full bg-[#f0f7fa] border-0 pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Mic className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <button className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                1
              </span>
            </button>
            <button>
              <MessageSquare className="w-6 h-6 text-gray-600" />
            </button>
            <Link href="/connections" className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-gray-600"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                3
              </span>
            </Link>
            <Link href="/profile/me">
              {currentUser?.profileImage ? (
                <Image
                  src={currentUser.profileImage}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  )
}
