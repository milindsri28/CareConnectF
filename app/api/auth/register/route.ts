import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth"
import type { User } from "@/lib/models/user"

// Update the POST function to include profileImage
export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, phone, profileImage } = await request.json()

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 })
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

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: userWithoutPassword,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}

