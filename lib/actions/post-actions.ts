"use server"

import { connectToDatabase } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"
import type { Post } from "@/lib/models/post"

export async function createPost(formData: FormData) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return { error: "Unauthorized" }
    }

    const content = formData.get("content") as string
    const visibility = formData.get("visibility") as "public" | "connections" | "private"

    // Get images from formData
    const images: string[] = []
    const imageUrls = formData.getAll("images") as string[]
    if (imageUrls && imageUrls.length > 0) {
      images.push(...imageUrls)
    }

    // Validate input
    if (!content) {
      return { error: "Content is required" }
    }

    const { db } = await connectToDatabase()

    // Create new post
    const newPost: Post = {
      userId: new ObjectId(currentUser._id as string),
      content,
      images,
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

    return {
      success: true,
      post: {
        ...newPost,
        user,
      },
    }
  } catch (error) {
    console.error("Error creating post:", error)
    return { error: "Failed to create post" }
  }
}

export async function likePost(postId: string) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return { error: "Unauthorized" }
    }

    const { db } = await connectToDatabase()

    // Check if post exists
    const post = await db.collection("posts").findOne({ _id: new ObjectId(postId) })

    if (!post) {
      return { error: "Post not found" }
    }

    // Check if user has already liked the post
    const alreadyLiked = post.likes?.some((id: ObjectId | string) => id.toString() === currentUser._id?.toString())

    if (alreadyLiked) {
      // Unlike the post
      await db.collection("posts").updateOne(
        { _id: new ObjectId(postId) },
        {
          $pull: { likes: new ObjectId(currentUser._id as string) },
          $set: { updatedAt: new Date() },
        },
      )

      return {
        success: true,
        liked: false,
      }
    } else {
      // Like the post
      await db.collection("posts").updateOne(
        { _id: new ObjectId(postId) },
        {
          $addToSet: { likes: new ObjectId(currentUser._id as string) },
          $set: { updatedAt: new Date() },
        },
      )

      return {
        success: true,
        liked: true,
      }
    }
  } catch (error) {
    console.error("Error liking/unliking post:", error)
    return { error: "Failed to like/unlike post" }
  }
}

