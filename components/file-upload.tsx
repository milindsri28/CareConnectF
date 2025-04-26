"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface FileUploadProps {
  onUpload: (url: string) => void
  accept?: string
  maxSize?: number // in MB
  className?: string
  type?: "profile" | "posts" // Type of upload
}

export function FileUpload({ onUpload, accept = "image/*", maxSize = 5, className, type = "posts" }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`)
      return
    }

    setError(null)
    setIsUploading(true)

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      if (data.url) {
        onUpload(data.url)
      } else {
        console.error("Upload failed: No URL returned")
        // Don't show error to user
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      // Don't show error to user
    } finally {
      setIsUploading(false)
    }
  }

  const handleClearPreview = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {isUploading ? "Uploading..." : "Upload File"}
        </Button>
        <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
      </div>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

      {preview && (
        <div className="relative mt-2 inline-block">
          <Image
            src={preview || "/placeholder.svg"}
            alt="Preview"
            width={200}
            height={200}
            className="max-h-40 rounded-md object-contain"
          />
          <button
            type="button"
            onClick={handleClearPreview}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  )
}

