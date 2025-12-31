const connectToDatabase = require("../db");
const User = require("../models/User");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body;

  try {
    await connectToDatabase(process.env.MONGODB_URI);
    const user = await User.findOne({ username, password });

    if (user) {
      return res.status(200).json({ success: true, user });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
