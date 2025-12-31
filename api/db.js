// api/db.js
import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  const MONGO_URI =
    "mongodb+srv://ushers_admin:Obiagaeli47%40@ushers-cluster.nz4l1zf.mongodb.net/ushers_records?retryWrites=true&w=majority";

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
