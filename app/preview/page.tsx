"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { FileUpload } from "@/components/file-upload"
import { createPost, likePost } from "@/lib/actions/post-actions"
import { sendConnectionRequest } from "@/lib/actions/connection-actions"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, MessageCircle, Share, UserPlus, Clock, MapPin } from "lucide-react"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  profileImage?: string
  role?: string
  specialty?: string
  hospital?: string
}

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

interface Job {
  _id: string
  title: string
  company: string
  location: string
  type: string
  experience: string
  createdAt: string
}

interface Connection {
  _id: string
  requesterId: string
  recipientId: string
  status: string
  createdAt: string
  requester: User
  recipient: User
}

export default function PreviewPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [pendingConnections, setPendingConnections] = useState<Connection[]>([])
  const [suggestions, setSuggestions] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [postContent, setPostContent] = useState("")
  const [postImage, setPostImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/users/me")
      if (!response.ok) {
        throw new Error("Failed to fetch current user")
      }
      const data = await response.json()
      setCurrentUser(data)
      return data
    } catch (error) {
      console.error("Error fetching current user:", error)
      toast({
        title: "Error",
        description: "Failed to load user data. Please refresh the page.",
        variant: "destructive",
      })
      return null
    }
  }

  // Fetch posts
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
    }
  }

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs")
      if (!response.ok) {
        throw new Error("Failed to fetch jobs")
      }
      const data = await response.json()
      setJobs(data.jobs)
    } catch (error) {
      console.error("Error fetching jobs:", error)
      toast({
        title: "Error",
        description: "Failed to load jobs. Please refresh the page.",
        variant: "destructive",
      })
    }
  }

  // Fetch connections
  const fetchConnections = async () => {
    try {
      const response = await fetch("/api/connections?status=accepted")
      if (!response.ok) {
        throw new Error("Failed to fetch connections")
      }
      const data = await response.json()
      setConnections(data.connections)
    } catch (error) {
      console.error("Error fetching connections:", error)
      toast({
        title: "Error",
        description: "Failed to load connections. Please refresh the page.",
        variant: "destructive",
      })
    }
  }

  // Fetch pending connections
  const fetchPendingConnections = async () => {
    try {
      const response = await fetch("/api/connections?status=pending")
      if (!response.ok) {
        throw new Error("Failed to fetch pending connections")
      }
      const data = await response.json()
      setPendingConnections(data.connections)
    } catch (error) {
      console.error("Error fetching pending connections:", error)
      toast({
        title: "Error",
        description: "Failed to load pending connections. Please refresh the page.",
        variant: "destructive",
      })
    }
  }

  // Fetch user suggestions
  const fetchSuggestions = async () => {
    try {
      const response = await fetch("/api/users?limit=5")
      if (!response.ok) {
        throw new Error("Failed to fetch user suggestions")
      }
      const data = await response.json()
      setSuggestions(data.users)
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      toast({
        title: "Error",
        description: "Failed to load suggestions. Please refresh the page.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load all data
  useEffect(() => {
    const loadData = async () => {
      const user = await fetchCurrentUser()
      if (user) {
        fetchPosts()
        fetchJobs()
        fetchConnections()
        fetchPendingConnections()
        fetchSuggestions()
      }
    }

    loadData()
  }, [])

  // Handle post creation
  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      toast({
        title: "Error",
        description: "Post content cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("content", postContent)
      formData.append("visibility", "public")

      if (postImage) {
        formData.append("images", postImage)
      }

      const result = await createPost(formData)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Post created successfully",
        })
        setPostContent("")
        setPostImage(null)
        fetchPosts()
      }
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle like post
  const handleLikePost = async (postId: string) => {
    try {
      const result = await likePost(postId)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        fetchPosts()
      }
    } catch (error) {
      console.error("Error liking post:", error)
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle send connection request
  const handleConnect = async (userId: string) => {
    try {
      const result = await sendConnectionRequest(userId)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Connection request sent successfully",
        })
        fetchSuggestions()
      }
    } catch (error) {
      console.error("Error sending connection request:", error)
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white py-4 px-6 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-[#0172af] text-2xl font-bold">
            Care Connect
          </Link>
          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <span className="text-sm text-gray-600">Welcome, {currentUser.firstName}</span>
                <Image
                  src={currentUser.profileImage || "/images/user-avatar.png"}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <Link href="/api/auth/logout">
                  <Button variant="outline" size="sm">
                    Logout
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#0172af]" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">CareConnect Platform Preview</h1>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0172af]"></div>
          </div>
        ) : !currentUser ? (
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Please Login to See the Full Preview</h2>
              <p className="mb-6">Login or create an account to experience all features of CareConnect</p>
              <div className="flex justify-center gap-4">
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#0172af]">Sign Up</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent value="posts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create a Post</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="What's on your mind?"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="min-h-[100px]"
                    />

                    {postImage && (
                      <div className="relative inline-block">
                        <Image
                          src={postImage || "/placeholder.svg"}
                          alt="Post image"
                          width={200}
                          height={200}
                          className="rounded-md object-cover"
                        />
                        <button
                          onClick={() => setPostImage(null)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <FileUpload onUpload={(url) => setPostImage(url)} accept="image/*" />
                      <Button className="bg-[#0172af]" onClick={handleCreatePost} disabled={isSubmitting}>
                        {isSubmitting ? "Posting..." : "Post"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {posts.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="font-medium mb-2">No posts yet</h3>
                    <p className="text-sm text-gray-500 mb-4">Be the first to share something with the community</p>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <Card key={post._id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-4">
                        <Image
                          src={post.user.profileImage || "/images/user-avatar.png"}
                          alt={`${post.user.firstName} ${post.user.lastName}`}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div>
                          <h3 className="font-medium">
                            {post.user.firstName} {post.user.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {post.user.specialty ? `${post.user.specialty}` : ""}
                            {post.user.hospital && post.user.specialty
                              ? ` - ${post.user.hospital}`
                              : post.user.hospital || post.user.role || ""}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm whitespace-pre-line">{post.content}</p>
                      </div>

                      {post.images && post.images.length > 0 && (
                        <div className="mb-4">
                          <Image
                            src={post.images[0] || "/placeholder.svg"}
                            alt="Post image"
                            width={600}
                            height={400}
                            className="w-full h-auto rounded-md"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500 py-2 border-t border-b">
                        <div className="flex items-center gap-1">
                          <div className="flex -space-x-1">
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                              👍
                            </div>
                          </div>
                          <span>{post.likes?.length || 0} likes</span>
                        </div>
                        <div className="flex gap-4">
                          <span>{post.comments?.length || 0} comments</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`flex-1 flex items-center justify-center gap-1 ${post.likes?.includes(currentUser._id) ? "text-blue-500" : "text-gray-500"}`}
                          onClick={() => handleLikePost(post._id)}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          {post.likes?.includes(currentUser._id) ? "Liked" : "Like"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 flex items-center justify-center gap-1 text-gray-500"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Comment
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 flex items-center justify-center gap-1 text-gray-500"
                        >
                          <Share className="w-4 h-4" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Connections Tab */}
            <TabsContent value="connections" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Connections ({connections.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {connections.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">No connections yet</p>
                    ) : (
                      <div className="space-y-4">
                        {connections.map((connection) => {
                          const isCurrentUserRequester = connection.requesterId === currentUser._id
                          const connectionUser = isCurrentUserRequester ? connection.recipient : connection.requester

                          return (
                            <div key={connection._id} className="flex items-center gap-3 p-2 border rounded-md">
                              <Image
                                src={connectionUser.profileImage || "/images/user-avatar.png"}
                                alt={`${connectionUser.firstName} ${connectionUser.lastName}`}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                              <div className="flex-1">
                                <h3 className="font-medium">
                                  {connectionUser.firstName} {connectionUser.lastName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {connectionUser.specialty || connectionUser.role || "Medical Professional"}
                                </p>
                              </div>
                              <Button variant="outline" size="sm">
                                Message
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Suggested Connections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {suggestions.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">No suggestions available</p>
                    ) : (
                      <div className="space-y-4">
                        {suggestions.map((user) => (
                          <div key={user._id} className="flex items-center gap-3 p-2 border rounded-md">
                            <Image
                              src={user.profileImage || "/images/user-avatar.png"}
                              alt={`${user.firstName} ${user.lastName}`}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium">
                                {user.firstName} {user.lastName}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {user.specialty || user.role || "Medical Professional"}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              className="bg-[#0172af] flex items-center gap-1"
                              onClick={() => handleConnect(user._id)}
                            >
                              <UserPlus className="w-3 h-3" />
                              Connect
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {pendingConnections.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Connections ({pendingConnections.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingConnections.map((connection) => {
                        const isCurrentUserRequester = connection.requesterId === currentUser._id
                        const connectionUser = isCurrentUserRequester ? connection.recipient : connection.requester

                        return (
                          <div key={connection._id} className="flex items-center gap-3 p-2 border rounded-md">
                            <Image
                              src={connectionUser.profileImage || "/images/user-avatar.png"}
                              alt={`${connectionUser.firstName} ${connectionUser.lastName}`}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium">
                                {connectionUser.firstName} {connectionUser.lastName}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {connectionUser.specialty || connectionUser.role || "Medical Professional"}
                              </p>
                            </div>
                            {isCurrentUserRequester ? (
                              <Button variant="outline" size="sm" disabled>
                                Pending
                              </Button>
                            ) : (
                              <div className="flex gap-2">
                                <Button size="sm" className="bg-[#0172af]">
                                  Accept
                                </Button>
                                <Button variant="outline" size="sm">
                                  Ignore
                                </Button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Jobs Tab */}
            <TabsContent value="jobs" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Available Jobs</h2>
                <Button className="bg-[#0172af]">Post a Job</Button>
              </div>

              {jobs.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="font-medium mb-2">No jobs available</h3>
                    <p className="text-sm text-gray-500 mb-4">Be the first to post a job opportunity</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <Card key={job._id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <h2 className="text-lg font-medium text-[#0172af]">{job.title}</h2>
                            <p className="text-gray-600">{job.company}</p>
                            <p className="text-gray-500 flex items-center gap-1">
                              <MapPin className="w-4 h-4" /> {job.location}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="bg-[#e6f7ff] text-[#0172af] text-xs px-2 py-1 rounded-full">
                                {job.type}
                              </span>
                              <span className="bg-[#e6f7ff] text-[#0172af] text-xs px-2 py-1 rounded-full">
                                {job.experience}
                              </span>
                              <span className="bg-[#e6f7ff] text-[#0172af] text-xs px-2 py-1 rounded-full">
                                Medical
                              </span>
                            </div>
                            <div className="mt-2 flex items-center text-gray-500 text-sm">
                              <Clock className="w-4 h-4 mr-1" /> Posted {formatDate(job.createdAt)}
                            </div>

                            <div className="mt-4">
                              <Button className="bg-[#0172af] rounded-full">Apply Now</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-full md:w-1/3">
                      <div className="flex flex-col items-center">
                        <Image
                          src={currentUser.profileImage || "/images/user-avatar.png"}
                          alt="Profile"
                          width={150}
                          height={150}
                          className="rounded-full mb-4"
                        />
                        <h2 className="text-xl font-bold">
                          {currentUser.firstName} {currentUser.lastName}
                        </h2>
                        <p className="text-gray-600">
                          {currentUser.specialty || currentUser.role || "Medical Professional"}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">{currentUser.hospital || "Hospital/Institution"}</p>

                        <div className="mt-4 w-full">
                          <Button className="w-full bg-[#0172af]">Edit Profile</Button>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-2/3">
                      <h3 className="text-lg font-semibold mb-4">Profile Information</h3>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">First Name</p>
                            <p className="font-medium">{currentUser.firstName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Last Name</p>
                            <p className="font-medium">{currentUser.lastName}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{currentUser.email}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Specialty</p>
                          <p className="font-medium">{currentUser.specialty || "Not specified"}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Hospital/Institution</p>
                          <p className="font-medium">{currentUser.hospital || "Not specified"}</p>
                        </div>

                        <div className="pt-4 border-t">
                          <h4 className="font-medium mb-2">Account Statistics</h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-gray-50 rounded-md">
                              <p className="text-2xl font-bold text-[#0172af]">{connections.length}</p>
                              <p className="text-sm text-gray-500">Connections</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-md">
                              <p className="text-2xl font-bold text-[#0172af]">
                                {posts.filter((p) => p.user._id === currentUser._id).length}
                              </p>
                              <p className="text-sm text-gray-500">Posts</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-md">
                              <p className="text-2xl font-bold text-[#0172af]">0</p>
                              <p className="text-sm text-gray-500">Applications</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}

