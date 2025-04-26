"use client"

import { useState, useEffect } from "react"
import { Search, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import { ConnectionCard } from "@/components/connection-card"
import { toast } from "@/components/ui/use-toast"

interface Connection {
  _id: string
  requesterId: string
  recipientId: string
  status: "pending" | "accepted" | "rejected"
  createdAt: string
  updatedAt: string
  requester: {
    _id: string
    firstName: string
    lastName: string
    profileImage?: string
    role?: string
    hospital?: string
    specialty?: string
  }
  recipient: {
    _id: string
    firstName: string
    lastName: string
    profileImage?: string
    role?: string
    hospital?: string
    specialty?: string
  }
}

interface User {
  _id: string
  firstName: string
  lastName: string
  profileImage?: string
  role?: string
  hospital?: string
  specialty?: string
}

export default function ConnectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [connections, setConnections] = useState<Connection[]>([])
  const [pendingConnections, setPendingConnections] = useState<Connection[]>([])
  const [suggestions, setSuggestions] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
      toast({
        title: "Error",
        description: "Failed to load user data. Please refresh the page.",
        variant: "destructive",
      })
    }
  }

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

  const fetchSuggestions = async () => {
    try {
      const response = await fetch("/api/users?limit=10")
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

  useEffect(() => {
    fetchCurrentUser()
    fetchConnections()
    fetchPendingConnections()
    fetchSuggestions()
  }, [])

  const refreshData = () => {
    fetchConnections()
    fetchPendingConnections()
    fetchSuggestions()
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Connections</h1>
            <p className="text-gray-600">Manage your professional network</p>
          </div>
          <Button className="bg-[#0172af] hover:bg-[#015d8c] flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add Connections
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search connections by name or role"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              className={filterType === "all" ? "bg-[#0172af] hover:bg-[#015d8c]" : ""}
              onClick={() => setFilterType("all")}
            >
              All
            </Button>
            <Button
              variant={filterType === "recent" ? "default" : "outline"}
              className={filterType === "recent" ? "bg-[#0172af] hover:bg-[#015d8c]" : ""}
              onClick={() => setFilterType("recent")}
            >
              Recent
            </Button>
            <Button
              variant={filterType === "mutual" ? "default" : "outline"}
              className={filterType === "mutual" ? "bg-[#0172af] hover:bg-[#015d8c]" : ""}
              onClick={() => setFilterType("mutual")}
            >
              Mutual
            </Button>
          </div>
        </div>

        {/* Tabs for Connections, Pending, and Suggestions */}
        <Tabs defaultValue="connections" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="connections">Your Connections</TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              {pendingConnections.length > 0 && (
                <Badge className="ml-2 bg-[#0172af]">{pendingConnections.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="connections" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0172af]"></div>
              </div>
            ) : connections.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <h3 className="font-medium mb-2">No connections yet</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Start building your professional network by connecting with colleagues and peers
                  </p>
                  <Button className="bg-[#0172af] hover:bg-[#015d8c]">Find People to Connect</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connections.map((connection) => {
                  const isCurrentUserRequester = connection.requesterId === currentUser?._id
                  const connectionUser = isCurrentUserRequester ? connection.recipient : connection.requester

                  return (
                    <ConnectionCard
                      key={connection._id}
                      _id={connection._id}
                      user={connectionUser}
                      mutualConnections={5} // This would need to be calculated on the backend
                      status="accepted"
                      onAction={refreshData}
                    />
                  )
                })}
              </div>
            )}

            {connections.length > 0 && (
              <Button variant="outline" className="w-full">
                Load More Connections
              </Button>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0172af]"></div>
              </div>
            ) : pendingConnections.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <h3 className="font-medium mb-2">No pending connection requests</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    When someone sends you a connection request, it will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingConnections.map((connection) => {
                const isCurrentUserRequester = connection.requesterId === currentUser?._id
                const connectionUser = isCurrentUserRequester ? connection.recipient : connection.requester

                return (
                  <ConnectionCard
                    key={connection._id}
                    _id={connection._id}
                    user={connectionUser}
                    mutualConnections={3} // This would need to be calculated on the backend
                    status="pending"
                    isRequester={isCurrentUserRequester}
                    onAction={refreshData}
                  />
                )
              })
            )}
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0172af]"></div>
              </div>
            ) : suggestions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <h3 className="font-medium mb-2">No suggestions available</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    We'll show you connection suggestions as you grow your network
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((user) => (
                  <ConnectionCard
                    key={user._id}
                    user={user}
                    mutualConnections={Math.floor(Math.random() * 10)} // Random number for demo
                    status="suggestion"
                    onAction={refreshData}
                  />
                ))}
              </div>
            )}

            {suggestions.length > 0 && (
              <Button variant="outline" className="w-full">
                View More Suggestions
              </Button>
            )}
          </TabsContent>
        </Tabs>

        {/* Network Statistics */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Your Network Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#0172af]">{connections.length}</span>
                <span className="text-sm text-gray-500">Total Connections</span>
                <span className="text-xs text-green-500 mt-1">↑ 12% from last month</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#0172af]">43</span>
                <span className="text-sm text-gray-500">Profile Views from Network</span>
                <span className="text-xs text-green-500 mt-1">↑ 8% from last month</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#0172af]">12</span>
                <span className="text-sm text-gray-500">New Connections This Month</span>
                <span className="text-xs text-green-500 mt-1">↑ 5% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

