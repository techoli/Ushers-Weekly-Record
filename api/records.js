import connectToDatabase from "../db";
import Record from "../models/Record";

export default async function handler(req, res) {
  await connectToDatabase(process.env.MONGODB_URI);

  if (req.method === "GET") {
    // Get all records sorted by createdAt descending
    try {
      const records = await Record.find().sort({ createdAt: -1 });
      return res.status(200).json(records);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  } else if (req.method === "POST") {
    // Save new record
    try {
      const record = new Record(req.body);
      await record.save();
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
