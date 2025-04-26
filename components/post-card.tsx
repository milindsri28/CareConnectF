"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ThumbsUp, MessageCircle, Share, MoreHorizontal, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { likePost } from "@/lib/actions/post-actions"
import { toast } from "@/components/ui/use-toast"

interface PostUser {
  _id: string
  firstName: string
  lastName: string
  profileImage?: string
  role?: string
  hospital?: string
  specialty?: string
}

interface PostComment {
  _id: string
  userId: string
  content: string
  createdAt: string
  user?: PostUser
}

interface PostProps {
  _id: string
  content: string
  images?: string[]
  likes?: string[]
  comments?: PostComment[]
  createdAt: string
  updatedAt: string
  user: PostUser
  currentUserId: string
  onDelete?: () => void
}

export function PostCard({
  _id,
  content,
  images,
  likes = [],
  comments = [],
  createdAt,
  user,
  currentUserId,
  onDelete,
}: PostProps) {
  const [isLiked, setIsLiked] = useState(likes.includes(currentUserId))
  const [likeCount, setLikeCount] = useState(likes.length)
  const [isLiking, setIsLiking] = useState(false)
  const [showFullContent, setShowFullContent] = useState(false)

  const MAX_CONTENT_LENGTH = 300
  const shouldTruncate = content.length > MAX_CONTENT_LENGTH && !showFullContent
  const displayContent = shouldTruncate ? content.substring(0, MAX_CONTENT_LENGTH) + "..." : content

  const handleLike = async () => {
    if (isLiking) return

    setIsLiking(true)
    try {
      const result = await likePost(_id)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setIsLiked(result.liked)
        setLikeCount((prev) => (result.liked ? prev + 1 : prev - 1))
      }
    } catch (error) {
      console.error("Error liking post:", error)
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLiking(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/posts/${_id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete post")
      }

      toast({
        title: "Success",
        description: "Post deleted successfully",
      })

      if (onDelete) {
        onDelete()
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="mb-6 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <Link href={`/profile/${user._id}`}>
              <Image
                src={user.profileImage || "/images/user-avatar.png"}
                alt={`${user.firstName} ${user.lastName}`}
                width={48}
                height={48}
                className="rounded-full"
              />
            </Link>
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
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          {currentUserId === user._id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Post</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
                  Delete Post
                </DropdownMenuItem>
                <DropdownMenuItem>Hide from Profile</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="mb-4">
          <p className="text-sm whitespace-pre-line">{displayContent}</p>
          {shouldTruncate && (
            <button onClick={() => setShowFullContent(true)} className="text-sm text-[#0172af] mt-1">
              Read more
            </button>
          )}
        </div>

        {images && images.length > 0 && (
          <div className="mb-4 grid gap-2">
            {images.length === 1 ? (
              <Image
                src={images[0] || "/placeholder.svg"}
                alt="Post image"
                width={600}
                height={400}
                className="w-full h-auto rounded-md"
              />
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {images.slice(0, 4).map((image, index) => (
                  <div key={index} className={`${index >= 2 ? "col-span-1" : ""}`}>
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Post image ${index + 1}`}
                      width={300}
                      height={200}
                      className="w-full h-auto rounded-md"
                    />
                  </div>
                ))}
                {images.length > 4 && (
                  <div className="col-span-2 text-center text-sm text-gray-500 mt-1">
                    +{images.length - 4} more images
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 py-2 border-t border-b">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                👍
              </div>
            </div>
            <span>{likeCount} likes</span>
          </div>
          <div className="flex gap-4">
            <span>{comments.length} comments</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 flex items-center justify-center gap-1 ${isLiked ? "text-blue-500" : "text-gray-500"}`}
            onClick={handleLike}
            disabled={isLiking}
          >
            <ThumbsUp className="w-4 h-4" />
            {isLiked ? "Liked" : "Like"}
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 flex items-center justify-center gap-1 text-gray-500">
            <MessageCircle className="w-4 h-4" />
            Comment
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 flex items-center justify-center gap-1 text-gray-500">
            <Share className="w-4 h-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

