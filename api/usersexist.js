import connectToDatabase from "./db.js";
import User from "./models/User.js";

const MONGO_URI =
  "mongodb+srv://ushers_admin:Obiagaeli47%40@ushers-cluster.nz4l1zf.mongodb.net/ushers_records?retryWrites=true&w=majority";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDatabase(MONGO_URI);

    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing credentials" });
    }

    const user = await User.findOne({ username, password });

    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
