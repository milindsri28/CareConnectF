import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Check if post exists
    const post = await db.collection("posts").findOne({ _id: new ObjectId(params.id) })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if user has already liked the post
    const alreadyLiked = post.likes?.some((id: ObjectId | string) => id.toString() === currentUser._id?.toString())

    if (alreadyLiked) {
      // Unlike the post
      await db.collection("posts").updateOne(
        { _id: new ObjectId(params.id) },
        {
          $pull: { likes: new ObjectId(currentUser._id as string) },
          $set: { updatedAt: new Date() },
        },
      )

      return NextResponse.json({
        message: "Post unliked successfully",
        liked: false,
      })
    } else {
      // Like the post
      await db.collection("posts").updateOne(
        { _id: new ObjectId(params.id) },
        {
          $addToSet: { likes: new ObjectId(currentUser._id as string) },
          $set: { updatedAt: new Date() },
        },
      )

      return NextResponse.json({
        message: "Post liked successfully",
        liked: true,
      })
    }
  } catch (error) {
    console.error("Error liking/unliking post:", error)
    return NextResponse.json({ error: "Failed to like/unlike post" }, { status: 500 })
  }
}

