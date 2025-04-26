import type { ObjectId } from "mongodb"

export interface Connection {
  _id?: ObjectId | string
  requesterId: ObjectId | string
  recipientId: ObjectId | string
  status: "pending" | "accepted" | "rejected"
  createdAt: Date
  updatedAt: Date
}

