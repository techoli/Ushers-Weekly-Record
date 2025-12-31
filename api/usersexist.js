import connectToDatabase from "../db.js";
import User from "../models/User.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDatabase(process.env.MONGODB_URI);

    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing username or password" });
    }

    const user = await User.findOne({ username, password });
    if (user) {
      return res.status(200).json({ success: true, user });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.error("Error in /api/usersexist:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
