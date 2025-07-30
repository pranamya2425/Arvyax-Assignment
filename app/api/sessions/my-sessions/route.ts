import { type NextRequest, NextResponse } from "next/server"
import { SessionModel } from "@/lib/models/Session"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get user's sessions
    const sessions = await SessionModel.findByAuthorId(decoded.userId)

    const formattedSessions = sessions.map((session) => ({
      ...session,
      _id: session._id!.toString(),
      authorId: session.authorId.toString(),
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
    }))

    return NextResponse.json({
      sessions: formattedSessions,
    })
  } catch (error) {
    console.error("Get user sessions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
