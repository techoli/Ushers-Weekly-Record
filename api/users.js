import connectToDatabase from "./db.js";
import User from "../models/User.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDatabase(process.env.MONGODB_URI);

    // Validate input
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing username or password" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    // Save new user
    const user = new User(req.body);
    await user.save();

    return res.status(200).json({ success: true, message: "User created" });
  } catch (err) {
    console.error("Error in /api/users:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
