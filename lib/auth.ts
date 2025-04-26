import { compare, hash } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"
import { cookies } from "next/headers"
import { connectToDatabase } from "./db"
import { ObjectId } from "mongodb"
import type { UserWithoutPassword } from "./models/user"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword)
}

export function generateToken(user: UserWithoutPassword): string {
  return sign(
    {
      userId: user._id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

export function setAuthCookie(token: string): void {
  cookies().set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })
}

export function removeAuthCookie(): void {
  cookies().delete("auth_token")
}

export async function getCurrentUser(): Promise<UserWithoutPassword | null> {
  try {
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return null
    }

    const decoded = verify(token, JWT_SECRET) as { userId: string }
    const { db } = await connectToDatabase()

    const user = await db.collection("users").findOne({
      _id: new ObjectId(decoded.userId),
    })

    if (!user) {
      return null
    }

    // Remove password from user object
    const { password, ...userWithoutPassword } = user

    return userWithoutPassword as UserWithoutPassword
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

