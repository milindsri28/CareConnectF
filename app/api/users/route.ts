import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    // Build query
    const query: any = {}

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { specialty: { $regex: search, $options: "i" } },
        { hospital: { $regex: search, $options: "i" } },
      ]
    }

    // Exclude current user
    query._id = { $ne: new ObjectId(currentUser._id as string) }

    // Get users
    const users = await db
      .collection("users")
      .find(query)
      .project({ password: 0 }) // Exclude password
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get total count
    const total = await db.collection("users").countDocuments(query)

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

