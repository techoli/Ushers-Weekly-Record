const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Record = require("./models/Record.js");
const User = require("./models/User.js");

const app = express();
app.use(cors());
app.use(express.json());
console.log("env" + process.env.MONGODB_URI);
mongoose
  .connect(process.env.MONGODB_URI)
  //   .connect(
  //     "mongodb+srv://ushers_admin:Obiagaeli47%40@ushers-cluster.nz4l1zf.mongodb.net/ushers_records"
  //   )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

//get all record
app.get("/api/records", async (req, res) => {
  const records = await Record.find().sort({ createdAt: -1 });
  res.json(records);
});

//check user exists
// POST /api/usersexist
app.post("/api/usersexist", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password }); // assuming Record is your users collection
    if (user) {
      return res.json({ success: true, user });
    } else {
      return res.json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

//save record
app.post("/api/records", async (req, res) => {
  const record = new Record(req.body);
  await record.save();
  res.json({ success: true });
});

//save user
app.post("/api/users", async (req, res) => {
  console.log("got to user");
  const record = new User(req.body);
  await record.save();
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
