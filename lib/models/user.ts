import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId | string
  firstName: string
  lastName: string
  email: string
  password?: string
  phone?: string
  role: string
  specialty?: string
  hospital?: string
  location?: string
  bio?: string
  profileImage?: string
  coverImage?: string
  connections?: string[] | ObjectId[]
  pendingConnections?: string[] | ObjectId[]
  createdAt: Date
  updatedAt: Date
}

export interface UserWithoutPassword extends Omit<User, "password"> {
  password?: never
}

