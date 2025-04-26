"use server"
import { connectToDatabase } from "@/lib/db"
import { hashPassword, verifyPassword, generateToken, setAuthCookie, removeAuthCookie } from "@/lib/auth"
import type { User } from "@/lib/models/user"

// Update the registerUser function to include profileImage
export async function registerUser(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const phone = formData.get("phone") as string
    const profileImage = formData.get("profileImage") as string

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return { error: "Missing required fields" }
    }

    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return { error: "User already exists with this email" }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create new user
    const newUser: User = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      profileImage, // Add profile image
      role: "user",
      connections: [],
      pendingConnections: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("users").insertOne(newUser)

    // Create user object without password for token
    const { password: _, ...userWithoutPassword } = newUser
    userWithoutPassword._id = result.insertedId

    // Generate token and set cookie
    const token = generateToken(userWithoutPassword)
    setAuthCookie(token)

    return { success: true, user: userWithoutPassword }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false }
  }
}

export async function loginUser(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Validate input
    if (!email || !password) {
      return { error: "Email and password are required" }
    }

    const { db } = await connectToDatabase()

    // Find user
    const user = await db.collection("users").findOne({ email })

    if (!user) {
      return { error: "Invalid email or password" }
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      return { error: "Invalid email or password" }
    }

    // Create user object without password for token
    const { password: _, ...userWithoutPassword } = user

    // Generate token and set cookie
    const token = generateToken(userWithoutPassword)
    setAuthCookie(token)

    return { success: true, user: userWithoutPassword }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "Failed to login" }
  }
}

export async function logoutUser() {
  try {
    removeAuthCookie()
    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { error: "Failed to logout" }
  }
}

