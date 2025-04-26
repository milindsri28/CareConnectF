import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"
import type { Connection } from "@/lib/models/connection"

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "accepted"
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    // Build query
    const query: any = {
      $or: [
        { requesterId: new ObjectId(currentUser._id as string) },
        { recipientId: new ObjectId(currentUser._id as string) },
      ],
      status,
    }

    // Get connections with user information
    const connections = await db
      .collection("connections")
      .aggregate([
        { $match: query },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "users",
            localField: "requesterId",
            foreignField: "_id",
            as: "requester",
          },
        },
        { $unwind: "$requester" },
        {
          $lookup: {
            from: "users",
            localField: "recipientId",
            foreignField: "_id",
            as: "recipient",
          },
        },
        { $unwind: "$recipient" },
        {
          $project: {
            "requester.password": 0,
            "recipient.password": 0,
          },
        },
      ])
      .toArray()

    // Get total count
    const total = await db.collection("connections").countDocuments(query)

    return NextResponse.json({
      connections,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching connections:", error)
    return NextResponse.json({ error: "Failed to fetch connections" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const { recipientId } = await request.json()

    // Validate input
    if (!recipientId) {
      return NextResponse.json({ error: "Recipient ID is required" }, { status: 400 })
    }

    // Check if recipient exists
    const recipient = await db.collection("users").findOne({ _id: new ObjectId(recipientId) })

    if (!recipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 })
    }

    // Check if connection already exists
    const existingConnection = await db.collection("connections").findOne({
      $or: [
        {
          requesterId: new ObjectId(currentUser._id as string),
          recipientId: new ObjectId(recipientId),
        },
        {
          requesterId: new ObjectId(recipientId),
          recipientId: new ObjectId(currentUser._id as string),
        },
      ],
    })

    if (existingConnection) {
      return NextResponse.json({ error: "Connection request already exists" }, { status: 409 })
    }

    // Create new connection request
    const newConnection: Connection = {
      requesterId: new ObjectId(currentUser._id as string),
      recipientId: new ObjectId(recipientId),
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("connections").insertOne(newConnection)
    newConnection._id = result.insertedId

    // Update recipient's pending connections
    await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(recipientId) },
        { $addToSet: { pendingConnections: new ObjectId(currentUser._id as string) } },
      )

    return NextResponse.json(
      {
        message: "Connection request sent successfully",
        connection: newConnection,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error sending connection request:", error)
    return NextResponse.json({ error: "Failed to send connection request" }, { status: 500 })
  }
}

