"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Bookmark, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { toast } from "@/components/ui/use-toast"

interface JobCompany {
  _id: string
  firstName: string
  lastName: string
  profileImage?: string
  role?: string
  hospital?: string
}

interface JobProps {
  _id: string
  title: string
  company: string
  location: string
  description: string
  requirements: string[]
  type: string
  experience: string
  salary?: {
    min: number
    max: number
    currency: string
  }
  createdAt: string
  companyInfo?: JobCompany
  currentUserId: string
  onDelete?: () => void
}

export function JobCard({
  _id,
  title,
  company,
  location,
  type,
  experience,
  createdAt,
  companyInfo,
  currentUserId,
  onDelete,
}: JobProps) {
  const [isSaved, setIsSaved] = useState(false)

  const handleSaveJob = () => {
    setIsSaved(!isSaved)
    toast({
      title: isSaved ? "Job removed" : "Job saved",
      description: isSaved ? "Job removed from saved jobs" : "Job saved to your profile",
    })
  }

  const handleApply = () => {
    toast({
      title: "Application submitted",
      description: "Your application has been submitted successfully",
    })
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/jobs/${_id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete job")
      }

      toast({
        title: "Success",
        description: "Job deleted successfully",
      })

      if (onDelete) {
        onDelete()
      }
    } catch (error) {
      console.error("Error deleting job:", error)
      toast({
        title: "Error",
        description: "Failed to delete job. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isOwner = companyInfo && companyInfo._id === currentUserId

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Image
            src={companyInfo?.profileImage || "/images/hospital-1.png"}
            alt={company}
            width={80}
            height={80}
            className="rounded"
          />
          <div className="flex-1">
            <div className="flex justify-between">
              <h2 className="text-lg font-medium">
                <Link href={`/jobs/${_id}`} className="text-[#0172af] hover:underline">
                  {title}
                </Link>
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSaveJob}
                  className={isSaved ? "text-[#0172af]" : "text-gray-400"}
                >
                  <Bookmark className="w-5 h-5" />
                </Button>

                {isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-5 h-5 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Job</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
                        Delete Job
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            <p className="text-gray-600">{company}</p>
            <p className="text-gray-500 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {location}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="bg-[#e6f7ff] text-[#0172af] text-xs px-2 py-1 rounded-full">{type}</span>
              <span className="bg-[#e6f7ff] text-[#0172af] text-xs px-2 py-1 rounded-full">{experience}</span>
              <span className="bg-[#e6f7ff] text-[#0172af] text-xs px-2 py-1 rounded-full">Medical</span>
            </div>
            <div className="mt-2 flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-1" /> Posted {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </div>

            {!isOwner && (
              <div className="mt-4">
                <Button className="bg-[#0172af] hover:bg-[#015d8c] rounded-full" onClick={handleApply}>
                  Apply Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

