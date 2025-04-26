"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MessageCircle, Mail, UserPlus, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { respondToConnectionRequest, sendConnectionRequest } from "@/lib/actions/connection-actions"
import { toast } from "@/components/ui/use-toast"

interface ConnectionUser {
  _id: string
  firstName: string
  lastName: string
  profileImage?: string
  role?: string
  hospital?: string
  specialty?: string
}

interface ConnectionCardProps {
  _id?: string
  user: ConnectionUser
  mutualConnections?: number
  status?: "pending" | "accepted" | "suggestion"
  isRequester?: boolean
  onAction?: () => void
}

export function ConnectionCard({
  _id,
  user,
  mutualConnections = 0,
  status = "suggestion",
  isRequester = false,
  onAction,
}: ConnectionCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      const result = await sendConnectionRequest(user._id)

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
        if (onAction) onAction()
      }
    } catch (error) {
      console.error("Error sending connection request:", error)
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async () => {
    if (!_id) return

    setIsLoading(true)
    try {
      const result = await respondToConnectionRequest(_id, true)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Connection request accepted",
        })
        if (onAction) onAction()
      }
    } catch (error) {
      console.error("Error accepting connection request:", error)
      toast({
        title: "Error",
        description: "Failed to accept connection request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    if (!_id) return

    setIsLoading(true)
    try {
      const result = await respondToConnectionRequest(_id, false)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Connection request rejected",
        })
        if (onAction) onAction()
      }
    } catch (error) {
      console.error("Error rejecting connection request:", error)
      toast({
        title: "Error",
        description: "Failed to reject connection request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Image
            src={user.profileImage || "/images/user-avatar.png"}
            alt={`${user.firstName} ${user.lastName}`}
            width={64}
            height={64}
            className="rounded-full"
          />
          <div className="flex-1">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">
                  <Link href={`/profile/${user._id}`} className="hover:text-[#0172af]">
                    {user.firstName} {user.lastName}
                  </Link>
                </h3>
                <p className="text-sm text-gray-500">
                  {user.specialty ? `${user.specialty}` : ""}
                  {user.hospital && user.specialty ? ` - ${user.hospital}` : user.hospital || user.role || ""}
                </p>
                <p className="text-xs text-gray-400 mt-1">{mutualConnections} mutual connections</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {status === "suggestion" && (
                <>
                  <Button
                    size="sm"
                    className="rounded-full bg-[#0172af] hover:bg-[#015d8c] flex items-center gap-1"
                    onClick={handleConnect}
                    disabled={isLoading}
                  >
                    <UserPlus className="w-3 h-3" />
                    Connect
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full flex items-center gap-1">
                    <X className="w-3 h-3" />
                    Dismiss
                  </Button>
                </>
              )}

              {status === "pending" && !isRequester && (
                <>
                  <Button
                    size="sm"
                    className="rounded-full bg-[#0172af] hover:bg-[#015d8c] flex items-center gap-1"
                    onClick={handleAccept}
                    disabled={isLoading}
                  >
                    <Check className="w-3 h-3" />
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full flex items-center gap-1"
                    onClick={handleReject}
                    disabled={isLoading}
                  >
                    <X className="w-3 h-3" />
                    Ignore
                  </Button>
                </>
              )}

              {status === "pending" && isRequester && (
                <Button variant="outline" size="sm" className="rounded-full flex items-center gap-1" disabled={true}>
                  Pending
                </Button>
              )}

              {status === "accepted" && (
                <>
                  <Button variant="outline" size="sm" className="rounded-full flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

