"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/file-upload"
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
  bio?: string
}

export function ProfileEdit({ user }: { user: User }) {
  const [firstName, setFirstName] = useState(user.firstName || "")
  const [lastName, setLastName] = useState(user.lastName || "")
  const [specialty, setSpecialty] = useState(user.specialty || "")
  const [hospital, setHospital] = useState(user.hospital || "")
  const [bio, setBio] = useState(user.bio || "")
  const [profileImage, setProfileImage] = useState(user.profileImage || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleProfileImageUpload = (url: string) => {
    setProfileImage(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          specialty,
          hospital,
          bio,
          profileImage,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      // Don't show error to user
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              {profileImage ? (
                <Image
                  src={profileImage || "/placeholder.svg"}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </div>
            <FileUpload onUpload={handleProfileImageUpload} type="profile" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="specialty" className="text-sm font-medium">
                Specialty
              </label>
              <Input id="specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label htmlFor="hospital" className="text-sm font-medium">
                Hospital/Institution
              </label>
              <Input id="hospital" value={hospital} onChange={(e) => setHospital(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">
              Bio
            </label>
            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="min-h-[100px]" />
          </div>

          <Button type="submit" className="w-full bg-[#0172af] hover:bg-[#015d8c]" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

