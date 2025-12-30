const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Record = require("./models/Record");

const app = express();
app.use(cors());
app.use(express.json());

// mongoose.connect("mongodb://127.0.0.1:27017/church_records");
mongoose.connect(
  "mongodb+srv://ushers_admin:Obiagaeli47%40@ushers-cluster.nz4l1zf.mongodb.net/ushers_records"
);

// mongodb+srv://<db_username>:<db_password>@ushers-cluster.nz4l1zf.mongodb.net/?appName=ushers-cluster

app.post("/records", async (req, res) => {
  const record = new Record(req.body);
  console.log("record", record);
  await record.save();
  res.send({ success: true });
  //   console.log("res", res);
});

app.get("/records", async (req, res) => {
  const records = await Record.find().sort({ date: -1 });
  res.json(records);
});

app.listen(3000, () => console.log("Server running on port 3000"));
