"use server"

import { connectToDatabase } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"
import type { Connection } from "@/lib/models/connection"

export async function sendConnectionRequest(recipientId: string) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return { error: "Unauthorized" }
    }

    // Validate input
    if (!recipientId) {
      return { error: "Recipient ID is required" }
    }

    const { db } = await connectToDatabase()

    // Check if recipient exists
    const recipient = await db.collection("users").findOne({ _id: new ObjectId(recipientId) })

    if (!recipient) {
      return { error: "Recipient not found" }
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
      return { error: "Connection request already exists" }
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

    return {
      success: true,
      connection: newConnection,
    }
  } catch (error) {
    console.error("Error sending connection request:", error)
    return { error: "Failed to send connection request" }
  }
}

export async function respondToConnectionRequest(connectionId: string, accept: boolean) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return { error: "Unauthorized" }
    }

    const { db } = await connectToDatabase()
    const status = accept ? "accepted" : "rejected"

    // Get connection
    const connection = await db.collection("connections").findOne({ _id: new ObjectId(connectionId) })

    if (!connection) {
      return { error: "Connection not found" }
    }

    // Check if current user is the recipient
    if (connection.recipientId.toString() !== currentUser._id?.toString()) {
      return { error: "Forbidden" }
    }

    // Update connection status
    await db.collection("connections").updateOne(
      { _id: new ObjectId(connectionId) },
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

    return {
      success: true,
      status,
    }
  } catch (error) {
    console.error("Error responding to connection request:", error)
    return { error: "Failed to respond to connection request" }
  }
}

