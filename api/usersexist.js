import connectToDatabase from "../db";
import User from "../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("Connecting to database...");
    await connectToDatabase(process.env.MONGODB_URI);
    console.log("Database connected");

    const { username, password } = req.body;
    console.log("Body received:", req.body);

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
