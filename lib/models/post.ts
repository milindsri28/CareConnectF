import type { ObjectId } from "mongodb"

export interface Post {
  _id?: ObjectId | string
  userId: ObjectId | string
  content: string
  images?: string[]
  likes?: string[] | ObjectId[]
  comments?: Comment[]
  visibility: "public" | "connections" | "private"
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  _id?: ObjectId | string
  userId: ObjectId | string
  content: string
  createdAt: Date
}

