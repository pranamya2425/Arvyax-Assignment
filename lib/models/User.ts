import { ObjectId } from "mongodb"
import { getDatabase } from "../mongodb"
import bcrypt from "bcryptjs"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export class UserModel {
  private static collection = "users"

  static async create(userData: Omit<User, "_id" | "createdAt" | "updatedAt">): Promise<User> {
    const db = await getDatabase()
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    const user: Omit<User, "_id"> = {
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection(this.collection).insertOne(user)
    return { ...user, _id: result.insertedId }
  }

  static async findByEmail(email: string): Promise<User | null> {
    const db = await getDatabase()
    return await db.collection<User>(this.collection).findOne({ email })
  }

  static async findById(id: string | ObjectId): Promise<User | null> {
    const db = await getDatabase()
    const objectId = typeof id === "string" ? new ObjectId(id) : id
    return await db.collection<User>(this.collection).findOne({ _id: objectId })
  }

  static async updateById(id: string | ObjectId, updateData: Partial<User>): Promise<User | null> {
    const db = await getDatabase()
    const objectId = typeof id === "string" ? new ObjectId(id) : id

    const result = await db.collection<User>(this.collection).findOneAndUpdate(
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

  static async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }
}
