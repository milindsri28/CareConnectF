import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = (formData.get("type") as string) || "posts" // Default to posts if not specified

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Create user directory if it doesn't exist
    const userId = currentUser._id.toString()
    const userDir = join(process.cwd(), "public", "uploads", userId)
    await mkdir(userDir, { recursive: true })

    // Create type directory (profile or posts)
    const typeDir = join(userDir, type)
    await mkdir(typeDir, { recursive: true })

    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const fileExtension = file.name.split(".").pop()
    const fileName = `${uniqueSuffix}.${fileExtension}`
    const filePath = join(typeDir, fileName)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Return the file URL
    const fileUrl = `/uploads/${userId}/${type}/${fileName}`

    return NextResponse.json({
      message: "File uploaded successfully",
      url: fileUrl,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    // Don't expose error details to frontend
    return NextResponse.json({ url: null }, { status: 200 })
  }
}

