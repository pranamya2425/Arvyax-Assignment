import jwt from "jsonwebtoken"
import type { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface User {
  _id: ObjectId
  name: string
  email: string
  createdAt: string
}

export interface DecodedToken {
  userId: string
  email: string
  iat: number
  exp: number
}

export function generateToken(user: User): string {
  return jwt.sign({ userId: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken
  } catch (error) {
    return null
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("authorization")
  return authHeader && authHeader.split(" ")[1]
}
