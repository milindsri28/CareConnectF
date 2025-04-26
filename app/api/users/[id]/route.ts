import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Get user by ID
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(params.id) },
      { projection: { password: 0 } }, // Exclude password
    )

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only allow users to update their own profile
    if (currentUser._id?.toString() !== params.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { db } = await connectToDatabase()
    const updateData = await request.json()

    // Remove fields that shouldn't be updated directly
    delete updateData._id
    delete updateData.password
    delete updateData.email
    delete updateData.createdAt

    // Add updatedAt timestamp
    updateData.updatedAt = new Date()

    // Update user
    const result = await db.collection("users").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get updated user
    const updatedUser = await db
      .collection("users")
      .findOne({ _id: new ObjectId(params.id) }, { projection: { password: 0 } })

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

