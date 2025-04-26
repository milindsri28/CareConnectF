"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Pencil, MapPin, Plus, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import { toast } from "@/components/ui/use-toast"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  profileImage?: string
  role?: string
  specialty?: string
  hospital?: string
  location?: string
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("posts")
  const [user, setUser] = useState<User | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false)
  const [posts, setPosts] = useState<any[]>([])
  const [connections, setConnections] = useState<any[]>([])
  const [connectionCount, setConnectionCount] = useState(0)
  const [experiences, setExperiences] = useState<any[]>([])
  const [education, setEducation] = useState<any[]>([])
  const [userConnections, setUserConnections] = useState<any[]>([])

  // Fetch the profile user data
  useEffect(() => {
    const fetchProfileUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch user profile")
        }
        const data = await response.json()
        setUser(data)

        // Fetch posts and connections for this user
        fetchUserPosts(params.id)
        fetchUserConnections(params.id)
      } catch (error) {
        console.error("Error fetching user profile:", error)
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again.",
          variant: "destructive",
        })
      }
    }

    // Fetch current user to determine if this is the current user's profile
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/users/me")
        if (!response.ok) {
          throw new Error("Failed to fetch current user")
        }
        const data = await response.json()
        setCurrentUser(data)

        // Check if the profile being viewed is the current user's profile
        if (data._id === params.id) {
          setIsCurrentUserProfile(true)
        }
      } catch (error) {
        console.error("Error fetching current user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileUser()
    fetchCurrentUser()
  }, [params.id])

  // Fetch user's posts
  const fetchUserPosts = async (userId: string) => {
    try {
      const response = await fetch(`/api/posts?userId=${userId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch user posts")
      }
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error("Error fetching user posts:", error)
      setPosts([])
    }
  }

  // Fetch user's connections
  const fetchUserConnections = async (userId: string) => {
    try {
      const response = await fetch(`/api/connections?status=accepted`)
      if (!response.ok) {
        throw new Error("Failed to fetch connections")
      }
      const data = await response.json()

      // Filter connections related to this user
      const userConnections = data.connections.filter((connection: any) => {
        return connection.requesterId === userId || connection.recipientId === userId
      })

      setConnections(userConnections)
      setConnectionCount(userConnections.length)

      // Get the actual user objects for connections
      const connectionUsers = userConnections.map((connection: any) => {
        // If the current user is the requester, return the recipient, otherwise return the requester
        return connection.requesterId === userId ? connection.recipient : connection.requester
      })

      setUserConnections(connectionUsers)
    } catch (error) {
      console.error("Error fetching connections:", error)
      setConnections([])
      setConnectionCount(0)
      setUserConnections([])
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0172af]"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">User Not Found</h2>
            <p className="text-gray-600">The user profile you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#0172af] to-[#34a353] h-32 relative">
        <div className="absolute bottom-0 left-8 transform translate-y-1/2">
          <div className="relative">
            <Image
              src={user.profileImage || "/images/doctor-profile.png"}
              alt={`${user.firstName} ${user.lastName}`}
              width={100}
              height={100}
              className="rounded-full border-4 border-white"
            />
            {isCurrentUserProfile && (
              <Link href="/profile/edit">
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
                  <Pencil className="w-4 h-4 text-gray-600" />
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 px-8">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-xl font-bold">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600">{user.specialty || "Medical Professional"}</p>
            <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" /> {user.location || user.hospital || "Location not specified"}
              {isCurrentUserProfile && (
                <Link href="/contact" className="text-[#0172af] ml-2">
                  Contact Info
                </Link>
              )}
            </p>
            <p className="text-gray-500 text-sm mt-1">{connectionCount} connections</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {isCurrentUserProfile ? (
              <>
                <Button className="bg-[#0172af] hover:bg-[#015d8c] rounded-full">Open to</Button>
                <Button variant="outline" className="rounded-full border-[#0172af] text-[#0172af]">
                  Add Profile Section
                </Button>
                <Button variant="outline" className="rounded-full border-[#0172af] text-[#0172af]">
                  More
                </Button>
              </>
            ) : (
              <>
                <Button className="bg-[#0172af] hover:bg-[#015d8c] rounded-full">Connect</Button>
                <Button variant="outline" className="rounded-full border-[#0172af] text-[#0172af]">
                  Message
                </Button>
              </>
            )}
          </div>
        </div>

        {isCurrentUserProfile && (
          <div className="mt-4 p-4 bg-[#f0f7fa] rounded-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Geolocation</h2>
              <div className="flex items-center">
                <div className="w-10 h-5 bg-[#0172af] rounded-full relative">
                  <div className="absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Address</p>
          </div>
        )}

        {/* Analytics Section - Only show for current user */}
        {isCurrentUserProfile && (
          <div className="mt-6 p-6 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">Analytics</h2>
              <Button variant="ghost" size="sm" className="text-[#0172af]">
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Private to you</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-2">
                <div className="p-2 bg-gray-100 rounded-full">
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
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">210 profile views</p>
                  <p className="text-xs text-gray-500">Discover who's viewed your profile</p>
                  <p className="text-xs text-gray-400 mt-1">Past 7 days</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="p-2 bg-gray-100 rounded-full">
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
                    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">30 posts impression</p>
                  <p className="text-xs text-gray-500">Check out who's engaging with your posts</p>
                  <p className="text-xs text-gray-400 mt-1">Past 7 days</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="p-2 bg-gray-100 rounded-full">
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
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">30 search appearances</p>
                  <p className="text-xs text-gray-500">See how often you appear in search results</p>
                  <p className="text-xs text-gray-400 mt-1">Past 7 days</p>
                </div>
              </div>
            </div>

            <Button variant="link" className="text-[#0172af] mt-4 px-0">
              Show all analytics <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* About Section */}
        <div className="mt-6 p-6 border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">About</h2>
            {isCurrentUserProfile && (
              <Button variant="ghost" size="sm" className="text-[#0172af]">
                <Pencil className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className="text-sm">
            {user.specialty || "Medical Professional"} | {user.hospital || "Hospital/Institution not specified"}
          </p>
        </div>

        {/* Activity Section */}
        <div className="mt-6 p-6 border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Activity</h2>
            {isCurrentUserProfile && (
              <Button variant="ghost" size="sm" className="text-[#0172af]">
                <Pencil className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-4">{connectionCount} connections</p>

          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="space-y-6">
              {posts.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No posts by this user</p>
              ) : (
                posts.map((post) => (
                  <div key={post._id} className="border-b pb-4">
                    <div className="flex items-start gap-2 mb-2">
                      <Image
                        src={user.profileImage || "/images/doctor-profile.png"}
                        alt={`${user.firstName} ${user.lastName}`}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">
                            {user.firstName} {user.lastName}
                          </span>{" "}
                          posted •{" "}
                          <span className="text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-sm mb-2">
                      {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
                    </p>
                    {post.content.length > 200 && <p className="text-sm text-gray-500 text-right">... show more</p>}

                    {post.images && post.images.length > 0 && (
                      <div className="mt-4 flex gap-4">
                        <div className="border rounded p-2 flex-shrink-0">
                          <Image
                            src={post.images[0] || "/placeholder.svg"}
                            alt="Post image"
                            width={100}
                            height={140}
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center mt-2">
                      <div className="flex -space-x-1">
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                          👍
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 ml-1">{post.likes?.length || 0} likes</span>
                      <span className="text-xs text-gray-500 ml-auto">{post.comments?.length || 0} comments</span>
                    </div>
                  </div>
                ))
              )}

              {posts.length > 0 && (
                <Button variant="link" className="text-[#0172af] px-0">
                  Show Activity <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </TabsContent>
            <TabsContent value="comments">
              <p className="text-sm text-gray-500">No comments to show</p>
            </TabsContent>
            <TabsContent value="documents">
              <p className="text-sm text-gray-500">No documents to show</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Experience Section */}
        <div className="mt-6 p-6 border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Experience</h2>
            {isCurrentUserProfile && (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-[#0172af]">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-[#0172af]">
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {user.hospital ? (
            <div className="flex gap-4 mb-6">
              <Image src="/images/hospital-1.png" alt={user.hospital} width={60} height={60} className="rounded" />
              <div>
                <h3 className="font-medium">{user.role || "Medical Professional"}</h3>
                <p className="text-sm text-gray-600">
                  {user.hospital} • {user.specialty || "Healthcare"}
                </p>
                <p className="text-xs text-gray-500">{user.location || "Location not specified"}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-4">No experience information available</p>
          )}
        </div>

        {/* Education Section */}
        <div className="mt-6 p-6 border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Education</h2>
            {isCurrentUserProfile && (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-[#0172af]">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-[#0172af]">
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {user.specialty ? (
            <div className="flex gap-4 mb-6">
              <Image
                src="/images/university-1.png"
                alt="Medical Education"
                width={60}
                height={60}
                className="rounded"
              />
              <div>
                <h3 className="font-medium">{user.specialty}</h3>
                <p className="text-sm text-gray-600">Medical Education</p>
                <p className="text-xs text-gray-500">{user.location || "Location not specified"}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-4">No education information available</p>
          )}
        </div>

        {/* Connections Section */}
        <div className="mt-6 mb-8 p-6 border rounded-lg">
          <h2 className="font-medium mb-4">Connections</h2>

          <div className="space-y-4">
            <div className="flex gap-2 items-center">
              <Button variant="outline" size="sm" className="rounded-full text-xs">
                All Connections
              </Button>
              <Button variant="outline" size="sm" className="rounded-full text-xs">
                Recent
              </Button>
            </div>

            {userConnections.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">No connections to show</p>
            ) : (
              userConnections.slice(0, 2).map((connection: any) => (
                <div key={connection._id} className="flex gap-4 items-center">
                  <Image
                    src={connection.profileImage || "/images/user-avatar.png"}
                    alt={`${connection.firstName} ${connection.lastName}`}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {connection.firstName} {connection.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {connection.specialty || connection.role || "Medical Professional"} -{" "}
                      {connection.hospital || "Hospital not specified"}
                    </p>
                  </div>
                  <Button size="sm" className="rounded-full bg-[#0172af] hover:bg-[#015d8c]">
                    Connected
                  </Button>
                </div>
              ))
            )}
          </div>

          {userConnections.length > 2 && (
            <Button variant="link" className="text-[#0172af] mt-4 px-0">
              Show all connections <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

