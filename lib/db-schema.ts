// MongoDB Schema Definitions
// In production, these would be Mongoose schemas

export interface UserSchema {
  _id: string
  name: string
  email: string
  password: string // hashed
  createdAt: string
  updatedAt: string
}

export interface SessionSchema {
  _id: string
  title: string
  tags: string[]
  jsonUrl: string
  status: "draft" | "published"
  authorId: string // Reference to User._id
  createdAt: string
  updatedAt: string
}

// Validation schemas
export const sessionValidation = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 200,
  },
  tags: {
    type: "array",
    maxItems: 10,
    itemMaxLength: 50,
  },
  jsonUrl: {
    maxLength: 2000,
  },
  status: {
    enum: ["draft", "published"],
  },
}

export const userValidation = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    required: true,
    minLength: 6,
    maxLength: 128,
  },
}
