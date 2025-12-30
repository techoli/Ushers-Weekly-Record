import mongoose from "mongoose";
import Record from "./models/Record.js";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGO_URI in .env");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === "POST") {
      const record = await Record.create(req.body);
      return res.status(201).json({ success: true, record });
    }

    if (req.method === "GET") {
      const records = await Record.find().sort({ createdAt: -1 });
      return res.status(200).json(records);
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
