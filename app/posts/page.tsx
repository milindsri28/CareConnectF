"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Calendar, ThumbsUp, MessageCircle, Share, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import DashboardLayout from "@/components/layouts/dashboard-layout"
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

interface Activity {
  id: number
  type: "like" | "comment" | "share" | "connection"
  content: string
  timeAgo: string
}

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])

  const fetchPosts = async () => {
    try {
      // Fetch user's posts
      const response = await fetch(`/api/posts?userId=${currentUser?._id}`)
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

  // Sample activities - in a real app, these would come from the API
  const fetchActivities = () => {
    setActivities([
      {
        id: 1,
        type: "like",
        content: "You liked Dr. Richa Sharma's post about Digital Technologies in Healthcare",
        timeAgo: "5 min",
      },
      {
        id: 2,
        type: "comment",
        content: "You commented on Dr. P.C. Joseph's article about Brain Stroke Research",
        timeAgo: "30 min",
      },
      {
        id: 3,
        type: "share",
        content: "You shared Dr. Pooja K H's post about her internship completion",
        timeAgo: "1 day",
      },
      {
        id: 4,
        type: "connection",
        content: "You connected with Dr. Amit Patel, Cardiologist at Max Healthcare",
        timeAgo: "2 days",
      },
    ])
  }

  useEffect(() => {
    fetchCurrentUser()
    fetchActivities()
  }, [])

  useEffect(() => {
    if (currentUser) {
      fetchPosts()
    }
  }, [currentUser])

  const handlePostDeleted = () => {
    fetchPosts()
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-8 bg-[#f0f7fa] min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Posts & Activity</h1>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search your posts and activity"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </Button>
          </div>
        </div>

        {/* Create New Post */}
        {currentUser && (
          <CreatePost userImage={currentUser.profileImage || "/images/user-avatar.png"} onPostCreated={fetchPosts} />
        )}

        {/* Tabs for Posts and Activity */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="posts">Your Posts</TabsTrigger>
            <TabsTrigger value="activity">Your Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0172af]"></div>
              </div>
            ) : posts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <h3 className="font-medium mb-2">No posts yet</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Share your thoughts, articles, or updates with your network
                  </p>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  {...post}
                  currentUserId={currentUser?._id || ""}
                  onDelete={handlePostDeleted}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            {activities.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f0f7fa] flex items-center justify-center text-[#0172af]">
                    {activity.type === "like" && <ThumbsUp className="w-5 h-5" />}
                    {activity.type === "comment" && <MessageCircle className="w-5 h-5" />}
                    {activity.type === "share" && <Share className="w-5 h-5" />}
                    {activity.type === "connection" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.content}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.timeAgo} ago</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                  </Button>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" className="w-full mt-4">
              Load More Activity
            </Button>
          </TabsContent>
        </Tabs>

        {/* Analytics */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Post Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#0172af]">156</span>
                <span className="text-sm text-gray-500">Post Views (Last 30 days)</span>
                <span className="text-xs text-green-500 mt-1">↑ 12% from last month</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#0172af]">43</span>
                <span className="text-sm text-gray-500">Engagements (Last 30 days)</span>
                <span className="text-xs text-green-500 mt-1">↑ 8% from last month</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#0172af]">12</span>
                <span className="text-sm text-gray-500">New Profile Views from Posts</span>
                <span className="text-xs text-green-500 mt-1">↑ 5% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

