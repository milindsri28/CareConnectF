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

    // Get post with user information
    const post = await db
      .collection("posts")
      .aggregate([
        { $match: { _id: new ObjectId(params.id) } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            "user.password": 0,
          },
        },
      ])
      .next()

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if user has access to this post
    if (post.visibility === "private" && post.userId.toString() !== currentUser._id?.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (post.visibility === "connections" && post.userId.toString() !== currentUser._id?.toString()) {
      // Check if users are connected
      const isConnected = await db.collection("connections").findOne({
        $or: [
          { requesterId: new ObjectId(currentUser._id as string), recipientId: post.userId, status: "accepted" },
          { requesterId: post.userId, recipientId: new ObjectId(currentUser._id as string), status: "accepted" },
        ],
      })

      if (!isConnected) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Check if post exists and belongs to current user
    const post = await db.collection("posts").findOne({ _id: new ObjectId(params.id) })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    if (post.userId.toString() !== currentUser._id?.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updateData = await request.json()

    // Remove fields that shouldn't be updated directly
    delete updateData._id
    delete updateData.userId
    delete updateData.createdAt

    // Add updatedAt timestamp
    updateData.updatedAt = new Date()

    // Update post
    await db.collection("posts").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    // Get updated post with user information
    const updatedPost = await db
      .collection("posts")
      .aggregate([
        { $match: { _id: new ObjectId(params.id) } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            "user.password": 0,
          },
        },
      ])
      .next()

    return NextResponse.json({
      message: "Post updated successfully",
      post: updatedPost,
    })
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Check if post exists and belongs to current user
    const post = await db.collection("posts").findOne({ _id: new ObjectId(params.id) })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    if (post.userId.toString() !== currentUser._id?.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete post
    await db.collection("posts").deleteOne({ _id: new ObjectId(params.id) })

    return NextResponse.json({
      message: "Post deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}

