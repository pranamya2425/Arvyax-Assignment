import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { SessionModel } from "@/lib/models/Session"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionId = params.id

    // Validate ObjectId
    if (!ObjectId.isValid(sessionId)) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 })
    }

    const session = await SessionModel.findById(sessionId)
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Check if session is published or if user owns it
    if (session.status === "draft") {
      const token = getTokenFromRequest(request)
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const decoded = verifyToken(token)
      if (!decoded || session.authorId.toString() !== decoded.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    return NextResponse.json({
      session: {
        ...session,
        _id: session._id!.toString(),
        authorId: session.authorId.toString(),
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Get session error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const sessionId = params.id
    const { title, tags, jsonUrl, status } = await request.json()

    // Validate ObjectId
    if (!ObjectId.isValid(sessionId)) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 })
    }

    // Check if user owns this session
    const existingSession = await SessionModel.findByIdAndAuthor(sessionId, decoded.userId)
    if (!existingSession) {
      return NextResponse.json({ error: "Session not found or unauthorized" }, { status: 404 })
    }

    // Validation
    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Update session
    const updatedSession = await SessionModel.updateById(sessionId, {
      title: title.trim(),
      tags: tags || [],
      jsonUrl: jsonUrl || "",
      status: status || existingSession.status,
    })

    if (!updatedSession) {
      return NextResponse.json({ error: "Failed to update session" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Session updated successfully",
      session: {
        ...updatedSession,
        _id: updatedSession._id!.toString(),
        authorId: updatedSession.authorId.toString(),
        createdAt: updatedSession.createdAt.toISOString(),
        updatedAt: updatedSession.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Update session error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const sessionId = params.id

    // Validate ObjectId
    if (!ObjectId.isValid(sessionId)) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 })
    }

    // Check if user owns this session
    const session = await SessionModel.findByIdAndAuthor(sessionId, decoded.userId)
    if (!session) {
      return NextResponse.json({ error: "Session not found or unauthorized" }, { status: 404 })
    }

    // Delete session
    const deleted = await SessionModel.deleteById(sessionId)
    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete session" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Session deleted successfully",
    })
  } catch (error) {
    console.error("Delete session error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
