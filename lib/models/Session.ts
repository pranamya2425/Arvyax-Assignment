import { ObjectId } from "mongodb"
import { getDatabase } from "../mongodb"

export interface Session {
  _id?: ObjectId
  title: string
  tags: string[]
  jsonUrl: string
  status: "draft" | "published"
  authorId: ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface SessionWithAuthor extends Omit<Session, "authorId"> {
  author: {
    _id: ObjectId
    name: string
    email: string
  }
}

export class SessionModel {
  private static collection = "sessions"

  static async create(sessionData: Omit<Session, "_id" | "createdAt" | "updatedAt">): Promise<Session> {
    const db = await getDatabase()

    const session: Omit<Session, "_id"> = {
      ...sessionData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection(this.collection).insertOne(session)
    return { ...session, _id: result.insertedId }
  }

  static async findById(id: string | ObjectId): Promise<Session | null> {
    const db = await getDatabase()
    const objectId = typeof id === "string" ? new ObjectId(id) : id
    return await db.collection<Session>(this.collection).findOne({ _id: objectId })
  }

  static async findByAuthorId(authorId: string | ObjectId): Promise<Session[]> {
    const db = await getDatabase()
    const objectId = typeof authorId === "string" ? new ObjectId(authorId) : authorId

    return await db.collection<Session>(this.collection).find({ authorId: objectId }).sort({ updatedAt: -1 }).toArray()
  }

  static async findPublished(): Promise<SessionWithAuthor[]> {
    const db = await getDatabase()

    const pipeline = [
      { $match: { status: "published" } },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $project: {
          title: 1,
          tags: 1,
          jsonUrl: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          "author._id": 1,
          "author.name": 1,
          "author.email": 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]

    return await db.collection(this.collection).aggregate<SessionWithAuthor>(pipeline).toArray()
  }

  static async updateById(id: string | ObjectId, updateData: Partial<Session>): Promise<Session | null> {
    const db = await getDatabase()
    const objectId = typeof id === "string" ? new ObjectId(id) : id

    const result = await db.collection<Session>(this.collection).findOneAndUpdate(
      { _id: objectId },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    return result || null
  }

  static async deleteById(id: string | ObjectId): Promise<boolean> {
    const db = await getDatabase()
    const objectId = typeof id === "string" ? new ObjectId(id) : id

    const result = await db.collection(this.collection).deleteOne({ _id: objectId })
    return result.deletedCount === 1
  }

  static async findByIdAndAuthor(id: string | ObjectId, authorId: string | ObjectId): Promise<Session | null> {
    const db = await getDatabase()
    const sessionObjectId = typeof id === "string" ? new ObjectId(id) : id
    const authorObjectId = typeof authorId === "string" ? new ObjectId(authorId) : authorId

    return await db.collection<Session>(this.collection).findOne({
      _id: sessionObjectId,
      authorId: authorObjectId,
    })
  }
}
