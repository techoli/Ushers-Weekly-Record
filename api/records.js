import connectToDatabase from "db.js";
import Record from "../models/Record.js";

export default async function handler(req, res) {
  await connectToDatabase(process.env.MONGODB_URI);

  if (req.method === "GET") {
    try {
      const records = await Record.find().sort({ createdAt: -1 });
      return res.status(200).json(records);
    } catch (err) {
      console.error("Error fetching records:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  } else if (req.method === "POST") {
    try {
      const record = new Record(req.body);
      await record.save();
      return res.status(200).json({ success: true, message: "Record saved" });
    } catch (err) {
      console.error("Error saving record:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
