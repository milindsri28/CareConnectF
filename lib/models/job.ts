import type { ObjectId } from "mongodb"

export interface Job {
  _id?: ObjectId | string
  title: string
  company: string
  location: string
  description: string
  requirements: string[]
  type: "full-time" | "part-time" | "contract" | "temporary" | "internship"
  experience: "entry" | "associate" | "mid-senior" | "director" | "executive"
  salary?: {
    min: number
    max: number
    currency: string
  }
  postedBy: ObjectId | string
  applicants?: (ObjectId | string)[]
  status: "active" | "closed"
  createdAt: Date
  updatedAt: Date
}

