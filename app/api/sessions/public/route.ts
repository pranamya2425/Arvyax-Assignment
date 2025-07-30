import { type NextRequest, NextResponse } from "next/server"
import { SessionModel } from "@/lib/models/Session"

export async function GET(request: NextRequest) {
  try {
    // Get published sessions with author information
    const sessions = await SessionModel.findPublished()

    const formattedSessions = sessions.map((session) => ({
      ...session,
      _id: session._id!.toString(),
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
      author: {
        ...session.author,
        _id: session.author._id.toString(),
      },
    }))

    return NextResponse.json({
      sessions: formattedSessions,
    })
  } catch (error) {
    console.error("Get public sessions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
