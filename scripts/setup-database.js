// Database setup script for MongoDB
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') }); // Load .env.local file
const { MongoClient } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "wellness-app";

console.log("Using MongoDB URI:", MONGODB_URI); // Debug line to verify URI

async function setupDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    const db = client.db(DB_NAME);
    
    // Create indexes for better performance
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("sessions").createIndex({ authorId: 1 });
    await db.collection("sessions").createIndex({ status: 1 });
    await db.collection("sessions").createIndex({ createdAt: -1 });
    await db.collection("sessions").createIndex({ tags: 1 });
    
    console.log("Database indexes created successfully");
    
    // Create sample data (optional)
    const usersCount = await db.collection("users").countDocuments();
    if (usersCount === 0) {
      console.log("Creating sample data...");
      
      // This would be done through the API in real usage
      console.log("Use the registration API to create users and sessions");
    }
  } catch (error) {
    console.error("Database setup error:", error);
  } finally {
    await client.close();
  }
}

setupDatabase();