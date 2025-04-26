"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { CreatePost } from "@/components/create-post"
import { PostCard } from "@/components/post-card"
import { toast } from "@/components/ui/use-toast"

interface Post {
  _id: string
  content: string
  images?: string[]
  likes?: string[]
  comments?: any[]
  createdAt: string
  updatedAt: string
  user: {
    _id: string
    firstName: string
    lastName: string
    profileImage?: string
    role?: string
    hospital?: string
    specialty?: string
  }
}

interface CurrentUser {
  _id: string
  firstName: string
  lastName: string
  profileImage?: string
  role?: string
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts")
      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }
      const data = await response.json()
      setPosts(data.posts)
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast({
        title: "Error",
        description: "Failed to load posts. Please refresh the page.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
    }
  }

  useEffect(() => {
    fetchCurrentUser()
    fetchPosts()
  }, [])

  const handlePostDeleted = () => {
    fetchPosts()
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
        {/* Left Column - User Profile */}
        <div className="md:col-span-1">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-[#0172af] to-[#34a353] p-4 text-white">
              <div className="flex justify-center">
                <Image
                  src={currentUser?.profileImage || "/images/user-avatar.png"}
                  alt="User Avatar"
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-white"
                />
              </div>
              <h2 className="text-center font-bold mt-2">
                {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Loading..."}
              </h2>
              <p className="text-center text-sm">{currentUser?.role || "Medical Professional"}</p>
            </div>
            <div className="p-4 flex justify-center">
              <Link href="/profile/edit">
                <Button className="bg-gradient-to-r from-[#0172af] to-[#34a353] text-white rounded-full">
                  Edit Profile
                </Button>
              </Link>
            </div>
            <div className="p-4">
              <nav className="space-y-4">
                <Link href="/dashboard" className="flex items-center gap-2 text-[#545454] font-medium">
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
                    className="w-5 h-5"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  Dashboard
                </Link>
                <Link href="/reminders" className="flex items-center gap-2 text-[#545454] font-medium">
                  <Clock className="w-5 h-5" />
                  Reminders
                </Link>
                <Link href="/applications" className="flex items-center gap-2 text-[#545454] font-medium">
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
                    className="w-5 h-5"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  Applications
                </Link>
                <Link href="/settings" className="flex items-center gap-2 text-[#545454] font-medium">
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
                    className="w-5 h-5"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  Settings
                </Link>
              </nav>
            </div>
            <div className="p-4 bg-gradient-to-r from-[#0172af] to-[#34a353] text-white">
              <h3 className="font-medium mb-2">Refine your Profile</h3>
              <p className="text-sm mb-4">Enrich your profile and benefit from better visibility on the platform</p>
              <div className="w-full bg-white/20 h-2 rounded-full">
                <div className="bg-white h-2 rounded-full w-[60%]"></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>60%</span>
                <span>100%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Middle Column - Feed */}
        <div className="md:col-span-1">
          {/* Carousel */}
          <Card className="mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0172af] to-[#34a353] p-6 text-white relative">
              <h2 className="text-xl font-bold mb-2">Discover your Dream Job with CareConnect</h2>
              <p className="text-sm mb-4">
                Don't let your career dreams remain dreams; turn them into reality with our product and discover your
                dream job today.
              </p>
              <Button className="bg-white text-[#0172af] hover:bg-white/90 rounded-full">Discover</Button>
              <div className="absolute bottom-2 right-2">
                <Image src="/images/job-discovery.png" alt="Job Discovery" width={100} height={100} />
              </div>
              <div className="flex justify-center gap-1 mt-4">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <div className="w-2 h-2 rounded-full bg-white/60"></div>
                <div className="w-2 h-2 rounded-full bg-white/60"></div>
              </div>
            </div>
          </Card>

          {/* Create Post Section */}
          {currentUser && <CreatePost />}

          {/* Post Feed */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center">Loading posts...</div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post._id} {...post} currentUserId={currentUser?._id || ""} onDelete={handlePostDeleted} />
              ))
            ) : (
              <div className="text-center">No posts yet.</div>
            )}
          </div>
        </div>

        {/* Right Column - Post Stats (if any) */}
        <div className="md:col-span-1">
          <Card className="overflow-hidden">
            <CardContent>
              {/* Stats and other content */}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
