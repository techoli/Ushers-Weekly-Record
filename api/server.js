const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Record = require("./models/Record.js");

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

app.get("/api/records", async (req, res) => {
  const records = await Record.find().sort({ createdAt: -1 });
  res.json(records);
});

app.post("/api/records", async (req, res) => {
  const record = new Record(req.body);
  await record.save();
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
