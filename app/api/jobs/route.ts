import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"
import type { Job } from "@/lib/models/job"

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
    const location = searchParams.get("location") || ""
    const type = searchParams.get("type") || ""
    const experience = searchParams.get("experience") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    // Build query
    const query: any = { status: "active" }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    if (location) {
      query.location = { $regex: location, $options: "i" }
    }

    if (type) {
      query.type = type
    }

    if (experience) {
      query.experience = experience
    }

    // Get jobs with company information
    const jobs = await db
      .collection("jobs")
      .aggregate([
        { $match: query },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "users",
            localField: "postedBy",
            foreignField: "_id",
            as: "company",
          },
        },
        { $unwind: "$company" },
        {
          $project: {
            "company.password": 0,
          },
        },
      ])
      .toArray()

    // Get total count
    const total = await db.collection("jobs").countDocuments(query)

    return NextResponse.json({
      jobs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const jobData = await request.json()

    // Validate input
    if (!jobData.title || !jobData.company || !jobData.location || !jobData.description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new job
    const newJob: Job = {
      title: jobData.title,
      company: jobData.company,
      location: jobData.location,
      description: jobData.description,
      requirements: jobData.requirements || [],
      type: jobData.type || "full-time",
      experience: jobData.experience || "entry",
      salary: jobData.salary,
      postedBy: new ObjectId(currentUser._id as string),
      applicants: [],
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("jobs").insertOne(newJob)
    newJob._id = result.insertedId

    return NextResponse.json(
      {
        message: "Job posted successfully",
        job: newJob,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error posting job:", error)
    return NextResponse.json({ error: "Failed to post job" }, { status: 500 })
  }
}

