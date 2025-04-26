import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"
import type { Comment } from "@/lib/models/post"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const { content } = await request.json()

    // Validate input
    if (!content) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 })
    }

    // Check if post exists
    const post = await db.collection("posts").findOne({ _id: new ObjectId(params.id) })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Create new comment
    const newComment: Comment = {
      _id: new ObjectId(),
      userId: new ObjectId(currentUser._id as string),
      content,
      createdAt: new Date(),
    }

    // Add comment to post
    await db.collection("posts").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $push: { comments: newComment },
        $set: { updatedAt: new Date() },
      },
    )

    // Get user info for the comment
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(currentUser._id as string) }, { projection: { password: 0 } })

    return NextResponse.json(
      {
        message: "Comment added successfully",
        comment: {
          ...newComment,
          user,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}

