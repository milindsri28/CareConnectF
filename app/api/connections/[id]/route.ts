import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const { status } = await request.json()

    // Validate input
    if (!status || !["accepted", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Get connection
    const connection = await db.collection("connections").findOne({ _id: new ObjectId(params.id) })

    if (!connection) {
      return NextResponse.json({ error: "Connection not found" }, { status: 404 })
    }

    // Check if current user is the recipient
    if (connection.recipientId.toString() !== currentUser._id?.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update connection status
    await db.collection("connections").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
    )

    // If accepted, update both users' connections
    if (status === "accepted") {
      // Add to requester's connections
      await db.collection("users").updateOne(
        { _id: connection.requesterId },
        {
          $addToSet: { connections: connection.recipientId },
          $pull: { pendingConnections: connection.recipientId },
        },
      )

      // Add to recipient's connections
      await db.collection("users").updateOne(
        { _id: connection.recipientId },
        {
          $addToSet: { connections: connection.requesterId },
          $pull: { pendingConnections: connection.requesterId },
        },
      )
    } else if (status === "rejected") {
      // Remove from pending connections
      await db
        .collection("users")
        .updateOne({ _id: connection.recipientId }, { $pull: { pendingConnections: connection.requesterId } })
    }

    return NextResponse.json({
      message: `Connection request ${status}`,
      status,
    })
  } catch (error) {
    console.error("Error updating connection:", error)
    return NextResponse.json({ error: "Failed to update connection" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Get connection
    const connection = await db.collection("connections").findOne({ _id: new ObjectId(params.id) })

    if (!connection) {
      return NextResponse.json({ error: "Connection not found" }, { status: 404 })
    }

    // Check if current user is part of the connection
    if (
      connection.requesterId.toString() !== currentUser._id?.toString() &&
      connection.recipientId.toString() !== currentUser._id?.toString()
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete connection
    await db.collection("connections").deleteOne({ _id: new ObjectId(params.id) })

    // Remove from both users' connections
    await db.collection("users").updateOne(
      { _id: connection.requesterId },
      {
        $pull: {
          connections: connection.recipientId,
          pendingConnections: connection.recipientId,
        },
      },
    )

    await db.collection("users").updateOne(
      { _id: connection.recipientId },
      {
        $pull: {
          connections: connection.requesterId,
          pendingConnections: connection.requesterId,
        },
      },
    )

    return NextResponse.json({
      message: "Connection removed successfully",
    })
  } catch (error) {
    console.error("Error removing connection:", error)
    return NextResponse.json({ error: "Failed to remove connection" }, { status: 500 })
  }
}

