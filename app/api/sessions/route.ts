import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { SessionModel } from "@/lib/models/Session"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { title, tags, jsonUrl, status } = await request.json()

    // Validation
    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Create session
    const session = await SessionModel.create({
      title: title.trim(),
      tags: tags || [],
      jsonUrl: jsonUrl || "",
      status: status || "draft",
      authorId: new ObjectId(decoded.userId),
    })

    return NextResponse.json({
      message: "Session created successfully",
      session: {
        ...session,
        _id: session._id!.toString(),
        authorId: session.authorId.toString(),
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Create session error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
