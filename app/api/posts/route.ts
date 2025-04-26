import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"
import type { Post } from "@/lib/models/post"

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const userId = searchParams.get("userId")
    const skip = (page - 1) * limit

    // Build query
    const query: any = {}

    if (userId) {
      // If requesting a specific user's posts
      query.userId = new ObjectId(userId)

      // If not the current user, only show public and connections posts
      if (userId !== currentUser._id?.toString()) {
        const isConnected = await db.collection("connections").findOne({
          $or: [
            {
              requesterId: new ObjectId(currentUser._id as string),
              recipientId: new ObjectId(userId),
              status: "accepted",
            },
            {
              requesterId: new ObjectId(userId),
              recipientId: new ObjectId(currentUser._id as string),
              status: "accepted",
            },
          ],
        })

        if (isConnected) {
          // Show public and connections posts
          query.visibility = { $in: ["public", "connections"] }
        } else {
          // Only show public posts
          query.visibility = "public"
        }
      }
    } else {
      // Show posts from current user and connections
      const connections = await db
        .collection("connections")
        .find({
          $or: [
            { requesterId: new ObjectId(currentUser._id as string), status: "accepted" },
            { recipientId: new ObjectId(currentUser._id as string), status: "accepted" },
          ],
        })
        .toArray()

      const connectionIds = connections.map((conn) =>
        conn.requesterId.toString() === currentUser._id?.toString() ? conn.recipientId : conn.requesterId,
      )

      query.$or = [
        { userId: new ObjectId(currentUser._id as string) },
        {
          userId: { $in: connectionIds.map((id) => new ObjectId(id)) },
          visibility: { $in: ["public", "connections"] },
        },
        { visibility: "public" },
      ]
    }

    // Get posts with user information
    const posts = await db
      .collection("posts")
      .aggregate([
        { $match: query },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
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
      .toArray()

    // Get total count
    const total = await db.collection("posts").countDocuments(query)

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const { content, images, visibility } = await request.json()

    // Validate input
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Create new post
    const newPost: Post = {
      userId: new ObjectId(currentUser._id as string),
      content,
      images: images || [],
      likes: [],
      comments: [],
      visibility: visibility || "public",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("posts").insertOne(newPost)
    newPost._id = result.insertedId

    // Get user info
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(currentUser._id as string) }, { projection: { password: 0 } })

    return NextResponse.json(
      {
        message: "Post created successfully",
        post: {
          ...newPost,
          user,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}

