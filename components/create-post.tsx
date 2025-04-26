"use client"

import { useState } from "react"
import { FileText, ImageIcon, Link2, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { FileUpload } from "@/components/file-upload"
import { createPost } from "@/lib/actions/post-actions"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

interface CreatePostProps {
  userImage: string
  onPostCreated?: () => void
}

export function CreatePost({ userImage, onPostCreated }: CreatePostProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState("")
  const [visibility, setVisibility] = useState<"public" | "connections" | "private">("public")
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update the handleAddImage function to use the new file upload system
  const handleAddImage = (url: string) => {
    setImages([...images, url])
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!content.trim()) {
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
      formData.append("content", content)
      formData.append("visibility", visibility)

      images.forEach((image) => {
        formData.append("images", image)
      })

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
        setContent("")
        setVisibility("public")
        setImages([])
        setIsOpen(false)
        if (onPostCreated) {
          onPostCreated()
        }
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

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <div className="flex items-center gap-3 p-2 bg-gray-100 rounded-full mb-4 cursor-pointer">
              <Image
                src={userImage || "/images/user-avatar.png"}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-gray-500">Start a post...</span>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create a post</DialogTitle>
              <DialogDescription>Share your thoughts, articles, or updates with your network</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-start gap-3">
                <Image
                  src={userImage || "/images/user-avatar.png"}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-medium">Share with</h3>
                  <Select
                    value={visibility}
                    onValueChange={(value: "public" | "connections" | "private") => setVisibility(value)}
                  >
                    <SelectTrigger className="w-[180px] h-8 mt-1">
                      <SelectValue placeholder="Post visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Anyone</SelectItem>
                      <SelectItem value="connections">Connections only</SelectItem>
                      <SelectItem value="private">Only me</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Textarea
                placeholder="What do you want to talk about?"
                className="min-h-[150px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              {images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Uploaded image ${index + 1}`}
                        width={100}
                        height={100}
                        className="rounded-md object-cover w-24 h-24"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
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
                  ))}
                </div>
              )}

              {/* Replace the FileUpload component with: */}
              <FileUpload onUpload={handleAddImage} accept="image/*" type="posts" />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-[#0172af] hover:bg-[#015d8c]"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Post"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-full text-xs flex items-center gap-1">
            <FileText className="w-4 h-4" />
            Write Article
          </Button>
          <Button variant="outline" className="rounded-full text-xs flex items-center gap-1">
            <ImageIcon className="w-4 h-4" />
            Image
          </Button>
          <Button variant="outline" className="rounded-full text-xs flex items-center gap-1">
            <Video className="w-4 h-4" />
            Video
          </Button>
          <Button variant="outline" className="rounded-full text-xs flex items-center gap-1">
            <Link2 className="w-4 h-4" />
            Link
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

